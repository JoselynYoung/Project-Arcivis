import { supabase } from './supabaseClient';
import type { Question } from '$lib/types/practice';

interface PublicQuestionRow {
	id: string;
	text: string;
	options: unknown;
}

export function mapQuestionRow(row: PublicQuestionRow): Question {
	const options = row.options;
	if (!Array.isArray(options) || !options.every((option) => typeof option === 'string')) {
		throw new Error('BLOCKER: data contract questions.options mismatch');
	}

	return { id: row.id, text: row.text, options };
}

export async function getQuestionsByContentId(contentId: string): Promise<{
	data: Question[];
	error: string | null;
}> {
	const { data, error } = await supabase
		.from('questions')
		.select('id, content_id, text, options')
		.eq('content_id', contentId)
		.order('id');

	if (error) {
		return { data: [], error: error.message };
	}

	const questions: Question[] = [];
	for (const row of data ?? []) {
		try {
			questions.push(mapQuestionRow(row));
		} catch (err) {
			console.error('Skipping malformed question row:', err instanceof Error ? err.message : err);
		}
	}
	return { data: questions, error: null };
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
	id, content_id, text, options, difficulty, topic,
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

	const questions: Question[] = [];
	for (const row of data ?? []) {
		try {
			questions.push(mapQuestionRow(row));
		} catch (err) {
			console.error('Skipping malformed question row:', err instanceof Error ? err.message : err);
		}
	}
	return { data: questions, error: null };
}

export interface GradeResult {
	correct: boolean;
	correctIndex: number;
	explanation: string;
}

// Server-side grading. The key for one question is revealed only after it is
// answered; bulk key scraping through the questions table is revoked (0009).
export async function gradeAnswer(
	questionId: string,
	answer: number
): Promise<{ data: GradeResult | null; error: string | null }> {
	const { data, error } = await supabase.rpc('grade_answer', {
		p_answer: answer,
		p_question_id: questionId
	});

	if (error) {
		return { data: null, error: error.message };
	}

	const result = data as {
		ok?: unknown;
		correct?: unknown;
		correct_index?: unknown;
		explanation?: unknown;
	} | null;

	if (
		!result ||
		result.ok !== true ||
		typeof result.correct !== 'boolean' ||
		!Number.isInteger(result.correct_index) ||
		(result.correct_index as number) < 0 ||
		typeof result.explanation !== 'string'
	) {
		return { data: null, error: 'BLOCKER: grade_answer contract mismatch' };
	}

	return {
		data: {
			correct: result.correct,
			correctIndex: result.correct_index as number,
			explanation: result.explanation
		},
		error: null
	};
}
