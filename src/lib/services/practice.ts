import type { QueryData } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import type { PracticePackage as MockPracticePackage } from '$lib/types/practice';

export type PracticePackage = Omit<MockPracticePackage, 'id'> & { id: string };

function practiceQuery() {
	return supabase
		.from('content')
		.select(
			`
		id, title, description, status, created_at,
		author:profiles!content_author_id_fkey(name),
		subject:subjects(name), content_tags(tags(name)),
		questions(difficulty)
	`
		)
		.eq('type', 'practice')
		.eq('status', 'diverifikasi');
}

type PracticeRow = QueryData<ReturnType<typeof practiceQuery>>[number];

export function deriveDifficulty(difficulties: (string | null)[]): string {
	const freqMap: Record<string, number> = {};
	let maxCount = 0;
	for (const difficulty of difficulties) {
		if (!difficulty) continue;
		const count = (freqMap[difficulty] ?? 0) + 1;
		freqMap[difficulty] = count;
		if (count > maxCount) {
			maxCount = count;
		}
	}

	if (maxCount === 0) {
		return '';
	}

	const candidates = Object.entries(freqMap)
		.filter(([, count]) => count === maxCount)
		.map(([difficulty]) => difficulty);

	if (candidates.length === 1) {
		return candidates[0];
	}

	const order = ['Sulit', 'Sedang', 'Mudah'];
	for (const difficulty of order) {
		if (candidates.includes(difficulty)) {
			return difficulty;
		}
	}

	return candidates[0];
}

export function mapPracticeRow(row: PracticeRow, questionCount: number): PracticePackage {
	if (!row.author?.name) {
		console.error(`Practice package ${row.id} missing author`);
	}

	return {
		id: row.id,
		title: row.title,
		description: row.description ?? '',
		subject: row.subject?.name ?? '',
		difficulty: deriveDifficulty(row.questions.map((question) => question.difficulty)),
		questionCount,
		author: row.author?.name ?? '',
		topics: row.content_tags.flatMap((item) => (item.tags ? [item.tags.name] : [])),
		isVerified: row.status === 'diverifikasi'
	};
}

// Counts come from an RPC: questions(count) embeds need table-level SELECT,
// which is revoked to hide answer keys. A failed count lookup degrades to 0.
async function getQuestionCounts(): Promise<Map<string, number>> {
	const counts = new Map<string, number>();
	const { data, error } = await supabase.rpc('get_practice_question_counts');

	if (error) {
		console.error('[practice.ts] Question counts unavailable (non-blocking):', error.message);
		return counts;
	}

	for (const row of data ?? []) {
		counts.set(row.content_id, Number(row.question_count));
	}

	return counts;
}

export async function getPracticePackages(): Promise<{
	data: PracticePackage[];
	error: string | null;
}> {
	const { data, error } = await practiceQuery().order('created_at', { ascending: false });

	if (error) {
		return { data: [], error: error.message };
	}

	const rows = (data ?? []) as unknown as PracticeRow[];
	const counts = await getQuestionCounts();

	return {
		data: rows.map((row) => mapPracticeRow(row, counts.get(row.id) ?? 0)),
		error: null
	};
}

export async function getPracticePackage(id: string): Promise<{
	data: PracticePackage | null;
	error: string | null;
}> {
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
		return { data: null, error: null };
	}

	const { data, error } = await practiceQuery().eq('id', id).maybeSingle();

	if (error) {
		return { data: null, error: error.message };
	}

	if (!data) {
		return { data: null, error: null };
	}

	return {
		data: mapPracticeRow(
			data as unknown as PracticeRow,
			(await getQuestionCounts()).get(data.id) ?? 0
		),
		error: null
	};
}
