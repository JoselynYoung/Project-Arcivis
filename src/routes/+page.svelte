<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	// Carousel
	let banners = [
		{ judul: 'Paket Soal Baru', keterangan: '5 paket latihan penalaran', warna: 'bg-primary-700' },
		{ judul: 'Bacaan Tematik', keterangan: 'Krisis iklim & energi', warna: 'bg-accent' },
		{ judul: 'Cheat Sheet', keterangan: 'Rumus deret & barisan', warna: 'bg-primary-900' }
	];

	let currentIndex = $state(0);

	function next() {
		currentIndex = (currentIndex + 1) % banners.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + banners.length) % banners.length;
	}

	$effect(() => {
		const timer = setInterval(next, 4000);
		return () => clearInterval(timer);
	});

	// for Welcome Page
	let nama = 'Pejuang';
</script>

<!-- Page Header -->
<div class="flex flex-col gap-2 mb-8">
	<h1 class="text-3xl font-bold text-slate-800 leading-snug">
		Halo, {nama}! 👋<br />
		Mau <span class="text-primary-600">belajar</span> apa hari ini?
	</h1>
	<p class="text-slate-500 text-sm">
		Investasikan waktumu, ambil langkah pertama menuju UTBK impianmu.
	</p>
</div>

<!-- Banner Carousel -->
<div class="relative w-full h-48 rounded-2xl overflow-hidden mb-10">
	{#key currentIndex}
		<div transition:fade={{ duration: 400 }}
			class="absolute inset-0 flex flex-col justify-end p-6 text-white {banners[currentIndex].warna}">
			<p class="text-xs font-medium uppercase tracking-wide opacity-80">{banners[currentIndex].judul}</p>
			<p class="text-lg font-semibold">{banners[currentIndex].keterangan}</p>
		</div>
	{/key}
	<div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
		{#each banners as banner, i (banner.judul)}
			<button onclick={() => currentIndex = i} type="button"
				aria-label={`Pilih banner ${banner.judul}`}
				class="h-1.5 rounded-full transition-all {i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}">
			</button>
		{/each}
	</div>
	<button onclick={prev} type="button" aria-label="Previous banner"
		class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 flex items-center justify-center z-10">
		‹
	</button>
	<button onclick={next} type="button" aria-label="Next banner"
		class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 flex items-center justify-center z-10">
		›
	</button>
</div>

<!-- Statistics Card -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
	<div class="bg-white rounded-xl shadow-sm p-4">
		<p class="text-2xl font-bold text-slate-800">18 sesi</p>
		<p class="text-sm text-slate-500">Riwayat belajar</p>
	</div>
	<div class="bg-white rounded-xl shadow-sm p-4">
		<p class="text-2xl font-bold text-slate-800">76%</p>
		<p class="text-sm text-slate-500">Akurasi</p>
	</div>
	<div class="bg-white rounded-xl shadow-sm p-4">
		<p class="text-2xl font-bold text-slate-800">340</p>
		<p class="text-sm text-slate-500">Soal dikerjakan</p>
	</div>
</div>

<!-- Fresh Materials Cards -->
<div class="mb-10">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-lg font-bold text-slate-800">Materi Fresh</h2>
		<button type="button" class="text-primary-600 hover:text-primary-700">
			<ChevronRight size={20} />
		</button>
	</div>

	<div class="flex gap-4 overflow-x-auto pb-3">
		<div class="relative shrink-0 w-40 h-40 bg-linear-to-br from-accent to-cyan-400 rounded-xl p-4 text-white flex flex-col justify-end overflow-visible">
			<div class="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/20 blur-sm"></div>
			<div class="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-white/20"></div>
			<p class="relative z-10 text-xs opacity-80">Kumpulan</p>
			<p class="relative z-10 font-bold leading-snug">Materi UTBK 2026</p>
		</div>
		<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-cyan-100">
			<div class="bg-cyan-50 rounded-lg h-24 mb-3"></div>
			<p class="text-xs text-slate-400 mb-0.5">Matematika</p>
			<p class="text-sm font-medium text-slate-800 leading-snug">Fungsi Kuadrat Lanjutan</p>
		</div>
		<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-cyan-100">
			<div class="bg-cyan-50 rounded-lg h-24 mb-3"></div>
			<p class="text-xs text-slate-400 mb-0.5">Bahasa Indonesia</p>
			<p class="text-sm font-medium text-slate-800 leading-snug">Literasi Lanjutan</p>
		</div>
		<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-cyan-100">
			<div class="bg-cyan-50 rounded-lg h-24 mb-3"></div>
			<p class="text-xs text-slate-400 mb-0.5">Fisika</p>
			<p class="text-sm font-medium text-slate-800 leading-snug">Gerak Parabola</p>
		</div>
	</div>
</div>

<!-- fresh latihan soal card-->
<div class="mb-10">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-lg font-bold text-slate-800">Paket Latihan Soal</h2>
		<button type="button" class="text-primary-600 hover:text-primary-700">
			<ChevronRight size={20} />
		</button>
	</div>

	<div class="flex gap-4 overflow-x-auto pb-3">

		<div class="relative shrink-0 w-40 h-40 bg-linear-to-br from-emerald-700 to-emerald-500 rounded-xl p-4 text-white flex flex-col justify-end overflow-visible">
			<div class="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/20 blur-sm"></div>
			<div class="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-white/20"></div>
			<p class="relative z-10 text-xs opacity-80">Simulasi</p>
			<p class="relative z-10 font-bold leading-snug">UTBK 2026</p>
		</div>

		<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-emerald-100">
			<div class="bg-emerald-50 rounded-lg h-24 mb-3"></div>
			<p class="text-xs text-slate-400 mb-0.5">Penalaran Matematika</p>
			<p class="text-sm font-medium text-slate-800 leading-snug">20 Soal</p>
		</div>

		<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-emerald-100">
			<div class="bg-emerald-50 rounded-lg h-24 mb-3"></div>
			<p class="text-xs text-slate-400 mb-0.5">Literasi B. Indonesia</p>
			<p class="text-sm font-medium text-slate-800 leading-snug">15 Soal</p>
		</div>

		<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-emerald-100">
			<div class="bg-emerald-50 rounded-lg h-24 mb-3"></div>
			<p class="text-xs text-slate-400 mb-0.5">Penalaran Umum</p>
			<p class="text-sm font-medium text-slate-800 leading-snug">20 Soal</p>
		</div>
	</div>
</div>