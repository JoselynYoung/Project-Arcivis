<script lang="ts">
	import { BookOpen, PenLine, ShieldCheck } from '@lucide/svelte';
	import AuthNotice from '$lib/components/AuthNotice.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { getPublicSubjects } from '$lib/services/subjects';
	import { submitContribution, type ContributionType } from '$lib/services/contributions';
	import { getBankQuestions, submitBankQuestion, type BankQuestion } from '$lib/services/bank';
	import { getReviewQueue, decideReview, type ReviewItem } from '$lib/services/review';
	import { getMyRole, CONTRIBUTOR_ROLES, MODERATOR_ROLES } from '$lib/services/profile';
	import { supabase } from '$lib/services/supabaseClient';

	let signedIn = $state<boolean | null>(null);
	let role = $state<string | null>(null);
	const canContribute = $derived(role !== null && CONTRIBUTOR_ROLES.includes(role));
	const canReview = $derived(role !== null && MODERATOR_ROLES.includes(role));

	let subjects = $state<{ id: string; name: string }[]>([]);
	let questions = $state<BankQuestion[]>([]);
	let loadError = $state<string | null>(null);

	let items = $state<ReviewItem[]>([]);
	let reviewError = $state<string | null>(null);
	let acting = $state<string | null>(null);

	let kirimTab = $state<'article' | 'learning' | 'soal'>('article');
	let type = $state<ContributionType>('article');
	let title = $state('');
	let subjectId = $state<string | null>(null);
	let description = $state('');
	let bodyText = $state('');
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

	$effect(() => {
		supabase.auth.getSession().then(async ({ data }) => {
			signedIn = !!data.session;
			if (data.session) role = await getMyRole();
			if (role && MODERATOR_ROLES.includes(role)) {
				const { data: queue, error } = await getReviewQueue();
				if (error) reviewError = error;
				else items = queue;
			}
		});
		getBankQuestions().then(({ data, error }) => {
			if (error) loadError = error;
			else questions = data;
		});
		getPublicSubjects().then(({ data, error }) => {
			if (!error) subjects = data;
		});
	});

	async function submitDraft(event: Event) {
		event.preventDefault();
		if (sending) return;
		sending = true;
		formError = null;

		const { error } = await submitContribution({
			type,
			title,
			subjectId: subjectId || null,
			description,
			bodyText
		});

		sending = false;
		if (error) {
			formError = error;
			return;
		}
		sent = true;
		title = '';
		description = '';
		bodyText = '';
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
	}

	async function decide(id: string, decision: 'diverifikasi' | 'draft') {
		if (acting) return;
		acting = id;
		const { error } = await decideReview(id, decision);
		acting = null;
		if (error) {
			reviewError = error;
			return;
		}
		items = items.filter((item) => item.id !== id);
	}
</script>

<div class="mx-auto w-full max-w-2xl pb-12">
	<h1 class="mb-1 text-xl font-bold text-slate-800">Kontribusi</h1>
	<p class="mb-6 text-sm text-slate-500">
		Bank soal komunitas, kirim tulisan dan soal, dan antrian review kurator — satu pintu.
	</p>

	{#if signedIn === null}
		<p class="text-sm text-slate-500">Memuat...</p>
	{:else}
		{#if !signedIn}
			<div class="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<AuthNotice message="Masuk untuk berkontribusi." />
			</div>
		{/if}

		{#if canContribute}
			<section aria-label="Kirim kontribusi" class="mb-8">
				<h2 class="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
					<PenLine size={16} class="text-primary-600" /> Kirim
				</h2>
				<div class="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
					<button
						type="button"
						onclick={() => (kirimTab = 'article')}
						aria-pressed={kirimTab === 'article'}
						class="rounded-lg py-2 text-sm font-semibold transition-colors {kirimTab === 'article'
							? 'bg-white text-slate-800 shadow-sm'
							: 'text-slate-500 hover:text-slate-700'}"
					>
						Artikel
					</button>
					<button
						type="button"
						onclick={() => {
							kirimTab = 'learning';
							type = 'learning';
						}}
						aria-pressed={kirimTab === 'learning'}
						class="rounded-lg py-2 text-sm font-semibold transition-colors {kirimTab === 'learning'
							? 'bg-white text-slate-800 shadow-sm'
							: 'text-slate-500 hover:text-slate-700'}"
					>
						Materi
					</button>
					<button
						type="button"
						onclick={() => (kirimTab = 'soal')}
						aria-pressed={kirimTab === 'soal'}
						class="rounded-lg py-2 text-sm font-semibold transition-colors {kirimTab === 'soal'
							? 'bg-white text-slate-800 shadow-sm'
							: 'text-slate-500 hover:text-slate-700'}"
					>
						Soal
					</button>
				</div>

				{#if sent}
					<p
						class="mt-4 mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700"
						role="status"
					>
						Tulisan terkirim sebagai draft. Kurator akan meninjaunya.
					</p>
				{/if}
				{#if sentSoal}
					<p
						class="mt-4 mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700"
						role="status"
					>
						Soal terkirim sebagai draft. Kurator akan meninjaunya.
					</p>
				{/if}

				{#if kirimTab === 'soal'}
					<form
						onsubmit={submitSoal}
						class="mt-4 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
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
							{sendingSoal ? 'Mengirim...' : 'Kirim sebagai draft'}
						</button>
					</form>
				{:else}
					<form
						onsubmit={submitDraft}
						class="mt-4 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
					>
						{#if formError}
							<p class="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
								{formError}
							</p>
						{/if}
						<p class="text-xs text-slate-500">
							Tulisanmu masuk sebagai draft. Kurator akan meninjaunya sebelum tayang.
						</p>
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
				{/if}
			</section>
		{/if}

		{#if canReview}
			<section aria-label="Antrian review" class="mb-8">
				<h2 class="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
					<ShieldCheck size={16} class="text-primary-600" /> Antrian Review
				</h2>
				{#if reviewError}
					<EmptyState
						icon={ShieldCheck}
						title="Antrian Tidak Dapat Dimuat"
						description={reviewError}
					/>
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
			</section>
		{/if}

		<section aria-label="Bank soal komunitas">
			<h2 class="mb-1 flex items-center gap-2 text-base font-bold text-slate-800">
				<BookOpen size={16} class="text-primary-600" /> Bank Soal
			</h2>
			<p class="mb-4 text-sm text-slate-500">
				Soal buatan komunitas. Kurator memilih yang layak masuk paket resmi.
			</p>
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
		</section>
	{/if}
</div>
