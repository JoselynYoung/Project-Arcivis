<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	// For Calendar
	let namaBulan = 'Juli 2026';
	let namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

	// hardcode dulu: bulan ini mulai dari hari ke berapa (0=Minggu, 3=Rabu, dst)
	let offsetAwal = 3;
	let jumlahHari = 31;

	// gabungkan jadi 1 array: kotak kosong (null) + angka tanggal
	let tanggalGrid = [
		...Array(offsetAwal).fill(null),
		...Array(jumlahHari).fill(0).map((_, i) => i + 1)
	];

	let tanggalPenting = 22; // dianggap "hari ini", buat dikasih highlight

	let jadwal = [
		{ tanggal: 25, label: 'Pendaftaran SNBT dibuka', warna: 'bg-primary-600' },
		{ tanggal: 12, label: 'Simulasi UTBK nasional', warna: 'bg-emerald-500' },
		{ tanggal: 30, label: 'Batas akhir isi PDSS', warna: 'bg-amber-500' }
	];

	// Carousel
	let banners = [
		{ judul: 'Paket Soal Baru', keterangan: '5 paket latihan penalaran', warna: 'bg-primary-700' },
		{ judul: 'Bacaan Tematik', keterangan: 'Krisis iklim & energi', warna: 'bg-accent' },
		{ judul: 'Cheat Sheet', keterangan: 'Rumus deret & barisan', warna: 'bg-primary-900' }
	];

	let currentIndex = $state(0); // index banner yang lagi ditampilkan

	function next() {
		currentIndex = (currentIndex + 1) % banners.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + banners.length) % banners.length;
	}

	// auto-scroll: ganti banner tiap 4 detik, berhenti kalau komponen ini hilang dari layar
	$effect(() => {
		const timer = setInterval(next, 4000);
		return () => clearInterval(timer);
	});

	// for Welcome Page
	let nama = 'Pejuang';
</script>

