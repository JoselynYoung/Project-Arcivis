import { supabase } from './supabaseClient';
import { getAuthorNames } from './authorNames';

export interface BankQuestion {
	id: string;
	text: string;
	options: string[];
	difficulty: string;
	topic: string;
	subject: string;
	authorName: string;
	status: string;
	createdAt: string;
}

interface BankRow {
	id: string;
	text: string;
	options: unknown;
	difficulty: string | null;
	topic: string | null;
	subject: { name: string } | null;
	author_id: string | null;
	status: string;
	created_at: string;
}

export function mapBankRow(row: BankRow, authorName: string | null | undefined): BankQuestion {
	const options = row.options;
	if (!Array.isArray(options) || !options.every((option) => typeof option === 'string')) {
		throw new Error('BLOCKER: data contract question_bank.options mismatch');
	}

	return {
		id: row.id,
		text: row.text,
		options,
		difficulty: row.difficulty ?? '',
		topic: row.topic ?? '',
		subject: row.subject?.name ?? 'Umum',
		authorName: authorName ?? 'Penulis anonim',
		status: row.status,
		createdAt: row.created_at
	};
}

const bankSelect =
	'id, text, options, difficulty, topic, status, created_at, author_id, subject:subjects(name)';

export async function getBankQuestions(): Promise<{
	data: BankQuestion[];
	error: string | null;
}> {
	const { data, error } = await supabase
		.from('question_bank')
		.select(bankSelect)
		.eq('status', 'diverifikasi')
		.order('created_at', { ascending: false });

	if (error) {
		return { data: [], error: error.message };
	}

	const rows = (data ?? []) as unknown as BankRow[];
	const names = await getAuthorNames(rows.map((row) => row.author_id));
	const questions: BankQuestion[] = [];
	for (const row of rows) {
		try {
			questions.push(mapBankRow(row, names.get(row.author_id ?? '')));
		} catch (err) {
			console.error('Skipping malformed bank row:', err instanceof Error ? err.message : err);
		}
	}
	return { data: questions, error: null };
}

export interface BankSubmission {
	subjectId: string | null;
	topic: string;
	difficulty: string;
	text: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export async function submitBankQuestion(
	draft: BankSubmission
): Promise<{ data: { id: string } | null; error: string | null }> {
	const text = draft.text.trim();
	if (text.length === 0) {
		return { data: null, error: 'Teks soal tidak boleh kosong.' };
	}

	const options = draft.options
		.map((option) => option.trim())
		.filter((option) => option.length > 0);
	if (options.length < 2) {
		return { data: null, error: 'Minimal dua pilihan jawaban.' };
	}

	if (
		!Number.isInteger(draft.correctIndex) ||
		draft.correctIndex < 0 ||
		draft.correctIndex >= options.length
	) {
		return { data: null, error: 'Kunci jawaban tidak valid.' };
	}

	if (!['Mudah', 'Sedang', 'Sulit'].includes(draft.difficulty)) {
		return { data: null, error: 'Tingkat kesulitan tidak valid.' };
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { data: null, error: 'Not signed in' };

	const { data, error } = await supabase
		.from('question_bank')
		.insert({
			subject_id: draft.subjectId,
			topic: draft.topic.trim() || null,
			difficulty: draft.difficulty,
			text,
			options,
			correct_index: draft.correctIndex,
			explanation: draft.explanation.trim() || null,
			author_id: user.id,
			status: 'draft'
		})
		.select('id')
		.single();

	if (error) {
		return { data: null, error: error.message };
	}

	return { data: { id: data.id }, error: null };
}
