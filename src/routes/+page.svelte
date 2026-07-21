<script lang="ts">
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
<div class="relative w-full h-48 rounded-2xl overflow-hidden mb-8">
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
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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