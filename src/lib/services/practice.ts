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
		questions(difficulty),
		question_count:questions(count)
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

export function mapPracticeRow(row: PracticeRow): PracticePackage {
	if (!row.author?.name) {
		console.error(`Practice package ${row.id} missing author`);
	}

	return {
		id: row.id,
		title: row.title,
		description: row.description ?? '',
		subject: row.subject?.name ?? '',
		difficulty: deriveDifficulty(row.questions.map((question) => question.difficulty)),
		questionCount: row.question_count[0]?.count ?? 0,
		author: row.author?.name ?? '',
		topics: row.content_tags.flatMap((item) => (item.tags ? [item.tags.name] : [])),
		isVerified: row.status === 'diverifikasi'
	};
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

	return {
		data: rows.map(mapPracticeRow),
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
		data: mapPracticeRow(data as unknown as PracticeRow),
		error: null
	};
}
