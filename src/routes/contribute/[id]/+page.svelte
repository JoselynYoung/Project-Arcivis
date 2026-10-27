<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { PenLine } from '@lucide/svelte';
	import { getPublicSubjects } from '$lib/services/subjects';
	import { updateOwnContent, docToPlainText } from '$lib/services/revisions';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const content = $derived(data.content);
	let title = $state('');
	let description = $state('');
	let bodyText = $state('');
	let loaded = $state(false);
	let subjects = $state<{ id: string; name: string }[]>([]);
	let subjectId = $state<string | null>(null);
	let saving = $state(false);
	let error = $state<string | null>(null);
	let saved = $state(false);

	$effect(() => {
		if (!content || loaded) return;
		loaded = true;
		title = content.title;
		description = content.description;
		subjectId = content.subjectId;
		bodyText = docToPlainText(content.body);
		getPublicSubjects().then(({ data: list, error: subjectsError }) => {
			if (subjectsError) console.error('Failed to load subjects:', subjectsError);
			else subjects = list;
		});
	});

	async function submit(event: Event) {
		event.preventDefault();
		if (saving || !content) return;
		saving = true;
		error = null;

		const result = await updateOwnContent(content.id, {
			title,
			description,
			bodyText,
			subjectId
		});

		saving = false;

		if (result.error) {
			error = result.error;
			return;
		}

		await goto(resolve('/profile'));
	}
</script>

<div class="mx-auto w-full max-w-2xl pb-12">
	{#if data.contentError}
		<div class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
			<h1 class="mb-2 text-xl font-bold text-slate-800">Tulisan Tidak Dapat Dimuat</h1>
			<p class="text-sm text-slate-500">{data.contentError}</p>
		</div>
	{:else if !content}
		<div class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
			<h1 class="mb-2 text-xl font-bold text-slate-800">Tulisan Tidak Ditemukan</h1>
			<p class="text-sm text-slate-500">Hanya penulis yang bisa mengubah tulisannya.</p>
		</div>
	{:else}
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<h1 class="mb-1 flex items-center gap-2 text-xl font-bold text-slate-800">
				<PenLine size={20} class="text-primary-600" /> Ubah tulisan
			</h1>
			<p class="mb-6 text-sm text-slate-500">
				Perubahan tersimpan sebagai draft baru di riwayat. Kirim ulang untuk review bila sudah pas.
			</p>

			{#if error}
				<p class="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
					{error}
				</p>
			{/if}

			<form onsubmit={submit} class="flex flex-col gap-4">
				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Judul
					<input
						type="text"
						required
						maxlength={200}
						bind:value={title}
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
				</label>
				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Mapel
					<select
						bind:value={subjectId}
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
					>
						<option value={null}>Umum</option>
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
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
				</label>
				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Isi tulisan
					<textarea
						required
						bind:value={bodyText}
						rows={10}
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none"
					></textarea>
				</label>
				<button
					type="submit"
					disabled={saving}
					class="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400"
				>
					{saving ? 'Menyimpan...' : saved ? 'Tersimpan' : 'Simpan perubahan'}
				</button>
			</form>
		</div>
	{/if}
</div>
