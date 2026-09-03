<script lang="ts">
	import { page } from '$app/state';
	import { practicePackages, questions } from '$lib/mocks/practice';
	import PracticeQuizSession from '$lib/components/PracticeQuizSession.svelte';

	const packageId = $derived(Number(page.params.id));
	const pkg = $derived(practicePackages.find((p) => p.id === packageId));
	const questionList = $derived(pkg ? (questions[pkg.id] ?? []) : []);
	const backParams = $derived<Record<string, string>>(pkg ? { id: String(pkg.id) } : {});
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
	/>
{/if}