<!-- Page Header (full width, di luar grid) -->
<div class="flex flex-col gap-2 mb-8">
	<h1 class="text-3xl font-bold text-slate-800 leading-snug">
		Halo, {nama}! 👋<br />
		Mau <span class="text-primary-600">belajar</span> apa hari ini?
	</h1>
	<p class="text-slate-500 text-sm">
		Investasikan waktumu, ambil langkah pertama menuju UTBK impianmu.
	</p>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

	<div class="lg:col-span-2">

		<!-- Banner Carousel -->
		<div class="relative w-full h-48 rounded-2xl overflow-hidden mb-10">

			<!-- Slide aktif (fade transition tiap ganti currentIndex) -->
			{#key currentIndex}
				<div transition:fade={{ duration: 400 }}
					class="absolute inset-0 flex flex-col justify-end p-6 text-white {banners[currentIndex].warna}">
					<p class="text-xs font-medium uppercase tracking-wide opacity-80">{banners[currentIndex].judul}</p>
					<p class="text-lg font-semibold">{banners[currentIndex].keterangan}</p>
				</div>
			{/key}

			<!-- Dots indikator (bisa diklik langsung loncat ke banner tertentu) -->
			<div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
				{#each banners as banner, i (banner.judul)}
					<button onclick={() => currentIndex = i} type="button"
						aria-label={`Pilih banner ${banner.judul}`}
						class="h-1.5 rounded-full transition-all {i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}">
					</button>
				{/each}
			</div>

			<!-- Tombol panah kiri (mundur manual) -->
			<button onclick={prev} type="button" aria-label="Previous banner"
				class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 flex items-center justify-center z-10">
				‹
			</button>

			<!-- Tombol panah kanan (maju manual) -->
			<button onclick={next} type="button" aria-label="Next banner"
				class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 flex items-center justify-center z-10">
				›
			</button>

		</div>

		<!-- Statistics Card -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

			<!-- Kartu: Riwayat belajar -->
			<div class="bg-white rounded-xl shadow-sm p-4">
				<p class="text-2xl font-bold text-slate-800">18 sesi</p>
				<p class="text-sm text-slate-500">Riwayat belajar</p>
			</div>

			<!-- Kartu: Akurasi -->
			<div class="bg-white rounded-xl shadow-sm p-4">
				<p class="text-2xl font-bold text-slate-800">76%</p>
				<p class="text-sm text-slate-500">Akurasi</p>
			</div>

			<!-- Kartu: Soal dikerjakan -->
			<div class="bg-white rounded-xl shadow-sm p-4">
				<p class="text-2xl font-bold text-slate-800">340</p>
				<p class="text-sm text-slate-500">Soal dikerjakan</p>
			</div>

		</div>

		<!-- Fresh Materials Cards -->
		<div class="mb-10">

			<!-- Judul section + tombol lihat semua -->
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-bold text-slate-800">Materi Fresh</h2>
				<button type="button" class="text-primary-600 hover:text-primary-700">
					<ChevronRight size={20} />
				</button>
			</div>

			<div class="flex gap-3 sm:gap-4 overflow-x-auto pb-3 w-full max-w-full">

				<!-- Poster utama (gradient cyan) + lingkaran dekoratif -->
				<div class="relative shrink-0 w-40 h-40 bg-linear-to-br from-accent to-cyan-400 rounded-xl p-4 text-white flex flex-col justify-end overflow-visible">
					<div class="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/20 blur-sm"></div>
					<div class="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-white/20"></div>
					<p class="relative z-10 text-xs opacity-80">Kumpulan</p>
					<p class="relative z-10 font-bold leading-snug">Materi UTBK 2026</p>
				</div>

				<!-- Kartu topik: Matematika -->
				<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-cyan-100">
					<div class="bg-cyan-50 rounded-lg h-24 mb-3"></div>
					<p class="text-xs text-slate-400 mb-0.5">Matematika</p>
					<p class="text-sm font-medium text-slate-800 leading-snug">Fungsi Kuadrat Lanjutan</p>
				</div>

				<!-- Kartu topik: Bahasa Indonesia -->
				<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-cyan-100">
					<div class="bg-cyan-50 rounded-lg h-24 mb-3"></div>
					<p class="text-xs text-slate-400 mb-0.5">Bahasa Indonesia</p>
					<p class="text-sm font-medium text-slate-800 leading-snug">Literasi Lanjutan</p>
				</div>

				<!-- Kartu topik: Fisika -->
				<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-cyan-100">
					<div class="bg-cyan-50 rounded-lg h-24 mb-3"></div>
					<p class="text-xs text-slate-400 mb-0.5">Fisika</p>
					<p class="text-sm font-medium text-slate-800 leading-snug">Gerak Parabola</p>
				</div>

			</div>
		</div>

		<!-- fresh latihan soal card-->
		<div class="mb-10 lg:mb-0">

			<!-- Judul section + tombol lihat semua -->
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-bold text-slate-800">Paket Latihan Soal</h2>
				<button type="button" class="text-primary-600 hover:text-primary-700">
					<ChevronRight size={20} />
				</button>
			</div>

			<div class="flex gap-3 sm:gap-4 overflow-x-auto pb-3 w-full max-w-full">

				<!-- Poster utama (gradient emerald) + lingkaran dekoratif -->
				<div class="relative shrink-0 w-40 h-40 bg-linear-to-br from-emerald-700 to-emerald-500 rounded-xl p-4 text-white flex flex-col justify-end overflow-visible">
					<div class="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/20 blur-sm"></div>
					<div class="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-white/20"></div>
					<p class="relative z-10 text-xs opacity-80">Simulasi</p>
					<p class="relative z-10 font-bold leading-snug">UTBK 2026</p>
				</div>

				<!-- Kartu paket: Penalaran Matematika -->
				<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-emerald-100">
					<div class="bg-emerald-50 rounded-lg h-24 mb-3"></div>
					<p class="text-xs text-slate-400 mb-0.5">Penalaran Matematika</p>
					<p class="text-sm font-medium text-slate-800 leading-snug">20 Soal</p>
				</div>

				<!-- Kartu paket: Literasi B. Indonesia -->
				<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-emerald-100">
					<div class="bg-emerald-50 rounded-lg h-24 mb-3"></div>
					<p class="text-xs text-slate-400 mb-0.5">Literasi B. Indonesia</p>
					<p class="text-sm font-medium text-slate-800 leading-snug">15 Soal</p>
				</div>

				<!-- Kartu paket: Penalaran Umum -->
				<div class="shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 border-2 border-emerald-100">
					<div class="bg-emerald-50 rounded-lg h-24 mb-3"></div>
					<p class="text-xs text-slate-400 mb-0.5">Penalaran Umum</p>
					<p class="text-sm font-medium text-slate-800 leading-snug">20 Soal</p>
				</div>

			</div>
		</div>

	</div>

	<div class="lg:col-span-1">

		<!-- Kalender -->
		<div class="bg-white rounded-xl shadow-sm p-5 mb-6">

			<!-- Header: nama bulan + tombol navigasi bulan (belum berfungsi, masih statis) -->
			<div class="flex items-center justify-between mb-4">
				<p class="font-bold text-slate-800">{namaBulan}</p>
				<div class="flex gap-1">
					<button type="button" class="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">‹</button>
					<button type="button" class="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">›</button>
				</div>
			</div>

			<!-- Baris label hari (Min, Sen, Sel, dst) -->
			<div class="grid grid-cols-7 text-center text-xs text-slate-400 mb-2">
				{#each namaHari as hari (hari)}
					<span>{hari}</span>
				{/each}
			</div>

			<!-- Grid tanggal: kotak kosong (offset) + angka 1-31 -->
			<div class="grid grid-cols-7 gap-y-2 text-center text-sm">
				{#each tanggalGrid as tgl, i (i)}
					{#if tgl === null}
						<span></span>
					{:else}
						<div class="flex flex-col items-center gap-0.5">
							<!-- Lingkaran tanggal, biru solid kalau ini "hari ini" -->
							<span class="h-7 w-7 flex items-center justify-center rounded-full {tgl === tanggalPenting ? 'bg-primary-600 text-white font-semibold' : 'text-slate-700'}">
								{tgl}
							</span>
							<!-- Titik kecil penanda kalau tanggal ini ada di daftar jadwal -->
							{#if jadwal.some(j => j.tanggal === tgl)}
								<span class="h-1 w-1 rounded-full {jadwal.find(j => j.tanggal === tgl)?.warna}"></span>
							{/if}
						</div>
					{/if}
				{/each}
			</div>

		</div>

		<!-- Jadwal Penting -->
		<div class="bg-white rounded-xl shadow-sm p-5">
			<p class="font-bold text-slate-800 mb-4">Jadwal Penting</p>
			<div class="flex flex-col gap-3">
				{#each jadwal as j (j.tanggal)}
					<!-- 1 baris jadwal: titik warna + label + tanggal -->
					<div class="flex items-center gap-3">
						<span class="h-2 w-2 rounded-full {j.warna} shrink-0"></span>
						<p class="text-sm text-slate-600">{j.label}</p>
						<p class="text-xs text-slate-400 ml-auto">Juli {j.tanggal}</p>
					</div>
				{/each}
			</div>
		</div>

	</div>

</div>