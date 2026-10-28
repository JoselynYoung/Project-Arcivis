import {
	ARTICLE_CATEGORY_COLORS,
	ARTICLE_CATEGORY_COLOR_FALLBACK
} from '$lib/constants/publicData';
import { supabase } from '$lib/services/supabaseClient';
import { getAuthorNames } from './authorNames';

export interface Article {
	id: string;
	judul: string;
	deskripsi: string;
	kategori: string;
	author: string;
	updatedAt: string;
	dibaca: number;
	badgeWarna: string;
	topics: string[];
	body: Record<string, unknown> | null;
	editorSchemaVersion: number;
	isBookmark?: boolean;
}

interface ArticleRow {
	id: string;
	title: string;
	description: string | null;
	updated_at: string;
	body: Record<string, unknown> | null;
	editor_schema_version: number;
	author_id: string | null;
	subject: { name: string }[] | null;
	content_tags: { tags: { name: string } | null }[];
}

interface ViewCountRow {
	content_id: string;
	view_count: number;
}

const articleSelect = `
	id,
	title,
	description,
	updated_at,
	body,
	editor_schema_version,
	author_id,
	subject:subjects(name),
	content_tags(tags(name))
`;

function isUuid(value: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function recordArticleView(
	contentId: string,
	sessionId: string
): Promise<{
	data: boolean;
	error: string | null;
}> {
	const { data, error } = await supabase.rpc('record_content_view', {
		target_content_id: contentId,
		anonymous_session_id: sessionId
	});

	return { data: data ?? false, error: error?.message ?? null };
}

function formatDate(value: string): string {
	return new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(new Date(value));
}

function getBadgeColor(category: string): string {
	return ARTICLE_CATEGORY_COLORS[category] ?? ARTICLE_CATEGORY_COLOR_FALLBACK;
}

function mapArticleRow(
	row: ArticleRow,
	viewCount: number,
	authorName: string | null | undefined
): Article {
	const subject = row.subject?.[0]?.name ?? '';
	const topics = row.content_tags.flatMap((item) => (item.tags ? [item.tags.name] : []));

	return {
		id: row.id,
		judul: row.title,
		deskripsi: row.description ?? '',
		kategori: topics[0] ?? '',
		author: authorName ?? 'Penulis anonim',
		updatedAt: formatDate(row.updated_at),
		dibaca: viewCount,
		badgeWarna: getBadgeColor(subject),
		topics,
		body: row.body,
		editorSchemaVersion: row.editor_schema_version,
		isBookmark: undefined
	};
}

async function getViewCounts(
	contentIds: string[]
): Promise<{ data: Map<string, number>; error: string | null }> {
	if (contentIds.length === 0) {
		return { data: new Map(), error: null };
	}

	const { data, error } = await supabase.rpc('get_article_view_counts', {
		content_ids: contentIds
	});

	if (error) {
		return { data: new Map(), error: error.message };
	}

	return {
		data: new Map(
			((data ?? []) as ViewCountRow[]).map((row) => [row.content_id, Number(row.view_count)])
		),
		error: null
	};
}

export async function getArticles(): Promise<{ data: Article[]; error: string | null }> {
	const { data, error } = await supabase
		.from('content')
		.select(articleSelect)
		.eq('type', 'article')
		.eq('status', 'diverifikasi')
		.order('updated_at', { ascending: false });

	if (error) {
		return { data: [], error: error.message };
	}

	const rows = (data ?? []) as unknown as ArticleRow[];
	const [counts, names] = await Promise.all([
		getViewCounts(rows.map((row) => row.id)),
		getAuthorNames(rows.map((row) => row.author_id))
	]);

	if (counts.error) {
		console.error('[articles.ts] View counts unavailable (non-blocking):', counts.error);
	}

	return {
		data: rows.map((row) =>
			mapArticleRow(row, counts.data.get(row.id) ?? 0, names.get(row.author_id ?? ''))
		),
		error: null
	};
}

export async function getArticle(id: string): Promise<{
	data: Article | null;
	error: string | null;
}> {
	if (!isUuid(id)) {
		return { data: null, error: null };
	}

	const { data, error } = await supabase
		.from('content')
		.select(articleSelect)
		.eq('id', id)
		.eq('type', 'article')
		.eq('status', 'diverifikasi')
		.maybeSingle();

	if (error) {
		return { data: null, error: error.message };
	}

	if (!data) {
		return { data: null, error: null };
	}

	const [singleCounts, singleNames] = await Promise.all([
		getViewCounts([id]),
		getAuthorNames(data ? [(data as { author_id: string | null }).author_id] : [])
	]);

	if (singleCounts.error) {
		return { data: null, error: singleCounts.error };
	}

	return {
		data: mapArticleRow(
			data as unknown as ArticleRow,
			singleCounts.data.get(id) ?? 0,
			singleNames.get((data as { author_id: string | null }).author_id ?? '')
		),
		error: null
	};
}
