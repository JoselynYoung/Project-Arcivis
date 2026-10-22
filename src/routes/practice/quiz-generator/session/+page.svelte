<script lang="ts">
	import { quizGeneratorConfig } from '$lib/utils/quizGeneratorState.svelte';
	import { getPracticeQuestions } from '$lib/services/questions';
	import { recordGeneratorAttempt } from '$lib/services/attempts';
	import PracticeQuizSession from '$lib/components/PracticeQuizSession.svelte';
	import type { Question } from '$lib/types/practice';

	const config = $derived(quizGeneratorConfig);

	let sessionQuestions = $state<Question[]>([]);

	$effect(() => {
		let cancelled = false;
		async function load() {
			const { data: pool, error } = await getPracticeQuestions({
				subjectId: config.subjectId,
				topic: config.topic,
				difficulty: config.difficulty,
				limit: config.questionCount
			});

			if (cancelled) return;

			if (error) console.error('Failed to load question pool:', error);
			sessionQuestions = pool;
		}

		load();

		return () => {
			cancelled = true;
		};
	});

	const sessionTitle = $derived(
		config.subject === 'Semua' ? 'Latihan Acak' : `Latihan ${config.subject}`
	);
	const sessionDescription = $derived(
		`${config.topic ? config.topic + ' · ' : ''}${config.difficulty} · ${sessionQuestions.length} Soal · ${
			config.mode === 'tryout' ? 'Mode Tryout' : 'Mode Latihan'
		}`
	);

	function handleComplete(result: { correctCount: number; totalQuestions: number }) {
		if (result.totalQuestions === 0) return;
		const score = Math.round((result.correctCount / result.totalQuestions) * 100);
		recordGeneratorAttempt({
			config: {
				subject: config.subject,
				topic: config.topic,
				difficulty: config.difficulty,
				mode: config.mode,
				questionCount: config.questionCount
			},
			score
		});
	}
</script>

<PracticeQuizSession
	questions={sessionQuestions}
	title={sessionTitle}
	description={sessionDescription}
	difficulty={config.difficulty}
	backRoute="/practice/quiz-generator"
	backLabel="Ubah Konfigurasi Latihan"
	onComplete={handleComplete}
/>
