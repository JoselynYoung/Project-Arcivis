<script lang="ts">
	import { Plus, BookOpen } from '@lucide/svelte';
	import AuthNotice from '$lib/components/AuthNotice.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { getBankQuestions, submitBankQuestion, type BankQuestion } from '$lib/services/bank';
	import { getPublicSubjects } from '$lib/services/subjects';
	import { supabase } from '$lib/services/supabaseClient';
	import { getMyRole, CONTRIBUTOR_ROLES } from '$lib/services/profile';

	let signedIn = $state<boolean | null>(null);
	let role = $state<string | null>(null);
	const canContribute = $derived(role !== null && CONTRIBUTOR_ROLES.includes(role));
	let questions = $state<BankQuestion[]>([]);
	let loadError = $state<string | null>(null);
	let subjects = $state<{ id: string; name: string }[]>([]);
	let formOpen = $state(false);

	let subjectId = $state<string | null>(null);
	let topic = $state('');
	let difficulty = $state('Sedang');
	let text = $state('');
	let options = $state(['', '', '', '']);
	let correctIndex = $state(0);
	let explanation = $state('');
	let sending = $state(false);
	let formError = $state<string | null>(null);
	let sent = $state(false);

	$effect(() => {
		supabase.auth.getSession().then(async ({ data }) => {
			signedIn = !!data.session;
			if (data.session) role = await getMyRole();
		});
		getBankQuestions().then(({ data, error }) => {
			if (error) loadError = error;
			else questions = data;
		});
		getPublicSubjects().then(({ data, error }) => {
			if (!error) subjects = data;
		});
	});

	async function submit(event: Event) {
		event.preventDefault();
		if (sending) return;
		sending = true;
		formError = null;

		const { error } = await submitBankQuestion({
			subjectId,
			topic,
			difficulty,
			text,
			options,
			correctIndex,
			explanation
		});

		sending = false;

		if (error) {
			formError = error;
			return;
		}

		sent = true;
		formOpen = false;
		subjectId = null;
		topic = '';
		text = '';
		options = ['', '', '', ''];
		correctIndex = 0;
		explanation = '';
	}
</script>

<div class="mx-auto w-full max-w-2xl pb-12">
	<h1 class="mb-1 text-xl font-bold text-slate-800">Bank Soal Komunitas</h1>
	<p class="mb-6 text-sm text-slate-500">
		Soal buatan komunitas. Kurator memilih yang layak masuk paket resmi.
	</p>

	{#if signedIn === null}
		<p class="text-sm text-slate-500">Memuat...</p>
	{:else if !signedIn}
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<AuthNotice message="Masuk untuk mengirim soal ke bank komunitas." />
		</div>
	{:else if canContribute}
		<button
			type="button"
			onclick={() => {
				formOpen = !formOpen;
				formError = null;
				sent = false;
			}}
			aria-expanded={formOpen}
			class="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700"
		>
			<Plus size={16} />
			{formOpen ? 'Tutup formulir' : 'Kirim soal'}
		</button>
	{/if}

	{#if sent}
		<p class="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700" role="status">
			Soal terkirim sebagai draft. Kurator akan meninjaunya.
		</p>
	{/if}

	{#if formOpen && signedIn && canContribute}
		<form
			onsubmit={submit}
			class="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
		>
			{#if formError}
				<p class="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
					{formError}
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
				<legend class="text-sm font-medium text-slate-700"
					>Pilihan jawaban (centang yang benar)</legend
				>
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
				disabled={sending}
				class="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400"
			>
				{sending ? 'Mengirim...' : 'Kirim sebagai draft'}
			</button>
		</form>
	{/if}

	{#if loadError}
		<EmptyState icon={BookOpen} title="Bank Tidak Dapat Dimuat" description={loadError} />
	{:else if questions.length === 0}
		<EmptyState
			icon={BookOpen}
			title="Belum ada soal terverifikasi"
			description="Jadilah yang pertama mengirim soal ke bank komunitas."
		/>
	{:else}
		<div class="flex flex-col gap-3">
			{#each questions as question (question.id)}
				<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
					<div class="mb-1 flex items-center gap-2 text-xs">
						<span class="font-medium text-slate-400">{question.subject}</span>
						{#if question.topic}
							<span class="text-slate-400">· {question.topic}</span>
						{/if}
						<span class="ml-auto font-medium text-slate-500">{question.difficulty}</span>
					</div>
					<p class="text-sm font-medium text-slate-800">{question.text}</p>
					<p class="mt-1 text-xs text-slate-400">oleh {question.authorName}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
