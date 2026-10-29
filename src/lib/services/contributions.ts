import { supabase } from './supabaseClient';
import type { Json } from '$lib/types/database.types';

export type ContributionType = 'article' | 'learning';

export interface ContributionDraft {
	type: ContributionType;
	title: string;
	subjectId: string | null;
	description: string;
	bodyText: string;
	coverFile?: File | null;
	tagIds?: string[];
}

// Markdown-lite to Tiptap v1: blank line = block break; `# `/`## `/`### `
// headings (levels 1-3); `> ` quote lines merge into one blockquote;
// `- ` and `1. ` list items merge into bullet/ordered lists;
// `![alt](path)` image lines; `**bold**` and `*italic*` inline marks
// (`\*` stays literal). Validator (0005 + 0026) accepts exactly these shapes.
interface TextLeaf {
	type: 'text';
	text: string;
	marks?: { type: string }[];
}

function parseInline(text: string): TextLeaf[] {
	const leaves: TextLeaf[] = [];
	const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
	let last = 0;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(text)) !== null) {
		if (match.index > last) {
			leaves.push({ type: 'text', text: text.slice(last, match.index).replace(/\\\*/g, '*') });
		}
		const token = match[0];
		if (token.startsWith('**')) {
			leaves.push({
				type: 'text',
				text: token.slice(2, -2).replace(/\\\*/g, '*'),
				marks: [{ type: 'bold' }]
			});
		} else {
			leaves.push({
				type: 'text',
				text: token.slice(1, -1).replace(/\\\*/g, '*'),
				marks: [{ type: 'italic' }]
			});
		}
		last = match.index + token.length;
	}
	if (last < text.length) {
		leaves.push({ type: 'text', text: text.slice(last).replace(/\\\*/g, '*') });
	}
	return leaves.filter((leaf) => leaf.text.length > 0);
}

interface BlockNode {
	type: string;
	content?: unknown[];
	attrs?: Record<string, unknown>;
}

const HEADING_MATCH = /^(#{1,3})\s+(.*)$/;
const QUOTE_MATCH = /^>\s?(.*)$/;
const LIST_MATCH = /^(?:-|\d+\.)\s+(.*)$/;
const IMAGE_MATCH = /^!\[([^\]]*)\]\(([^)]+)\)$/;

export function buildDraftBody(text: string): Json {
	const lines = text.split('\n');
	const content: BlockNode[] = [];
	let quoteBuffer: TextLeaf[][] = [];
	let listBuffer: { ordered: boolean; items: TextLeaf[][] } | null = null;

	const flushQuote = () => {
		if (quoteBuffer.length > 0) {
			content.push({
				type: 'blockquote',
				content: quoteBuffer.map((leaves) => ({ type: 'paragraph', content: leaves }))
			});
			quoteBuffer = [];
		}
		if (listBuffer) {
			const { ordered, items } = listBuffer;
			content.push({
				type: ordered ? 'orderedList' : 'bulletList',
				content: items.map((leaves) => ({
					type: 'listItem',
					content: [{ type: 'paragraph', content: leaves }]
				}))
			});
			listBuffer = null;
		}
	};

	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (line.length === 0) {
			flushQuote();
			continue;
		}

		const heading = HEADING_MATCH.exec(line);
		if (heading) {
			flushQuote();
			content.push({
				type: 'heading',
				attrs: { level: Math.min(heading[1].length, 3) },
				content: parseInline(heading[2])
			});
			continue;
		}

		const quote = QUOTE_MATCH.exec(line);
		if (quote) {
			if (listBuffer) flushQuote();
			quoteBuffer.push(parseInline(quote[1]));
			continue;
		}

		const list = LIST_MATCH.exec(line);
		if (list) {
			const ordered = /^\d+\./.test(line);
			if (listBuffer && listBuffer.ordered !== ordered) flushQuote();
			if (!listBuffer) {
				listBuffer = { ordered, items: [] };
			}
			listBuffer.items.push(parseInline(list[1]));
			continue;
		}

		const image = IMAGE_MATCH.exec(line);
		if (image) {
			flushQuote();
			content.push({
				type: 'paragraph',
				content: [{ type: 'image', attrs: { path: image[2].trim() } }]
			});
			continue;
		}

		flushQuote();
		content.push({ type: 'paragraph', content: parseInline(line) });
	}
	flushQuote();

	if (content.length === 0) {
		throw new Error('BLOCKER: contribution body has no paragraphs');
	}

	return { type: 'doc', content } as unknown as Json;
}

export async function getPublicTags(): Promise<{
	data: { id: string; name: string }[];
	error: string | null;
}> {
	const { data, error } = await supabase.from('tags').select('id, name').order('name');
	if (error) return { data: [], error: error.message };
	const rows = (data ?? []) as unknown as { id: string; name: string }[];
	return { data: rows.filter((row) => typeof row.name === 'string'), error: null };
}

