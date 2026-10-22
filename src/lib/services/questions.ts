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
