<script lang="ts">
	import { page } from '$app/state';
	import { Check, X, ArrowRight, RotateCcw } from '@lucide/svelte';

	// Baca id paket dari URL, misal /latihan/1 -> paketId = "1"
	let paketId = $derived(page.params.ID);

	interface Soal {
		id: number;
		pertanyaan: string;
		pilihan: string[];
		jawabanBenar: number; // index pilihan yang benar
		pembahasan: string;
	}

	// Data soal (sementara hardcode, sama untuk semua paket dulu)
	let daftarSoal: Soal[] = [
		{
			id: 1,
			pertanyaan: 'Jika 3x + 5 = 20, maka nilai x adalah...',
			pilihan: ['3', '5', '7', '15'],
			jawabanBenar: 1,
			pembahasan: '3x + 5 = 20 → 3x = 15 → x = 5.'
		},
		{
			id: 2,
			pertanyaan: 'Kata "distraksi" dalam konteks belajar paling dekat maknanya dengan...',
			pilihan: ['Fokus', 'Gangguan', 'Kelelahan', 'Ketekunan'],
			jawabanBenar: 1,
			pembahasan: '"Distraksi" berarti sesuatu yang mengganggu perhatian atau konsentrasi.'
		},
		{
			id: 3,
			pertanyaan: 'Manakah pola yang tepat melanjutkan deret: 2, 6, 12, 20, ...?',
			pilihan: ['28', '30', '32', '24'],
			jawabanBenar: 1,
			pembahasan: 'Selisihnya bertambah 2 tiap langkah (4, 6, 8, 10), jadi 20 + 10 = 30.'
		}
	];

	// State progres pengerjaan
	let currentIndex = $state(0);
	let selectedAnswer = $state<number | null>(null);
	let isSubmitted = $state(false);
	let jumlahBenar = $state(0);

	let soalSekarang = $derived(daftarSoal[currentIndex]);
	let isSelesai = $derived(currentIndex >= daftarSoal.length);

	function pilihJawaban(index: number) {
		if (isSubmitted) return;
		selectedAnswer = index;
	}

	function submitJawaban() {
		if (selectedAnswer === null) return;
		isSubmitted = true;
		if (selectedAnswer === soalSekarang.jawabanBenar) {
			jumlahBenar += 1;
		}
	}

	function soalBerikutnya() {
		currentIndex += 1;
		selectedAnswer = null;
		isSubmitted = false;
	}

	function ulangiPaket() {
		currentIndex = 0;
		selectedAnswer = null;
		isSubmitted = false;
		jumlahBenar = 0;
	}
</script>

<div class="w-full max-w-2xl mx-auto">

	{#if !isSelesai}

		<!-- Progress -->
		<div class="flex items-center justify-between mb-6">
			<p class="text-sm text-slate-500">Paket #{paketId} · Soal {currentIndex + 1} dari {daftarSoal.length}</p>
			<div class="flex gap-1.5">
            <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
				{#each daftarSoal as _, i (i)}
					<span class="h-1.5 w-6 rounded-full {i <= currentIndex ? 'bg-primary-600' : 'bg-slate-200'}"></span>
				{/each}
			</div>
		</div>

		<!-- Kartu Soal -->
		<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

			<p class="font-medium text-slate-800 mb-5">{soalSekarang.pertanyaan}</p>

			<div class="flex flex-col gap-2 mb-5">
				{#each soalSekarang.pilihan as opsi, i (i)}
					{#if !isSubmitted}
						<button
							type="button"
							onclick={() => pilihJawaban(i)}
							class="text-left px-4 py-3 rounded-xl border text-sm transition-colors {selectedAnswer === i ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}"
						>
							{opsi}
						</button>
					{:else}
						<div
							class="flex items-center justify-between px-4 py-3 rounded-xl border text-sm
								{i === soalSekarang.jawabanBenar ? 'border-emerald-300 bg-emerald-50 text-emerald-700 font-medium' : i === selectedAnswer ? 'border-red-300 bg-red-50 text-red-700 font-medium' : 'border-slate-200 text-slate-500'}"
						>
							{opsi}
							{#if i === soalSekarang.jawabanBenar}
								<Check size={16} class="text-emerald-600" />
							{:else if i === selectedAnswer}
								<X size={16} class="text-red-600" />
							{/if}
						</div>
					{/if}
				{/each}
			</div>

			{#if isSubmitted}
				<div class="bg-slate-50 rounded-xl p-4 mb-5">
					<p class="text-xs font-semibold text-slate-500 mb-1">Pembahasan</p>
					<p class="text-sm text-slate-600">{soalSekarang.pembahasan}</p>
				</div>
			{/if}

			{#if !isSubmitted}
				<button
					type="button"
					onclick={submitJawaban}
					disabled={selectedAnswer === null}
					class="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold disabled:bg-slate-200 disabled:text-slate-400 hover:bg-primary-700 transition-colors"
				>
					Kumpulkan Jawaban
				</button>
			{:else}
				<button
					type="button"
					onclick={soalBerikutnya}
					class="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
				>
					Soal Berikutnya <ArrowRight size={16} />
				</button>
			{/if}

		</div>

	{:else}

		<!-- Halaman Hasil -->
		<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
			<p class="text-sm text-slate-500 mb-2">Paket #{paketId} selesai</p>
			<p class="text-4xl font-bold text-primary-700 mb-1">{jumlahBenar} / {daftarSoal.length}</p>
			<p class="text-sm text-slate-500 mb-6">Jawaban benar</p>

			<button
				type="button"
				onclick={ulangiPaket}
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
			>
				<RotateCcw size={16} /> Ulangi Paket
			</button>
		</div>

	{/if}

</div>