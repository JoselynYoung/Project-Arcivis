<script lang="ts">
	import { questions, practicePackages } from '$lib/mocks/practice';
	import { quizGeneratorConfig } from '$lib/utils/quizGeneratorState.svelte';
	import PracticeQuizSession from '$lib/components/PracticeQuizSession.svelte';

	const config = $derived(quizGeneratorConfig);

	const filteredId = $derived(
		practicePackages.find(
			(p) =>
				(config.subject === 'Semua' || p.subject === config.subject) &&
				(config.topic === '' ||
					p.topics.some((t) => t.toLowerCase().includes(config.topic.toLowerCase()))) &&
				(config.difficulty === 'Semua' || p.difficulty === config.difficulty)
		)?.id
	);

	const pool = $derived(filteredId != null ? (questions[filteredId] ?? []) : []);

	const sessionQuestions = $derived(
		pool.length > 0 ? [...pool].slice(0, Math.min(config.questionCount, pool.length)) : []
	);

	const sessionTitle = $derived(
		config.subject === 'Semua' ? 'Latihan Acak' : `Latihan ${config.subject}`
	);
	const sessionDescription = $derived(
		`${config.topic ? config.topic + ' · ' : ''}${config.difficulty} · ${sessionQuestions.length} Soal · ${
			config.mode === 'tryout' ? 'Mode Tryout' : 'Mode Latihan'
		}`
	);
</script>

<PracticeQuizSession
	questions={sessionQuestions}
	title={sessionTitle}
	description={sessionDescription}
	difficulty={config.difficulty}
	backRoute="/practice/quiz-generator"
	backLabel="Ubah Konfigurasi Latihan"
/>
