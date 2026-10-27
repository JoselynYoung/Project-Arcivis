import { supabase } from './supabaseClient';

export type ContributionType = 'article' | 'learning';

export interface ContributionDraft {
	type: ContributionType;
	title: string;
	subjectId: string | null;
	description: string;
	bodyText: string;
}

// Minimal Tiptap v1 document built from plain paragraphs (blank line = break).
// The editor-schema validator (0005) accepts doc → paragraph → text.
export function buildDraftBody(text: string): Record<string, unknown> {
	const paragraphs = text
		.split(/\n\s*\n/)
		.map((block) => block.trim())
		.filter((block) => block.length > 0);

	if (paragraphs.length === 0) {
		throw new Error('BLOCKER: contribution body has no paragraphs');
	}

	return {
		type: 'doc',
		content: paragraphs.map((paragraph) => ({
			type: 'paragraph',
			content: [{ type: 'text', text: paragraph }]
		}))
	};
}

export async function submitContribution(
	draft: ContributionDraft
): Promise<{ data: { id: string } | null; error: string | null }> {
	const title = draft.title.trim();

	if (title.length === 0) {
		return { data: null, error: 'Judul tidak boleh kosong.' };
	}

	if (title.length > 200) {
		return { data: null, error: 'Judul terlalu panjang (maksimal 200 karakter).' };
	}

	let body: Record<string, unknown>;
	try {
		body = buildDraftBody(draft.bodyText);
	} catch (err) {
		return {
			data: null,
			error: err instanceof Error ? 'Isi tulisan tidak boleh kosong.' : 'Isi tidak valid.'
		};
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { data: null, error: 'Not signed in' };

	const { data, error } = await supabase
		.from('content')
		.insert({
			type: draft.type,
			title,
			subject_id: draft.subjectId,
			description: draft.description.trim() || null,
			body,
			editor_schema_version: 1,
			status: 'draft',
			author_id: user.id
		})
		.select('id')
		.single();

	if (error) {
		return { data: null, error: error.message };
	}

	return { data: { id: data.id }, error: null };
}
