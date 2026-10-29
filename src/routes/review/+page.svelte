<script lang="ts">
	import { ShieldCheck } from '@lucide/svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import AuthNotice from '$lib/components/AuthNotice.svelte';
	import { getReviewQueue, decideReview, type ReviewItem } from '$lib/services/review';
	import { getMyRole, MODERATOR_ROLES } from '$lib/services/profile';
	import { supabase } from '$lib/services/supabaseClient';

	let items = $state<ReviewItem[]>([]);
	let role = $state<string | null>(null);
	let signedIn = $state<boolean | null>(null);
	let loadError = $state<string | null>(null);
	let acting = $state<string | null>(null);

	const canReview = $derived(role !== null && MODERATOR_ROLES.includes(role));

	$effect(() => {
		supabase.auth.getUser().then(async ({ data }) => {
			const user = data.user;
			signedIn = !!user;
			if (!user) return;

			role = (await getMyRole()) ?? 'member';

			if (MODERATOR_ROLES.includes(role)) {
				const { data: queue, error } = await getReviewQueue();
				if (error) loadError = error;
				else items = queue;
			}
		});
	});

	async function decide(id: string, decision: 'diverifikasi' | 'draft') {
		if (acting) return;
		acting = id;

		const { error } = await decideReview(id, decision);

		acting = null;

		if (error) {
			console.error('Failed to decide review:', error);
			loadError = error;
			return;
		}

		items = items.filter((item) => item.id !== id);
	}
</script>

<div class="mx-auto w-full max-w-2xl pb-12">
	<h1 class="mb-1 flex items-center gap-2 text-xl font-bold text-slate-800">
		<ShieldCheck size={20} class="text-primary-600" /> Antrian Review
	</h1>
	<p class="mb-6 text-sm text-slate-500">Konten menunggu keputusan kurator.</p>

	{#if signedIn === null}
		<p class="text-sm text-slate-500">Memuat...</p>
	{:else if !signedIn}
		<AuthNotice message="Masuk untuk melihat antrian review." />
	{:else if !canReview}
		<EmptyState
			icon={ShieldCheck}
			title="Khusus kurator"
			description="Halaman ini hanya untuk moderator dan admin."
		/>
	{:else if loadError}
		<EmptyState icon={ShieldCheck} title="Antrian Tidak Dapat Dimuat" description={loadError} />
	{:else if items.length === 0}
		<EmptyState
			icon={ShieldCheck}
			title="Antrian kosong"
			description="Tidak ada konten yang menunggu keputusan."
		/>
	{:else}
		<div class="flex flex-col gap-3">
			{#each items as item (item.id)}
				<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
					<p class="text-sm font-semibold text-slate-800">{item.title}</p>
					<p class="mb-3 text-xs text-slate-500">
						{item.type} · oleh {item.authorName}
					</p>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={() => decide(item.id, 'diverifikasi')}
							disabled={acting === item.id}
							class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400"
						>
							{acting === item.id ? '...' : 'Setujui'}
						</button>
						<button
							type="button"
							onclick={() => decide(item.id, 'draft')}
							disabled={acting === item.id}
							class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:text-slate-400"
						>
							Kembalikan
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
