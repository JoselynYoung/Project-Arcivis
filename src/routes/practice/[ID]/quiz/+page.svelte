<script lang="ts">
	import PracticeQuizSession from '$lib/components/PracticeQuizSession.svelte';
	import { recordCuratedAttempt } from '$lib/services/attempts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const pkg = $derived(data.pkg ?? null);
	const questionList = $derived(data.questionList ?? []);
	const backParams = $derived<Record<string, string>>(pkg ? { id: String(pkg.id) } : {});

	function handleComplete(result: { correctCount: number; totalQuestions: number }) {
		if (!pkg || result.totalQuestions === 0) return;
		const score = Math.round((result.correctCount / result.totalQuestions) * 100);
		recordCuratedAttempt({ contentId: pkg.id, score });
	}
</script>

{#if pkg}
	<PracticeQuizSession
		questions={questionList}
		title={pkg.title}
		description={pkg.description}
		difficulty={pkg.difficulty}
		backRoute="/practice/[id]"
		{backParams}
		backLabel="Kembali ke Detail Paket"
		onComplete={handleComplete}
	/>
{/if}
