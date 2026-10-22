import { supabase } from '$lib/services/supabaseClient';
import type { Database } from '$lib/types/database.types';

async function getAuthenticatedUserId(): Promise<string | null> {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error || !user) {
		return null;
	}

	return user.id;
}

type AttemptInsert = Database['public']['Tables']['attempts']['Insert'];

interface CuratedAttempt {
	contentId: string;
	score: number;
}

interface GeneratorAttempt {
	config: {
		subject: string;
		topic: string;
		difficulty: string;
		mode: string;
		questionCount: number;
	};
	score: number;
}

export async function recordCuratedAttempt(
	attempt: CuratedAttempt
): Promise<{ success: boolean; error: string | null }> {
	const userId = await getAuthenticatedUserId();

	if (!userId) {
		console.error('[attempts.ts] Anonymous user cannot record attempt');
		return { success: false, error: null };
	}

	const record: AttemptInsert = {
		user_id: userId,
		content_id: attempt.contentId,
		generator_config: null,
		score: attempt.score,
		completed_at: new Date().toISOString()
	};

	const { error } = await supabase.from('attempts').insert(record);

	if (error) {
		console.error('[attempts.ts] Insert failed (non-blocking):', error.message);
		return { success: false, error: error.message };
	}

	return { success: true, error: null };
}

export async function recordGeneratorAttempt(
	attempt: GeneratorAttempt
): Promise<{ success: boolean; error: string | null }> {
	const userId = await getAuthenticatedUserId();

	if (!userId) {
		console.error('[attempts.ts] Anonymous user cannot record attempt');
		return { success: false, error: null };
	}

	const record: AttemptInsert = {
		user_id: userId,
		content_id: null,
		generator_config: attempt.config,
		score: attempt.score,
		completed_at: new Date().toISOString()
	};

	const { error } = await supabase.from('attempts').insert(record);

	if (error) {
		console.error('[attempts.ts] Insert failed (non-blocking):', error.message);
		return { success: false, error: error.message };
	}

	return { success: true, error: null };
}
