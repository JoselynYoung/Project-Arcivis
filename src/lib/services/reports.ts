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
