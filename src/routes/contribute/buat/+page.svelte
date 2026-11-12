<script lang="ts">
	import { PenLine } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import AuthNotice from '#lib/components/AuthNotice.svelte';
	import EmptyState from '#lib/components/EmptyState.svelte';
	import { getPublicSubjects } from '#lib/services/subjects';
	import {
		createEmptyDraft,
		finalizeDraft,
		uploadBodyImage,
		uploadCover,
		getPublicTags,
		createTag,
		type ContributionType
	} from '#lib/services/contributions';
	import { submitBankQuestion } from '#lib/services/bank';
	import { getMyRole, CONTRIBUTOR_ROLES } from '#lib/services/profile';
	import { supabase } from '#lib/services/supabaseClient';

	let signedIn = $state<boolean | null>(null);
	let role = $state<string | null>(null);
	const canContribute = $derived(role !== null && CONTRIBUTOR_ROLES.includes(role));

	let subjects = $state<{ id: string; name: string }[]>([]);
	let allTags = $state<{ id: string; name: string }[]>([]);

	let kirimKind = $state<'tulisan' | 'soal'>('tulisan');
	let step = $state<1 | 2>(1);
	let type = $state<ContributionType>('article');
	let title = $state('');
	let subjectId = $state<string | null>(null);
	let description = $state('');
	let tagIds = $state<string[]>([]);
	let newTag = $state('');
	let coverFile = $state<File | null>(null);
	let coverPreview = $state<string | null>(null);
	let draftId = $state<string | null>(null);
	let bodyText = $state('');
	let bodyEl = $state<HTMLTextAreaElement | null>(null);
	let coverInput = $state<HTMLInputElement | null>(null);
	let imageInput = $state<HTMLInputElement | null>(null);
	let sending = $state(false);
	let formError = $state<string | null>(null);
	let sent = $state(false);

	let topic = $state('');
	let difficulty = $state('Sedang');
	let text = $state('');
	let options = $state(['', '', '', '']);
	let correctIndex = $state(0);
	let explanation = $state('');
	let sendingSoal = $state(false);
	let formErrorSoal = $state<string | null>(null);
	let sentSoal = $state(false);

	const AUTOSAVE_KEY = 'kontribusi-draft-backup';

	let presetLoaded = $state(false);

	$effect(() => {
		supabase.auth.getSession().then(async ({ data }) => {
			signedIn = !!data.session;
			if (data.session) {
				role = await getMyRole();
			}
		});
		getPublicSubjects().then(({ data, error }) => {
			if (!error) subjects = data;
		});
		getPublicTags().then(({ data }) => {
			allTags = data;
		});
		try {
			const raw = localStorage.getItem(AUTOSAVE_KEY);
			if (raw) {
				const saved = JSON.parse(raw) as {
					title?: string;
					bodyText?: string;
					description?: string;
				};
				if (typeof saved.title === 'string') title = saved.title;
				if (typeof saved.bodyText === 'string') bodyText = saved.bodyText;
				if (typeof saved.description === 'string') description = saved.description;
			}
		} catch {
			// Corrupt backup ignored.
		}
	});

	$effect(() => {
		try {
			localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ title, bodyText, description }));
		} catch {
			// Storage full or locked; drafts still submit normally.
		}
	});

	$effect(() => {
		if (presetLoaded) return;
		if (signedIn === null) return;
		presetLoaded = true;
		const kind = page.url.searchParams.get('kind');
		const typeParam = page.url.searchParams.get('type');
		if (kind === 'soal') {
			kirimKind = 'soal';
		} else if (kind === 'tulisan') {
			kirimKind = 'tulisan';
		}
		if (typeParam === 'article' || typeParam === 'learning') {
			type = typeParam;
			if (kind !== 'soal') kirimKind = 'tulisan';
		}
	});

	function insertAtCursor(snippet: string, cursorBack = 0) {
		const current = bodyText;
		const el = bodyEl;
		const start = el?.selectionStart ?? current.length;
		const end = el?.selectionEnd ?? current.length;
		bodyText = current.slice(0, start) + snippet + current.slice(end);
		const caret = start + snippet.length - cursorBack;
		requestAnimationFrame(() => {
			el?.focus();
			el?.setSelectionRange(caret, caret);
		});
	}

	async function ensureDraft(): Promise<string | null> {
		if (draftId) return draftId;
		const { data, error } = await createEmptyDraft(type);
		if (error || !data) {
			formError = error ?? 'Gagal membuat draft.';
			return null;
		}
		draftId = data.id;
		return data.id;
	}

	async function goStep2() {
		if (!title.trim()) {
			formError = 'Isi judul dulu.';
			return;
		}
		formError = null;
		step = 2;
		await ensureDraft();
	}

	function onCoverPicked(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0] ?? null;
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			formError = 'File sampul harus berupa gambar.';
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			formError = 'Ukuran sampul maksimal 2MB.';
			return;
		}
		formError = null;
		coverFile = file;
		if (coverPreview) URL.revokeObjectURL(coverPreview);
		coverPreview = URL.createObjectURL(file);
	}

	async function onBodyImagePicked(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0] ?? null;
		input.value = '';
		if (!file) return;
		const id = await ensureDraft();
		if (!id) return;
		const { data: path, error } = await uploadBodyImage(file, id);
		if (error || !path) {
			formError = error ?? 'Gagal mengunggah gambar.';
			return;
		}
		insertAtCursor(`\n\n![gambar](${path})\n\n`);
	}

	async function toggleTag(tagId: string) {
		tagIds = tagIds.includes(tagId) ? tagIds.filter((id) => id !== tagId) : [...tagIds, tagId];
	}

	async function addTag() {
		const name = newTag.trim();
		if (!name) return;
		const existing = allTags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
		if (existing) {
			if (!tagIds.includes(existing.id)) tagIds = [...tagIds, existing.id];
			newTag = '';
			return;
		}
		const { data, error } = await createTag(name);
		if (error || !data) {
			formError = error ?? 'Gagal membuat tag.';
			return;
		}
		allTags = [...allTags, { id: data.id, name }];
		tagIds = [...tagIds, data.id];
		newTag = '';
	}

	async function publish(event: Event) {
		event.preventDefault();
		if (sending) return;
		sending = true;
		formError = null;

		const id = await ensureDraft();
		if (!id) {
			sending = false;
			return;
		}

		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			sending = false;
			formError = 'Masuk untuk menerbitkan.';
			return;
		}

		let coverUrl: string | null = null;
		if (coverFile) {
			const uploaded = await uploadCover(coverFile, user.id);
			if (uploaded.error || !uploaded.data) {
				sending = false;
				formError = uploaded.error ?? 'Gagal mengunggah sampul.';
				return;
			}
			coverUrl = uploaded.data;
		}

		const { error } = await finalizeDraft({
			id,
			type,
			title,
			subjectId,
			description,
			bodyText,
			coverUrl,
			tagIds
		});

		sending = false;
		if (error) {
			formError = error;
			return;
		}
		sent = true;
		try {
			localStorage.removeItem(AUTOSAVE_KEY);
		} catch {
			// Non-blocking.
		}
		title = '';
		description = '';
		bodyText = '';
		tagIds = [];
		coverFile = null;
		if (coverPreview) URL.revokeObjectURL(coverPreview);
		coverPreview = null;
		draftId = null;
		step = 1;
		goto(resolve('/contribute'));
	}

	async function submitSoal(event: Event) {
		event.preventDefault();
		if (sendingSoal) return;
		sendingSoal = true;
		formErrorSoal = null;

		const { error } = await submitBankQuestion({
			subjectId,
			topic,
			difficulty,
			text,
			options,
			correctIndex,
			explanation
		});

		sendingSoal = false;
		if (error) {
			formErrorSoal = error;
			return;
		}
		sentSoal = true;
		subjectId = null;
		topic = '';
		text = '';
		options = ['', '', '', ''];
		correctIndex = 0;
		explanation = '';
		goto(resolve('/contribute'));
	}
