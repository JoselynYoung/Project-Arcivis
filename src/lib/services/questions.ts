import { supabase } from './supabaseClient';
import type { Tables } from '$lib/types/database.types';
import type { Question } from '$lib/types/practice';

export function mapQuestionRow(row: Tables<'questions'>): Question {
	const options = row.options;
	if (!Array.isArray(options) || !options.every((option) => typeof option === 'string')) {
		throw new Error('BLOCKER: data contract questions.options mismatch');
	}
	if (
		!Number.isInteger(row.correct_index) ||
		row.correct_index < 0 ||
		row.correct_index >= options.length
	) {
		throw new Error('BLOCKER: data contract questions.correct_index mismatch');
	}
	return {
		id: row.id,
		text: row.text,
		options,
		correctIndex: row.correct_index,
		explanation: row.explanation ?? ''
	};
}

export async function getQuestionsByContentId(contentId: string): Promise<{
	data: Question[];
	error: string | null;
}> {
	const { data, error } = await supabase
		.from('questions')
		.select('*')
		.eq('content_id', contentId)
		.order('id');

	if (error) {
		return { data: [], error: error.message };
	}

	try {
		return { data: (data ?? []).map(mapQuestionRow), error: null };
	} catch (err) {
		return {
			data: [],
			error: err instanceof Error ? err.message : 'BLOCKER: questions contract mismatch'
		};
	}
}

export interface PracticeQuestionFilters {
	subjectId?: string;
	topic?: string;
	difficulty?: string;
	limit: number;
}

// Pool Query — questions joined to published practice content
function practiceQuestionsQuery() {
	return supabase.from('questions').select(
		`
	id, content_id, text, options, correct_index, explanation, difficulty, topic,
	content:content_id!inner(subject_id, status, type)
`
	);
}

export async function getPracticeTopics(): Promise<{
	data: { subjectId: string; topic: string }[];
	error: string | null;
}> {
	const { data, error } = await practiceQuestionsQuery()
		.eq('content.type', 'practice')
		.eq('content.status', 'diverifikasi');

	if (error) {
		return { data: [], error: error.message };
	}

	const seen = new Set<string>();
	const rows: { subjectId: string; topic: string }[] = [];
	for (const row of data ?? []) {
		const subjectId = row.content?.subject_id;
		if (!row.topic || !subjectId || seen.has(`${subjectId}:${row.topic}`)) continue;
		seen.add(`${subjectId}:${row.topic}`);
		rows.push({ subjectId, topic: row.topic });
	}
	return { data: rows, error: null };
}

export async function getPracticeQuestions(filters: PracticeQuestionFilters): Promise<{
	data: Question[];
	error: string | null;
}> {
	let query = practiceQuestionsQuery()
		.eq('content.type', 'practice')
		.eq('content.status', 'diverifikasi');
	if (filters.subjectId) query = query.eq('content.subject_id', filters.subjectId);
	if (filters.topic) query = query.eq('topic', filters.topic);
	if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);

	const { data, error } = await query.order('id').limit(filters.limit);

	if (error) {
		return { data: [], error: error.message };
	}

	try {
		return { data: (data ?? []).map(mapQuestionRow), error: null };
	} catch (err) {
		return {
			data: [],
			error: err instanceof Error ? err.message : 'BLOCKER: questions contract mismatch'
		};
	}
}
