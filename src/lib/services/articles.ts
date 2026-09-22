import {
	ARTICLE_CATEGORY_COLORS,
	ARTICLE_CATEGORY_COLOR_FALLBACK
} from '$lib/constants/publicData';
import { supabase } from '$lib/services/supabaseClient';

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
	author: { name: string }[] | null;
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
	author:profiles!content_author_id_fkey(name),
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

function mapArticleRow(row: ArticleRow, viewCount: number): Article {
	const subject = row.subject?.[0]?.name ?? '';
	const topics = row.content_tags.flatMap((item) => (item.tags ? [item.tags.name] : []));

	return {
		id: row.id,
		judul: row.title,
		deskripsi: row.description ?? '',
		kategori: topics[0] ?? '',
		author: row.author?.[0]?.name ?? '',
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
	const counts = await getViewCounts(rows.map((row) => row.id));

	if (counts.error) {
		return { data: [], error: counts.error };
	}

	return {
		data: rows.map((row) => mapArticleRow(row, counts.data.get(row.id) ?? 0)),
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

	const counts = await getViewCounts([id]);

	if (counts.error) {
		return { data: null, error: counts.error };
	}

	return {
		data: mapArticleRow(data as unknown as ArticleRow, counts.data.get(id) ?? 0),
		error: null
	};
}