</script>

<div class="mx-auto w-full max-w-5xl pb-24">
	{#if signedIn === null}
		<p class="py-8 text-sm text-slate-500">Memuat...</p>
	{:else if !signedIn}
		<div class="py-8">
			<AuthNotice message="Masuk untuk berkontribusi." />
		</div>
	{:else if !canContribute}
		<div class="py-4">
			<a
				href={resolve('/contribute')}
				class="text-sm font-medium text-slate-600 hover:text-slate-800">← Contribute</a
			>
			<h1 class="mt-3 text-2xl font-bold text-slate-900">Buat kontribusi</h1>
		</div>
		<EmptyState
			icon={PenLine}
			title="Khusus Kontributor"
			description="Menulis dibuka untuk peran Kontributor ke atas. Hubungi admin untuk upgrade."
		/>
	{:else}
		<div class="py-4">
			<a
				href={resolve('/contribute')}
				class="text-sm font-medium text-slate-600 hover:text-slate-800">← Contribute</a
			>
			<h1 class="mt-3 text-2xl font-bold text-slate-900">Buat kontribusi</h1>
		</div>

		<section aria-label="Tulis" id="kirim" class="mb-5 scroll-mt-4">
			{#if sent}
				<p class="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
					Terkirim sebagai draft.
				</p>
			{/if}
			{#if sentSoal}
				<p class="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
					Soal terkirim sebagai draft.
				</p>
			{/if}
			<div class="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
				<button
					type="button"
					onclick={() => {
						kirimKind = 'tulisan';
						step = 1;
					}}
					aria-pressed={kirimKind === 'tulisan'}
					class="rounded-lg py-2 text-sm font-semibold transition-colors {kirimKind === 'tulisan'
						? 'bg-white text-slate-800 shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					Tulisan
				</button>
				<button
					type="button"
					onclick={() => (kirimKind = 'soal')}
					aria-pressed={kirimKind === 'soal'}
					class="rounded-lg py-2 text-sm font-semibold transition-colors {kirimKind === 'soal'
						? 'bg-white text-slate-800 shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					Soal
				</button>
			</div>

			{#if kirimKind === 'soal'}
				<form
					onsubmit={submitSoal}
					class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
				>
					{#if formErrorSoal}
						<p class="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
							{formErrorSoal}
						</p>
					{/if}
					<div class="grid grid-cols-2 gap-4">
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
							Tingkat
							<select
								bind:value={difficulty}
								class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
							>
								<option>Mudah</option>
								<option>Sedang</option>
								<option>Sulit</option>
							</select>
						</label>
					</div>
					<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
						Topik (opsional)
						<input
							type="text"
							bind:value={topic}
							maxlength={80}
							placeholder="mis. Persamaan kuadrat"
							class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
						/>
					</label>
					<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
						Teks soal
						<textarea
							required
							bind:value={text}
							rows={3}
							class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none"
						></textarea>
					</label>
					<fieldset class="flex flex-col gap-2">
						<legend class="text-sm font-medium text-slate-700">
							Pilihan jawaban (centang yang benar)
						</legend>
						{#each [0, 1, 2, 3] as i (i)}
							<label class="flex items-center gap-2">
								<input
									type="radio"
									name="correct"
									checked={correctIndex === i}
									onchange={() => (correctIndex = i)}
									aria-label="Tandai pilihan {i + 1} sebagai jawaban benar"
									class="h-4 w-4 accent-primary-600"
								/>
								<input
									type="text"
									bind:value={options[i]}
									placeholder="Pilihan {i + 1}"
									aria-label="Pilihan jawaban {i + 1}"
									class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
								/>
							</label>
						{/each}
					</fieldset>
					<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
						Pembahasan (opsional)
						<textarea
							bind:value={explanation}
							rows={2}
							class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none"
						></textarea>
					</label>
					<button
						type="submit"
						disabled={sendingSoal}
						class="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400"
					>
						{sendingSoal ? 'Mengirim...' : 'Kirim'}
					</button>
				</form>
			{:else if step === 1}
				<div
					class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
				>
					<button
						type="button"
						onclick={() => coverInput?.click()}
						class="flex min-h-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-slate-300"
					>
						{#if coverPreview}
							<img src={coverPreview} alt="Pratinjau sampul" class="max-h-48 w-full object-cover" />
						{:else}
							<span class="p-6 text-center text-xs text-slate-400"
								>+ Sampul (opsional, maks 2MB)</span
							>
						{/if}
					</button>
					<input
						bind:this={coverInput}
						type="file"
						accept="image/*"
						class="hidden"
						onchange={onCoverPicked}
						aria-label="Pilih gambar sampul"
					/>
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
					<div class="grid grid-cols-2 gap-4">
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
							Ringkasan
							<input
								type="text"
								bind:value={description}
								maxlength={300}
								placeholder="Satu kalimat (opsional)"
								class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
							/>
						</label>
					</div>
					<div>
						<p class="mb-1.5 text-sm font-medium text-slate-700">Tag</p>
						<div class="flex flex-wrap gap-2">
							{#each allTags as tag (tag.id)}
								<button
									type="button"
									onclick={() => toggleTag(tag.id)}
									aria-pressed={tagIds.includes(tag.id)}
									class="rounded-full border px-3 py-1 text-xs font-semibold {tagIds.includes(
										tag.id
									)
										? 'border-primary-600 text-primary-700'
										: 'border-slate-200 text-slate-500 hover:border-slate-300'}"
								>
									{tag.name}
								</button>
							{/each}
						</div>
						<div class="mt-2 flex gap-2">
							<input
								type="text"
								bind:value={newTag}
								maxlength={40}
								placeholder="Tag baru…"
								class="focus:border-primary-500 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
							/>
							<button
								type="button"
								onclick={addTag}
								class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
							>
								Tambah
							</button>
						</div>
					</div>
					{#if formError}
						<p class="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
							{formError}
						</p>
					{/if}
					<button
						type="button"
						onclick={goStep2}
						class="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700"
					>
						Lanjut
					</button>
				</div>
			{:else}
				<div
					class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
				>
					<div class="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Format tulisan">
						<button
							type="button"
							onclick={() => insertAtCursor('\n\n# ', 0)}
							title="Judul"
							class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
							>H</button
						>
						<button
							type="button"
							onclick={() => insertAtCursor('**teks**', 2)}
							title="Tebal"
							class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
							>B</button
						>
						<button
							type="button"
							onclick={() => insertAtCursor('*teks*', 1)}
							title="Miring"
							class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 italic hover:bg-slate-50"
							>I</button
						>
						<button
							type="button"
							onclick={() => insertAtCursor('\n\n> ', 0)}
							title="Kutipan"
							class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
							>“ ”</button
						>
						<button
							type="button"
							onclick={() => insertAtCursor('\n\n- ', 0)}
							title="Daftar"
							class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
							>• Daftar</button
						>
						<button
							type="button"
							onclick={() => imageInput?.click()}
							title="Sisipkan gambar"
							class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
							>🖼</button
						>
					</div>
					<input
						bind:this={imageInput}
						type="file"
						accept="image/*"
						class="hidden"
						onchange={onBodyImagePicked}
						aria-label="Pilih gambar isi"
					/>
					<textarea
						bind:this={bodyEl}
						bind:value={bodyText}
						rows={12}
						placeholder="Tulis di sini…"
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none"
					></textarea>
					{#if formError}
						<p class="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
							{formError}
						</p>
					{/if}
					<div class="flex gap-2">
						<button
							type="button"
							onclick={() => (step = 1)}
							class="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
						>
							← Kembali
						</button>
						<button
							type="button"
							onclick={publish}
							disabled={sending}
							class="flex-1 rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400"
						>
							{sending ? 'Menerbitkan...' : 'Terbitkan'}
						</button>
					</div>
				</div>
			{/if}
		</section>
	{/if}
</div>
