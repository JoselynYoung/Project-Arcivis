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
	fields: { title: string; description: string; bodyText: string }
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
		.update({ title, description: fields.description.trim() || null, body })
		.eq('id', id)
		.eq('author_id', user.id);

	return { error: error?.message ?? null };
}
