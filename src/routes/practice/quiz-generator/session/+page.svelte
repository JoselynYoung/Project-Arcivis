<script lang="ts">
	import { quizGeneratorConfig } from '$lib/utils/quizGeneratorState.svelte';
	import { getPracticePackages } from '$lib/services/practice';
	import { getQuestionsByContentId } from '$lib/services/questions';
	import { recordGeneratorAttempt } from '$lib/services/attempts';
	import PracticeQuizSession from '$lib/components/PracticeQuizSession.svelte';
	import type { Question } from '$lib/types/practice';

	const config = $derived(quizGeneratorConfig);

	let sessionQuestions = $state<Question[]>([]);

	$effect(() => {
		let cancelled = false;
		async function load() {
			const { data: packages } = await getPracticePackages();

			if (cancelled) return;

			const matched = packages.find(
				(p) =>
					(config.subject === 'Semua' || p.subject === config.subject) &&
					(config.topic === '' ||
						p.topics.some((t) => t.toLowerCase().includes(config.topic.toLowerCase()))) &&
					(config.difficulty === 'Semua' || p.difficulty === config.difficulty)
			);

			if (!matched) {
				sessionQuestions = [];
				return;
			}

			const { data: pool } = await getQuestionsByContentId(matched.id);

			if (cancelled) return;

			sessionQuestions =
				pool.length > 0 ? [...pool].slice(0, Math.min(config.questionCount, pool.length)) : [];
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