export async function createTag(
	name: string
): Promise<{ data: { id: string } | null; error: string | null }> {
	const trimmed = name.trim();
	if (!trimmed) return { data: null, error: 'Nama tag tidak boleh kosong.' };
	const slug = trimmed
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
	if (!slug) return { data: null, error: 'Nama tag harus mengandung huruf atau angka.' };
	const { data, error } = await supabase
		.from('tags')
		.insert({ name: trimmed, slug })
		.select('id')
		.single();
	if (error) return { data: null, error: error.message };
	const row = data as unknown as { id: string };
	return { data: { id: row.id }, error: null };
}

const COVER_BUCKET = 'content-covers';
const BODY_BUCKET = 'content-body-assets';

function randomFileName(originalName: string): string {
	const ext = originalName.split('.').pop()?.toLowerCase() ?? 'png';
	const safeExt = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) ? ext : 'png';
	const rand = Math.random().toString(36).slice(2, 10);
	return `${Date.now()}-${rand}.${safeExt}`;
}

export function validateImageFile(file: File): string | null {
	if (!file.type.startsWith('image/')) return 'File harus berupa gambar.';
	if (file.size > 2 * 1024 * 1024) return 'Ukuran gambar maksimal 2MB.';
	return null;
}

export async function uploadCover(
	file: File,
	userId: string
): Promise<{ data: string | null; error: string | null }> {
	const invalid = validateImageFile(file);
	if (invalid) return { data: null, error: invalid };
	const path = `${userId}/${randomFileName(file.name)}`;
	const { error } = await supabase.storage.from(COVER_BUCKET).upload(path, file);
	if (error) return { data: null, error: error.message };
	const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
	return { data: data.publicUrl, error: null };
}

export async function uploadBodyImage(
	file: File,
	contentId: string
): Promise<{ data: string | null; error: string | null }> {
	const invalid = validateImageFile(file);
	if (invalid) return { data: null, error: invalid };
	const path = `${contentId}/${randomFileName(file.name)}`;
	const { error } = await supabase.storage.from(BODY_BUCKET).upload(path, file);
	if (error) return { data: null, error: error.message };
	return { data: path, error: null };
}

export async function createEmptyDraft(
	type: ContributionType
): Promise<{ data: { id: string } | null; error: string | null }> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { data: null, error: 'Not signed in' };
	const { data, error } = await supabase
		.from('content')
		.insert({
			type,
			title: 'Tanpa judul',
			body: { type: 'doc', content: [{ type: 'paragraph' }] },
			editor_schema_version: 1,
			status: 'draft',
			author_id: user.id
		})
		.select('id')
		.single();
	if (error) return { data: null, error: error.message };
	const row = data as unknown as { id: string };
	return { data: { id: row.id }, error: null };
}

export interface FinalizeInput {
	id: string;
	type: ContributionType;
	title: string;
	subjectId: string | null;
	description: string;
	bodyText: string;
	coverUrl: string | null;
	tagIds: string[];
}

export async function finalizeDraft(input: FinalizeInput): Promise<{ error: string | null }> {
	const title = input.title.trim();
	if (title.length === 0) return { error: 'Judul tidak boleh kosong.' };
	if (title.length > 200) return { error: 'Judul terlalu panjang (maksimal 200 karakter).' };

	let body: Json;
	try {
		body = buildDraftBody(input.bodyText);
	} catch {
		return { error: 'Isi tulisan tidak boleh kosong.' };
	}

	const { error } = await supabase
		.from('content')
		.update({
			type: input.type,
			title,
			subject_id: input.subjectId,
			description: input.description.trim() || null,
			body: body as Json,
			cover_image: input.coverUrl
		})
		.eq('id', input.id);

	if (error) return { error: error.message };

	if (input.tagIds.length > 0) {
		const { error: tagError } = await supabase
			.from('content_tags')
			.insert(input.tagIds.map((tagId) => ({ content_id: input.id, tag_id: tagId })));
		if (tagError) return { error: tagError.message };
	}

	return { error: null };
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

	let body: Json;
	try {
		body = buildDraftBody(draft.bodyText);
	} catch {
		return {
			data: null,
			error: 'Isi tulisan tidak boleh kosong.'
		};
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { data: null, error: 'Not signed in' };

	let coverUrl: string | null = null;
	if (draft.coverFile) {
		const uploaded = await uploadCover(draft.coverFile, user.id);
		if (uploaded.error) return { data: null, error: uploaded.error };
		coverUrl = uploaded.data;
	}

	const { data, error } = await supabase
		.from('content')
		.insert({
			type: draft.type,
			title,
			subject_id: draft.subjectId,
			description: draft.description.trim() || null,
			body: body as Json,
			cover_image: coverUrl,
			editor_schema_version: 1,
			status: 'draft',
			author_id: user.id
		})
		.select('id')
		.single();

	if (error) {
		return { data: null, error: error.message };
	}

	const row = data as unknown as { id: string };
	const tagIds = draft.tagIds ?? [];
	if (tagIds.length > 0) {
		const { error: tagError } = await supabase
			.from('content_tags')
			.insert(tagIds.map((tagId) => ({ content_id: row.id, tag_id: tagId })));
		if (tagError) return { data: { id: row.id }, error: tagError.message };
	}

	return { data: { id: row.id }, error: null };
}
