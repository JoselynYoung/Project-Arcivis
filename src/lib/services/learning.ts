import { SUBJECT_COLORS, SUBJECT_COLOR_FALLBACK } from '$lib/constants/publicData';
import { supabase } from '$lib/services/supabaseClient';

export interface LearningMaterial {
	id: string;
	judul: string;
	deskripsi: string;
	mapel: string;
	tanggal: string;
	updatedAt: string;
	author: string;
	dibaca: number;
	badgeWarna: string;
	topics: string[];
	body: Record<string, unknown> | null;
	editorSchemaVersion: number;
	isBookmark?: boolean;
}

interface LearningRow {
	id: string;
	title: string;
	description: string | null;
	created_at: string;
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

const learningSelect = `
	id,
	title,
	description,
	created_at,
	updated_at,
	body,
	author:profiles!content_author_id_fkey(name),
	subject:subjects(name),
	content_tags(tags(name))
`;

function formatDate(value: string): string {
	return new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date(value));
}

function getBadgeColor(subject: string): string {
	const color = SUBJECT_COLORS[subject] ?? SUBJECT_COLOR_FALLBACK;
	const border = color.match(/bg-([\w-]+)/)?.[1];
	return border ? `${color} border-${border.replace(/-50$/, '-200')}` : `${color} border-slate-200`;
}

function mapLearningRow(row: LearningRow, viewCount: number): LearningMaterial {
	const subject = row.subject?.[0]?.name ?? '';

	return {
		id: row.id,
		judul: row.title,
		deskripsi: row.description ?? '',
		mapel: subject,
		tanggal: row.created_at.slice(0, 10),
		updatedAt: formatDate(row.updated_at),
		author: row.author?.[0]?.name ?? '',
		dibaca: viewCount,
		badgeWarna: getBadgeColor(subject),
		topics: row.content_tags.flatMap((item) => (item.tags ? [item.tags.name] : [])),
		body: row.body,
		editorSchemaVersion: row.editor_schema_version
	};
}

function isUuid(value: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function recordLearningView(
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

async function getViewCounts(
	contentIds: string[]
): Promise<{ data: Map<string, number>; error: string | null }> {
	if (contentIds.length === 0) {
		return { data: new Map(), error: null };
	}

	const { data, error } = await supabase.rpc('get_learning_view_counts', {
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

export async function getLearningMaterials(): Promise<{
	data: LearningMaterial[];
	error: string | null;
}> {
	const { data, error } = await supabase
		.from('content')
		.select(learningSelect)
		.eq('type', 'learning')
		.eq('status', 'diverifikasi')
		.order('created_at', { ascending: false });

	if (error) {
		return { data: [], error: error.message };
	}

	const rows = (data ?? []) as unknown as LearningRow[];
	const counts = await getViewCounts(rows.map((row) => row.id));

	if (counts.error) {
		return { data: [], error: counts.error };
	}

	return {
		data: rows.map((row) => mapLearningRow(row, counts.data.get(row.id) ?? 0)),
		error: null
	};
}

export async function getLearningMaterial(id: string): Promise<{
	data: LearningMaterial | null;
	error: string | null;
}> {
	if (!isUuid(id)) {
		return { data: null, error: null };
	}

	const { data, error } = await supabase
		.from('content')
		.select(learningSelect)
		.eq('id', id)
		.eq('type', 'learning')
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
		data: mapLearningRow(data as unknown as LearningRow, counts.data.get(id) ?? 0),
		error: null
	};
}
