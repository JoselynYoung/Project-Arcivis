<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ArrowLeft, Zap, Play, Check } from '@lucide/svelte';
	import { subjects } from '$lib/mocks/practice';
	import { ROUTES } from '$lib/constants/routes';
	import { setQuizGeneratorConfig } from '$lib/utils/quizGeneratorState.svelte';

	const topicOptions: Record<string, string[]> = {
		Matematika: ['Aljabar', 'Geometri', 'Barisan & Deret', 'Peluang', 'Trigonometri'],
		Fisika: ['Kinematika', 'Hukum Newton', 'Termodinamika', 'Listrik'],
		Kimia: ['Stoikiometri', 'Ikatan Kimia', 'Termokimia', 'Larutan'],
		Biologi: ['Sel', 'Genetika', 'Ekosistem', 'Evolusi'],
		'B.Indonesia': ['Teks Eksposisi', 'Teks Narasi', 'Kosakata', 'Ejaan'],
		'B.Inggris': ['Reading', 'Vocabulary', 'Grammar', 'Inference'],
		Penalaran: ['Logika', 'Pola Bilangan', 'Analisis Korelasi', 'Silogisme']
	};

	const difficultyOptions = ['Mudah', 'Sedang', 'Sulit'];
	const modeOptions = [
		{ id: 'latihan', label: 'Latihan', description: 'Pembahasan langsung setelah setiap jawaban' },
		{ id: 'tryout', label: 'Tryout', description: 'Mengerjakan semua soal, skor di akhir' }
	];
	const amountOptions = [5, 10, 15, 20, 30];

	let selectedSubject = $state(subjects[0].name);
	let selectedTopic = $state(topicOptions[subjects[0].name][0]);
	let selectedDifficulty = $state(difficultyOptions[1]);
	let selectedMode = $state(modeOptions[0].id);
	let selectedAmount = $state(amountOptions[1]);

	const topics = $derived(topicOptions[selectedSubject] ?? []);

	$effect(() => {
		if (!topics.includes(selectedTopic)) {
			selectedTopic = topics[0] ?? '';
		}
	});

	function startSession() {
		setQuizGeneratorConfig({
			subject: selectedSubject,
			topic: selectedTopic,
			difficulty: selectedDifficulty,
			mode: selectedMode,
			questionCount: selectedAmount
		});
		goto(resolve('/practice/quiz-generator/session'));
	}
</script>

<div class="mx-auto w-full max-w-3xl pb-12">
	<div class="mb-6">
		<a
			href={resolve(ROUTES.practice)}
			class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
		>
			<ArrowLeft size={18} />
			<span>Kembali ke Practice</span>
		</a>
	</div>

	<div class="mb-8">
		<div class="mb-2 flex items-center gap-2">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm"
			>
				<Zap size={20} />
			</div>
			<h1 class="text-2xl font-bold text-slate-900">Latihan Acak</h1>
		</div>
		<p class="text-sm text-slate-500">
			Sesuaikan konfigurasi latihan dengan kebutuhanmu. Kamu bisa menggabungkan mapel, topik,
			tingkat kesulitan, dan jumlah soal.
		</p>
	</div>

	<!-- Subject Select -->
	<div class="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
		<p class="mb-4 text-sm font-bold text-slate-800">Pilih Mapel</p>
		<div class="flex max-w-full flex-wrap gap-2">
			{#each subjects as subject (subject.name)}
				<button
					type="button"
					onclick={() => (selectedSubject = subject.name)}
					class="shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all {selectedSubject ===
					subject.name
						? 'border-primary-600 bg-primary-600 text-white shadow-sm'
						: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
				>
					{subject.name}
				</button>
			{/each}
		</div>
	</div>

	<!-- Topic Select -->
	<div class="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
		<p class="mb-4 text-sm font-bold text-slate-800">Pilih Topik</p>
		<div class="flex max-w-full flex-wrap gap-2">
			{#each topics as topic (topic)}
				<button
					type="button"
					onclick={() => (selectedTopic = topic)}
					class="shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all {selectedTopic ===
					topic
						? 'border-primary-600 bg-primary-600 text-white shadow-sm'
						: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
				>
					{topic}
				</button>
			{/each}
		</div>
	</div>

	<!-- Difficulty + Amount -->
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<p class="mb-4 text-sm font-bold text-slate-800">Tingkat Kesulitan</p>
			<div class="flex flex-col gap-2">
				{#each difficultyOptions as diff (diff)}
					<button
						type="button"
						onclick={() => (selectedDifficulty = diff)}
						class="flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all {selectedDifficulty ===
						diff
							? 'border-primary-600 bg-primary-50 font-medium text-primary-700'
							: 'border-slate-200 text-slate-700 hover:bg-slate-50'}"
					>
						{diff}
						{#if selectedDifficulty === diff}
							<Check size={16} class="shrink-0 text-primary-600" />
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<p class="mb-4 text-sm font-bold text-slate-800">Jumlah Soal</p>
			<div class="flex flex-wrap gap-2">
				{#each amountOptions as amount (amount)}
					<button
						type="button"
						onclick={() => (selectedAmount = amount)}
						class="shrink-0 cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-all {selectedAmount ===
						amount
							? 'border-primary-600 bg-primary-600 text-white shadow-sm'
							: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
					>
						{amount}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Mode -->
	<div class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
		<p class="mb-4 text-sm font-bold text-slate-800">Mode Latihan</p>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			{#each modeOptions as mode (mode.id)}
				<button
					type="button"
					onclick={() => (selectedMode = mode.id)}
					class="flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all {selectedMode ===
					mode.id
						? 'border-primary-600 bg-primary-50'
						: 'border-slate-200 hover:bg-slate-50'}"
				>
					<span
						class="text-sm font-semibold {selectedMode === mode.id
							? 'text-primary-700'
							: 'text-slate-800'}"
					>
						{mode.label}
					</span>
					<span class="text-xs text-slate-500">{mode.description}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Summary + Start -->
	<div class="mt-8 rounded-3xl border border-primary-100 bg-primary-50/60 p-6 sm:p-8">
		<div class="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
			<span class="rounded-full bg-white px-3 py-1 shadow-sm">{selectedSubject}</span>
			<span class="rounded-full bg-white px-3 py-1 shadow-sm">{selectedTopic}</span>
			<span class="rounded-full bg-white px-3 py-1 shadow-sm">{selectedDifficulty}</span>
			<span class="rounded-full bg-white px-3 py-1 shadow-sm">{selectedAmount} Soal</span>
			<span class="rounded-full bg-white px-3 py-1 shadow-sm"
				>{modeOptions.find((m) => m.id === selectedMode)?.label}</span
			>
		</div>
		<button
			type="button"
			onclick={startSession}
			class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg"
		>
			<Play size={18} />
			Mulai Latihan
		</button>
	</div>
</div>
