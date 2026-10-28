import { supabase } from './supabaseClient';
import { getAuthorNames } from './authorNames';

export interface Comment {
	id: string;
	body: string;
	createdAt: string;
	authorName: string;
}

interface CommentRow {
	id: string;
	body: unknown;
	created_at: string;
	user_id: string | null;
	author: { name: string } | null;
}

const MAX_BODY_LENGTH = 2000;

export function mapCommentRow(row: CommentRow): Comment {
	if (typeof row.body !== 'string' || row.body.length === 0) {
		throw new Error('BLOCKER: data contract comments.body mismatch');
	}

	return {
		id: row.id,
		body: row.body,
		createdAt: row.created_at,
		authorName: row.author?.name ?? 'Penulis anonim'
	};
}

export async function getComments(contentId: string): Promise<{
	data: Comment[];
	error: string | null;
}> {
	const { data, error } = await supabase
		.from('comments')
		.select('id, body, created_at, user_id')
		.eq('content_id', contentId)
		.order('created_at', { ascending: true });

	if (error) {
		return { data: [], error: error.message };
	}

	const rows = (data ?? []) as unknown as CommentRow[];
	const names = await getAuthorNames(rows.map((row) => row.user_id));

	const comments: Comment[] = [];
	for (const row of rows) {
		try {
			const name = row.user_id ? names.get(row.user_id) : undefined;
			comments.push(mapCommentRow({ ...row, author: name ? { name } : null }));
		} catch (err) {
			console.error('Skipping malformed comment row:', err instanceof Error ? err.message : err);
		}
	}
	return { data: comments, error: null };
}
export async function addComment(
	contentId: string,
	body: string
): Promise<{ data: Comment | null; error: string | null }> {
	const trimmed = body.trim();

	if (trimmed.length === 0) {
		return { data: null, error: 'Komentar tidak boleh kosong.' };
	}

	if (trimmed.length > MAX_BODY_LENGTH) {
		return { data: null, error: `Komentar maksimal ${MAX_BODY_LENGTH} karakter.` };
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { data: null, error: 'Not signed in' };

	const { data, error } = await supabase
		.from('comments')
		.insert({ content_id: contentId, user_id: user.id, body: trimmed })
		.select('id, body, created_at, author:profiles!comments_user_id_fkey(name)')
		.single();

	if (error) {
		return { data: null, error: error.message };
	}

	try {
		return { data: mapCommentRow(data as unknown as CommentRow), error: null };
	} catch (err) {
		return {
			data: null,
			error: err instanceof Error ? err.message : 'BLOCKER: comments contract mismatch'
		};
	}
}

export async function deleteComment(id: string): Promise<{ error: string | null }> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { error: 'Not signed in' };

	const { error } = await supabase.from('comments').delete().eq('id', id).eq('user_id', user.id);

	return { error: error?.message ?? null };
}

export interface OwnComment {
	id: string;
	body: string;
	createdAt: string;
	contentId: string;
	contentTitle: string;
}

interface OwnCommentRow {
	id: string;
	body: string;
	created_at: string;
	content_id: string;
	content: { title: string } | null;
}

export function mapOwnComment(row: OwnCommentRow): OwnComment {
	return {
		id: row.id,
		body: row.body,
		createdAt: row.created_at,
		contentId: row.content_id,
		contentTitle: row.content?.title ?? 'Konten'
	};
}

export async function getOwnComments(): Promise<{
	data: OwnComment[];
	error: string | null;
}> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { data: [], error: null };

	const { data, error } = await supabase
		.from('comments')
		.select('id, body, created_at, content_id, content:content!inner(title)')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })
		.limit(20);

	if (error) {
		return { data: [], error: error.message };
	}

	return { data: ((data ?? []) as unknown as OwnCommentRow[]).map(mapOwnComment), error: null };
}
