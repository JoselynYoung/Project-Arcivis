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

export function buildCuratedAttempt(userId: string, attempt: CuratedAttempt): AttemptInsert {
	return {
		user_id: userId,
		content_id: attempt.contentId,
		generator_config: null,
		score: attempt.score,
		completed_at: new Date().toISOString()
	};
}

export function buildGeneratorAttempt(userId: string, attempt: GeneratorAttempt): AttemptInsert {
	return {
		user_id: userId,
		content_id: null,
		generator_config: attempt.config,
		score: attempt.score,
		completed_at: new Date().toISOString()
	};
}

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

	const record = buildCuratedAttempt(userId, attempt);

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

	const record = buildGeneratorAttempt(userId, attempt);

	const { error } = await supabase.from('attempts').insert(record);

	if (error) {
		console.error('[attempts.ts] Insert failed (non-blocking):', error.message);
		return { success: false, error: error.message };
	}

	return { success: true, error: null };
}

export interface SubjectStat {
	subject: string;
	accuracy: number | null;
	sessions: number;
}

export interface DayStat {
	day: string;
	accuracy: number | null;
}

export interface MyStatistics {
	sessions: number;
	accuracy: number | null;
	questions: number;
	perSubject: SubjectStat[];
	weekly: DayStat[];
	lastActive: string | null;
}

interface AttemptRow {
	score: number | null;
	content_id: string | null;
	generator_config: unknown;
	completed_at: string | null;
}

function generatorQuestionCount(config: unknown): number {
	if (!config || typeof config !== 'object' || !('questionCount' in config)) return 0;
	const n = Number((config as { questionCount?: unknown }).questionCount);
	return Number.isInteger(n) && n > 0 ? n : 0;
}

// Aggregates the signed-in user's own attempts on demand. Returns null when
// signed out so callers can show a sign-in prompt instead of zeros.
export async function getMyStatistics(): Promise<{
	data: MyStatistics | null;
	error: string | null;
}> {
	const userId = await getAuthenticatedUserId();
	if (!userId) return { data: null, error: null };

	const { data, error } = await supabase
		.from('attempts')
		.select('score, content_id, generator_config, completed_at')
		.eq('user_id', userId)
		.order('completed_at', { ascending: false });

	if (error) {
		return { data: null, error: error.message };
	}

	const rows = (data ?? []) as AttemptRow[];
	const sessions = rows.length;

	const scores = rows
		.map((row) => row.score)
		.filter((score): score is number => typeof score === 'number');
	const accuracy =
		scores.length > 0
			? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
			: null;

	const contentIds = [
		...new Set(rows.map((row) => row.content_id).filter((id): id is string => !!id))
	];
	const { data: questionRows } = contentIds.length
		? await supabase.from('questions').select('content_id').in('content_id', contentIds)
		: { data: [] as { content_id: string }[] };

	const perContentCount = new Map<string, number>();
	for (const row of (questionRows ?? []) as { content_id: string }[]) {
		perContentCount.set(row.content_id, (perContentCount.get(row.content_id) ?? 0) + 1);
	}

	let questions = 0;
	for (const row of rows) {
		questions += generatorQuestionCount(row.generator_config);
		if (row.content_id) questions += perContentCount.get(row.content_id) ?? 0;
	}

	const { data: contentRows } = contentIds.length
		? await supabase.from('content').select('id, subject:subjects(name)').in('id', contentIds)
		: { data: [] as { id: string; subject: { name: string } | null }[] };

	const subjectOf = new Map(
		((contentRows ?? []) as { id: string; subject: { name: string } | null }[]).map((row) => [
			row.id,
			row.subject?.name ?? 'Umum'
		])
	);

	const perSubject = new Map<string, { total: number; count: number; sessions: number }>();
	for (const row of rows) {
		const subject = row.content_id ? (subjectOf.get(row.content_id) ?? 'Umum') : 'Acak';
		const entry = perSubject.get(subject) ?? { total: 0, count: 0, sessions: 0 };
		entry.sessions += 1;
		if (typeof row.score === 'number') {
			entry.total += row.score;
			entry.count += 1;
		}
		perSubject.set(subject, entry);
	}

	const subjectStats: SubjectStat[] = [...perSubject.entries()]
		.map(([subject, entry]) => ({
			subject,
			accuracy: entry.count > 0 ? Math.round(entry.total / entry.count) : null,
			sessions: entry.sessions
		}))
		.sort((a, b) => b.sessions - a.sessions);

	const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
	const byDay: ({ total: number; count: number } | null)[] = dayNames.map(() => null);
	for (const row of rows) {
		if (typeof row.score !== 'number' || !row.completed_at) continue;
		const index = (new Date(row.completed_at).getDay() + 6) % 7;
		const entry = byDay[index] ?? { total: 0, count: 0 };
		entry.total += row.score;
		entry.count += 1;
		byDay[index] = entry;
	}
	const weekly: DayStat[] = dayNames.map((day, index) => {
		const entry = byDay[index];
		return {
			day,
			accuracy: entry && entry.count > 0 ? Math.round(entry.total / entry.count) : null
		};
	});

	return {
		data: {
			sessions,
			accuracy,
			questions,
			perSubject: subjectStats,
			weekly,
			lastActive: rows.find((row) => !!row.completed_at)?.completed_at ?? null
		},
		error: null
	};
}
