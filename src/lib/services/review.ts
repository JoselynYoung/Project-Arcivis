import { supabase } from './supabaseClient';
import { getAuthorNames } from './authorNames';

export type ReviewDecision = 'diverifikasi' | 'draft';

export interface ReviewItem {
	id: string;
	title: string;
	type: string;
	authorName: string;
	updatedAt: string;
}

interface ReviewRow {
	id: string;
	title: string;
	type: string;
	updated_at: string;
	author_id: string | null;
}

export function mapReviewRow(row: ReviewRow, authorName: string | null | undefined): ReviewItem {
	return {
		id: row.id,
		title: row.title,
		type: row.type,
		authorName: authorName ?? 'Penulis anonim',
		updatedAt: row.updated_at
	};
}

export async function getReviewQueue(): Promise<{
	data: ReviewItem[];
	error: string | null;
}> {
	const { data, error } = await supabase
		.from('content')
		.select('id, title, type, updated_at, author_id')
		.eq('status', 'direview')
		.order('updated_at', { ascending: true });

	if (error) {
		return { data: [], error: error.message };
	}

	const rows = (data ?? []) as unknown as ReviewRow[];
	const names = await getAuthorNames(rows.map((row) => row.author_id));
	return {
		data: rows.map((row) => mapReviewRow(row, names.get(row.author_id ?? '') ?? null)),
		error: null
	};
}

export async function submitForReview(id: string): Promise<{ error: string | null }> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { error: 'Not signed in' };

	const { error } = await supabase
		.from('content')
		.update({ status: 'direview' })
		.eq('id', id)
		.eq('author_id', user.id)
		.eq('status', 'draft');

	return { error: error?.message ?? null };
}

export async function decideReview(
	id: string,
	decision: ReviewDecision
): Promise<{ error: string | null }> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { error: 'Not signed in' };

	const { error } = await supabase
		.from('content')
		.update({ status: decision })
		.eq('id', id)
		.eq('status', 'direview');

	return { error: error?.message ?? null };
}
