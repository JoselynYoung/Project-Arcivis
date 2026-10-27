<script lang="ts">
	import { Flag } from '@lucide/svelte';
	import AuthNotice from '$lib/components/AuthNotice.svelte';
	import { submitReport, REPORT_REASONS } from '$lib/services/reports';

	let { contentId }: { contentId: string } = $props();

	let open = $state(false);
	let reason = $state<string>(REPORT_REASONS[0]);
	let authNotice = $state(false);
	let sending = $state(false);
	let sent = $state(false);
	let error = $state<string | null>(null);

	async function submit() {
		if (sending) return;
		sending = true;
		error = null;

		const result = await submitReport(contentId, reason);

		sending = false;

		if (result.error) {
			if (result.error === 'Not signed in') authNotice = true;
			else error = result.error;
			return;
		}

		sent = true;
		open = false;
	}
</script>

<div class="relative">
	<button
		type="button"
		onclick={() => {
			open = !open;
			error = null;
		}}
		aria-label="Laporkan konten"
		aria-expanded={open}
		class="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-all hover:bg-slate-50"
	>
		<Flag size={18} class={sent ? 'fill-amber-400 text-amber-500' : ''} />
	</button>

	{#if open}
		<div
			class="absolute top-12 right-0 z-30 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
		>
			<p class="mb-3 text-sm font-semibold text-slate-800">Laporkan konten ini?</p>
			<label class="mb-3 flex flex-col gap-1.5 text-xs font-medium text-slate-500">
				Alasan
				<select
					bind:value={reason}
					class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none"
				>
					{#each REPORT_REASONS as option (option)}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</label>
			{#if authNotice}
				<AuthNotice message="Masuk untuk melaporkan konten." />
			{/if}
			{#if error}
				<p class="mb-3 text-xs text-red-600" role="alert">{error}</p>
			{/if}
			<div class="flex justify-end gap-2">
				<button
					type="button"
					onclick={() => (open = false)}
					class="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
				>
					Batal
				</button>
				<button
					type="button"
					onclick={submit}
					disabled={sending || sent}
					class="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400"
				>
					{sending ? 'Mengirim...' : sent ? 'Terkirim' : 'Kirim'}
				</button>
			</div>
		</div>
	{/if}
</div>
