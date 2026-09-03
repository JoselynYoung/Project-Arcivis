<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import {
		banners,
		schedules,
		statistics,
		recentLearningCards,
		recentPracticeCards,
		learningPoster,
		practicePoster,
		user,
		calendar
	} from '$lib/mocks/home';

	let userName = user.name;

	// Calendar (static July 2026, data moved to mock file)
	let namaBulan = calendar.monthLabel;
	let namaHari = calendar.dayNames;
	let offsetAwal = calendar.leadingOffset;
	let jumlahHari = calendar.daysInMonth;
	let tanggalGrid = [
		...Array(offsetAwal).fill(null),
		...Array(jumlahHari)
			.fill(0)
			.map((_, i) => i + 1)
	];
	let tanggalPenting = calendar.importantDate;

	// Carousel
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
</script>

<div class="mb-8 flex flex-col gap-2">
	<h1 class="text-3xl leading-snug font-bold text-slate-800">
		Halo, {userName}! 👋<br />
		Mau <span class="text-primary-600">belajar</span> apa hari ini?
	</h1>
	<p class="text-sm text-slate-500">
		Investasikan waktumu, ambil langkah pertama menuju PTN impianmu.
	</p>
</div>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
	<div class="lg:col-span-2">
		<!-- Banner Carousel -->
		<div class="relative mb-10 h-48 w-full overflow-hidden rounded-2xl">
			{#key currentIndex}
				<div
					transition:fade={{ duration: 400 }}
					class="absolute inset-0 flex flex-col justify-end p-6 text-white {banners[currentIndex]
						.warna}"
					aria-live="polite"
				>
					<p class="text-xs font-medium tracking-wide uppercase opacity-80">
						{banners[currentIndex].judul}
					</p>
					<p class="text-lg font-semibold">{banners[currentIndex].keterangan}</p>
				</div>
			{/key}

			<div class="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
				{#each banners as banner, i (banner.judul)}
					<button
						onclick={() => (currentIndex = i)}
						type="button"
						aria-label={`Pilih banner ${banner.judul}`}
						class="h-1.5 rounded-full transition-all {i === currentIndex
							? 'w-4 bg-white'
							: 'w-1.5 bg-white/50'}"
					></button>
				{/each}
			</div>

			<button
				onclick={prev}
				type="button"
				aria-label="Previous banner"
				class="absolute top-1/2 left-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
			>
				‹
			</button>

			<button
				onclick={next}
				type="button"
				aria-label="Next banner"
				class="absolute top-1/2 right-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
			>
				›
			</button>
		</div>

		<!-- Statistics -->
		<div class="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each statistics as stat (stat.label)}
				<div class="rounded-xl bg-white p-4 shadow-sm">
					<p class="text-2xl font-bold text-slate-800">{stat.value}</p>
					<p class="text-sm text-slate-500">{stat.label}</p>
				</div>
			{/each}
		</div>

		<!-- Fresh Materials -->
		<div class="mb-10">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-bold text-slate-800">Materi Fresh</h2>
				<button
					type="button"
					class="text-primary-600 hover:text-primary-700"
					aria-label="Lihat semua materi"
				>
					<ChevronRight size={20} />
				</button>
			</div>

			<div class="flex w-full max-w-full gap-3 overflow-x-auto pb-3 sm:gap-4">
				<!-- Poster (non-repeated, but data extracted) -->
				<div
					class="relative h-40 w-40 shrink-0 bg-linear-to-br {learningPoster.colorFrom} {learningPoster.colorTo} flex flex-col justify-end overflow-visible rounded-xl p-4 text-white"
				>
					<div class="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/20 blur-sm"></div>
					<div class="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-white/20"></div>
					<p class="relative z-10 text-xs opacity-80">{learningPoster.label}</p>
					<p class="relative z-10 leading-snug font-bold">{learningPoster.title}</p>
				</div>

				{#each recentLearningCards as card (card.subject)}
					<div class="w-40 shrink-0 rounded-xl border-2 border-cyan-100 bg-white p-3 shadow-sm">
						<div class="mb-3 h-24 rounded-lg bg-cyan-50"></div>
						<p class="mb-0.5 text-xs text-slate-400">{card.subject}</p>
						<p class="text-sm leading-snug font-medium text-slate-800">{card.title}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Practice Packages -->
		<div class="mb-10 lg:mb-0">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-bold text-slate-800">Paket Latihan Soal</h2>
				<button
					type="button"
					class="text-primary-600 hover:text-primary-700"
					aria-label="Lihat semua latihan soal"
				>
					<ChevronRight size={20} />
				</button>
			</div>

			<div class="flex w-full max-w-full gap-3 overflow-x-auto pb-3 sm:gap-4">
				<div
					class="relative h-40 w-40 shrink-0 bg-linear-to-br {practicePoster.colorFrom} {practicePoster.colorTo} flex flex-col justify-end overflow-visible rounded-xl p-4 text-white"
				>
					<div class="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/20 blur-sm"></div>
					<div class="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-white/20"></div>
					<p class="relative z-10 text-xs opacity-80">{practicePoster.label}</p>
					<p class="relative z-10 leading-snug font-bold">{practicePoster.title}</p>
				</div>

				{#each recentPracticeCards as card (card.subject)}
					<div class="w-40 shrink-0 rounded-xl border-2 border-emerald-100 bg-white p-3 shadow-sm">
						<div class="mb-3 h-24 rounded-lg bg-emerald-50"></div>
						<p class="mb-0.5 text-xs text-slate-400">{card.subject}</p>
						<p class="text-sm leading-snug font-medium text-slate-800">{card.title}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Sidebar -->
	<div class="lg:col-span-1">
		<!-- Calendar -->
		<div class="mb-6 rounded-xl bg-white p-5 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<p class="font-bold text-slate-800">{namaBulan}</p>
				<div class="flex gap-1">
					<button
						type="button"
						aria-label="Bulan sebelumnya"
						class="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
						>‹</button
					>
					<button
						type="button"
						aria-label="Bulan berikutnya"
						class="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
						>›</button
					>
				</div>
			</div>

			<div class="mb-2 grid grid-cols-7 text-center text-xs text-slate-400">
				{#each namaHari as hari (hari)}
					<span>{hari}</span>
				{/each}
			</div>

			<div class="grid grid-cols-7 gap-y-2 text-center text-sm">
				{#each tanggalGrid as tgl, i (i)}
					{#if tgl === null}
						<span></span>
					{:else}
						<div class="flex flex-col items-center gap-0.5">
							<span
								class="flex h-7 w-7 items-center justify-center rounded-full {tgl === tanggalPenting
									? 'bg-primary-600 font-semibold text-white'
									: 'text-slate-700'}"
							>
								{tgl}
							</span>
							{#if schedules.some((j) => j.tanggal === tgl)}
								<span class="h-1 w-1 rounded-full {schedules.find((j) => j.tanggal === tgl)?.warna}"
								></span>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Important Dates -->
		<div class="rounded-xl bg-white p-5 shadow-sm">
			<p class="mb-4 font-bold text-slate-800">Jadwal Penting</p>
			<div class="flex flex-col gap-3" role="list">
				{#each schedules as j (j.tanggal)}
					<div class="flex items-center gap-3" role="listitem">
						<span class="h-2 w-2 rounded-full {j.warna} shrink-0"></span>
						<p class="text-sm text-slate-600">{j.label}</p>
						<p class="ml-auto text-xs text-slate-400">Juli {j.tanggal}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
