<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { PenLine } from '@lucide/svelte';
	import AuthNotice from '$lib/components/AuthNotice.svelte';
	import { getPublicSubjects } from '$lib/services/subjects';
	import { submitContribution, type ContributionType } from '$lib/services/contributions';
	import { supabase } from '$lib/services/supabaseClient';

	let signedIn = $state<boolean | null>(null);
	let subjects = $state<{ id: string; name: string }[]>([]);
	let type = $state<ContributionType>('article');
	let title = $state('');
	let subjectId = $state('');
	let description = $state('');
	let bodyText = $state('');
	let authNotice = $state(false);
	let sending = $state(false);
	let sent = $state(false);
	let error = $state<string | null>(null);

	$effect(() => {
		supabase.auth.getSession().then(({ data }) => {
			signedIn = !!data.session;
		});
		getPublicSubjects().then(({ data, error: subjectsError }) => {
			if (subjectsError) console.error('Failed to load subjects:', subjectsError);
			else subjects = data;
		});
	});

	async function submit(event: Event) {
		event.preventDefault();
		if (sending) return;
		sending = true;
		error = null;

		const { data, error: submitError } = await submitContribution({
			type,
			title,
			subjectId: subjectId || null,
			description,
			bodyText
		});

		sending = false;

		if (submitError) {
			if (submitError === 'Not signed in') authNotice = true;
			else error = submitError;
			return;
		}

		if (data) {
			sent = true;
			await goto(resolve('/profile'));
		}
	}
</script>

<div class="mx-auto w-full max-w-2xl pb-12">
	{#if signedIn === null}
		<p class="text-sm text-slate-500">Memuat...</p>
	{:else if !signedIn}
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<h1 class="mb-2 text-xl font-bold text-slate-800">Tulis kontribusi</h1>
			<AuthNotice message="Masuk untuk mengirim tulisan." />
		</div>
	{:else if !sent}
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<h1 class="mb-1 flex items-center gap-2 text-xl font-bold text-slate-800">
				<PenLine size={20} class="text-primary-600" /> Tulis kontribusi
			</h1>
			<p class="mb-6 text-sm text-slate-500">
				Tulisanmu masuk sebagai draft. Kurator akan meninjaunya sebelum tayang.
			</p>
			{#if authNotice}
				<AuthNotice message="Masuk untuk mengirim tulisan." />
			{/if}

			{#if error}
				<p class="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
					{error}
				</p>
			{/if}

			<form onsubmit={submit} class="flex flex-col gap-4">
				<div class="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
					<button
						type="button"
						onclick={() => (type = 'article')}
						aria-pressed={type === 'article'}
						class="rounded-lg py-2 text-sm font-semibold transition-colors {type === 'article'
							? 'bg-white text-slate-800 shadow-sm'
							: 'text-slate-500 hover:text-slate-700'}"
					>
						Artikel
					</button>
					<button
						type="button"
						onclick={() => (type = 'learning')}
						aria-pressed={type === 'learning'}
						class="rounded-lg py-2 text-sm font-semibold transition-colors {type === 'learning'
							? 'bg-white text-slate-800 shadow-sm'
							: 'text-slate-500 hover:text-slate-700'}"
					>
						Materi
					</button>
				</div>

				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Judul
					<input
						type="text"
						required
						maxlength={200}
						bind:value={title}
						placeholder="Judul tulisanmu"
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
				</label>

				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Mapel
					<select
						bind:value={subjectId}
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
					>
						<option value="">Umum</option>
						{#each subjects as subject (subject.id)}
							<option value={subject.id}>{subject.name}</option>
						{/each}
					</select>
				</label>

				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Ringkasan singkat
					<input
						type="text"
						bind:value={description}
						maxlength={300}
						placeholder="Satu kalimat tentang tulisanmu (opsional)"
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
				</label>

				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Isi tulisan
					<textarea
						required
						bind:value={bodyText}
						rows={10}
						placeholder="Tulis di sini. Baris kosong = paragraf baru."
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none"
					></textarea>
				</label>

				<button
					type="submit"
					disabled={sending}
					class="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400"
				>
					{sending ? 'Mengirim...' : 'Kirim sebagai draft'}
				</button>
			</form>
		</div>
	{/if}
</div>
