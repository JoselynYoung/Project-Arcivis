import { supabase } from './supabaseClient';
import { buildDraftBody } from './contributions';

export interface Revision {
	id: string;
	title: string;
	status: string;
	createdAt: string;
	editorName: string;
}

interface RevisionRow {
	id: string;
	title: string;
	status: string;
	created_at: string;
	editor: { name: string } | null;
}

export function mapRevisionRow(row: RevisionRow): Revision {
	return {
		id: row.id,
		title: row.title,
		status: row.status,
		createdAt: row.created_at,
		editorName: row.editor?.name ?? 'Pengunjung'
	};
}

export async function getRevisions(contentId: string): Promise<{
	data: Revision[];
	error: string | null;
}> {
	const { data, error } = await supabase
		.from('revisions')
		.select('id, title, status, created_at, editor:profiles!revisions_editor_id_fkey(name)')
		.eq('content_id', contentId)
		.order('created_at', { ascending: false });

	if (error) {
		return { data: [], error: error.message };
	}

	return { data: (data ?? []).map((row) => mapRevisionRow(row as RevisionRow)), error: null };
}

export async function updateOwnContent(
	id: string,
	fields: { title: string; description: string; bodyText: string; subjectId?: string | null }
): Promise<{ error: string | null }> {
	const title = fields.title.trim();

	if (title.length === 0) {
		return { error: 'Judul tidak boleh kosong.' };
	}

	if (title.length > 200) {
		return { error: 'Judul terlalu panjang (maksimal 200 karakter).' };
	}

	let body;
	try {
		body = buildDraftBody(fields.bodyText);
	} catch {
		return { error: 'Isi tulisan tidak boleh kosong.' };
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { error: 'Not signed in' };

	const { error } = await supabase
		.from('content')
		.update({
			title,
			description: fields.description.trim() || null,
			body,
			subject_id: fields.subjectId ?? null
		})
		.eq('id', id)
		.eq('author_id', user.id);

	return { error: error?.message ?? null };
}
// Flatten a Tiptap v1 doc back to textarea text (paragraphs joined by blank lines).
export function docToPlainText(body: unknown): string {
	const root = body as { content?: unknown[] } | null;
	if (!root || !Array.isArray(root.content)) return '';

	const paragraphs: string[] = [];
	for (const block of root.content) {
		const node = block as { content?: unknown[] } | null;
		if (!node || !Array.isArray(node.content)) continue;
		const text = node.content
			.map((child) => (child as { text?: unknown } | null)?.text)
			.filter((part): part is string => typeof part === 'string')
			.join('');
		if (text.length > 0) paragraphs.push(text);
	}

	return paragraphs.join('\n\n');
}

export interface OwnContent {
	id: string;
	title: string;
	description: string;
	type: string;
	status: string;
	body: unknown;
	subjectId: string | null;
}

export async function getOwnContent(id: string): Promise<{
	data: OwnContent | null;
	error: string | null;
}> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { data: null, error: 'Not signed in' };

	const { data, error } = await supabase
		.from('content')
		.select('id, title, description, type, status, body, subject_id')
		.eq('id', id)
		.eq('author_id', user.id)
		.maybeSingle();

	if (error) {
		return { data: null, error: error.message };
	}

	if (!data) {
		return { data: null, error: null };
	}

	const row = data as {
		id: string;
		title: string;
		description: string | null;
		type: string;
		status: string;
		body: unknown;
		subject_id: string | null;
	};

	return {
		data: {
			id: row.id,
			title: row.title,
			description: row.description ?? '',
			type: row.type,
			status: row.status,
			body: row.body,
			subjectId: row.subject_id
		},
		error: null
	};
}
