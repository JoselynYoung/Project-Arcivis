import { supabase } from './supabaseClient';

export const REPORT_REASONS = [
	'Spam atau promosi',
	'Informasi salah',
	'Konten duplikat',
	'Tidak pantas',
	'Lainnya'
] as const;

export async function submitReport(
	contentId: string,
	reason: string
): Promise<{ error: string | null }> {
	const trimmed = reason.trim();

	if (trimmed.length === 0) {
		return { error: 'Pilih alasan pelaporan.' };
	}

	if (trimmed.length > 500) {
		return { error: 'Alasan terlalu panjang (maksimal 500 karakter).' };
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { error: 'Not signed in' };

	const { error } = await supabase
		.from('reports')
		.insert({ content_id: contentId, user_id: user.id, reason: trimmed });

	if (error) {
		return { error: error.message };
	}

	return { error: null };
}

export interface OwnReport {
	id: string;
	reason: string;
	createdAt: string;
	contentId: string;
	contentTitle: string;
}

interface OwnReportRow {
	id: string;
	reason: string;
	created_at: string;
	content_id: string;
	content: { title: string } | null;
}

export function mapOwnReport(row: OwnReportRow): OwnReport {
	return {
		id: row.id,
		reason: row.reason,
		createdAt: row.created_at,
		contentId: row.content_id,
		contentTitle: row.content?.title ?? 'Konten'
	};
}

export async function getOwnReports(): Promise<{
	data: OwnReport[];
	error: string | null;
}> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { data: [], error: null };

	const { data, error } = await supabase
		.from('reports')
		.select('id, reason, created_at, content_id, content:content!inner(title)')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })
		.limit(20);

	if (error) {
		return { data: [], error: error.message };
	}

	return { data: ((data ?? []) as unknown as OwnReportRow[]).map(mapOwnReport), error: null };
}
