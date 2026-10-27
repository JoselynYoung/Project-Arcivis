<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { BookOpen } from '@lucide/svelte';
	import { quizGeneratorConfig } from '$lib/utils/quizGeneratorState.svelte';
	import { getPracticeQuestions } from '$lib/services/questions';
	import { recordGeneratorAttempt } from '$lib/services/attempts';
	import PracticeQuizSession from '$lib/components/PracticeQuizSession.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import type { Question } from '$lib/types/practice';

	const config = $derived(quizGeneratorConfig);

	let sessionQuestions = $state<Question[]>([]);
	let loading = $state(true);
	let loadError = $state<string | null>(null);

	// Direct visits lose the in-memory config; send them back to pick one.
	$effect(() => {
		if (!config.subjectId) {
			goto(resolve('/practice/quiz-generator'));
		}
	});
	$effect(() => {
		let cancelled = false;
		async function load() {
			loading = true;
			loadError = null;
			const { data: pool, error } = await getPracticeQuestions({
				subjectId: config.subjectId,
				topic: config.topic,
				difficulty: config.difficulty,
				limit: config.questionCount
			});

			if (cancelled) return;

			loading = false;
			if (error) {
				console.error('Failed to load question pool:', error);
				loadError = error;
				sessionQuestions = [];
				return;
			}
			sessionQuestions = pool;
		}

		if (config.subjectId) load();
		else loading = false;

		return () => {
			cancelled = true;
		};
	});

	const sessionTitle = $derived(
		config.subject === 'Semua' ? 'Latihan Acak' : `Latihan ${config.subject}`
	);
	const sessionDescription = $derived(
		`${config.topic ? config.topic + ' · ' : ''}${config.difficulty} · ${config.questionCount} Soal · ${
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

{#if loading}
	<div class="mx-auto my-12 max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center">
		<p class="text-sm text-slate-500">Menyiapkan soal...</p>
	</div>
{:else if loadError}
	<EmptyState
		icon={BookOpen}
		title="Soal Tidak Dapat Dimuat"
		description="Terjadi masalah saat memuat soal. Coba lagi nanti."
		onReset={() => goto(resolve('/practice/quiz-generator'))}
	/>
{:else}
	<PracticeQuizSession
		questions={sessionQuestions}
		title={sessionTitle}
		description={sessionDescription}
		difficulty={config.difficulty}
		backRoute="/practice/quiz-generator"
		backLabel="Ubah Konfigurasi Latihan"
		onComplete={handleComplete}
	/>
{/if}
