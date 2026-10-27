<script lang="ts">
	import { History } from '@lucide/svelte';
	import { getRevisions, type Revision } from '$lib/services/revisions';

	let { contentId }: { contentId: string } = $props();

	let revisions = $state<Revision[]>([]);
	let open = $state(false);

	$effect(() => {
		let cancelled = false;
		getRevisions(contentId).then(({ data, error }) => {
			if (error) console.error('Failed to load revisions:', error);
			if (cancelled) return;
			revisions = data;
		});
		return () => {
			cancelled = true;
		};
	});

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
</script>

{#if revisions.length > 0}
	<section aria-label="Riwayat perubahan" class="mt-6">
		<button
			type="button"
			onclick={() => (open = !open)}
			aria-expanded={open}
			class="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
		>
			<History size={15} />
			Riwayat perubahan ({revisions.length})
		</button>

		{#if open}
			<div class="mt-3 flex flex-col gap-2">
				{#each revisions as revision (revision.id)}
					<div class="rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
						<p class="font-semibold text-slate-800">{revision.title}</p>
						<p class="text-xs text-slate-400">
							{revision.status} · {revision.editorName} ·
							{dateFormatter.format(new Date(revision.createdAt))}
						</p>
					</div>
				{/each}
			</div>
		{/if}
	</section>
{/if}
