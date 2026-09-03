<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		Search,
		ArrowUpDown,
		Filter,
		X,
		Check,
		BookOpen,
		Zap,
		ChevronRight,
		ShieldCheck,
		Users
	} from '@lucide/svelte';
	import { subjects, practicePackages } from '$lib/mocks/practice';
	import { ROUTES } from '$lib/constants/routes';
	import type { PracticePackage } from '$lib/types/practice';

	let searchQuery = $state('');
	let selectedSubject = $state('Semua');
	let selectedSort = $state('terbaru');
	let isSortDropdownOpen = $state(false);

	const sortOptions = [
		{ id: 'terbaru', label: 'Terbaru' },
		{ id: 'az', label: 'Abjad A-Z' },
		{ id: 'za', label: 'Abjad Z-A' },
		{ id: 'terbanyak', label: 'Paling Banyak Soal' }
	];

	let listPackages = $state<PracticePackage[]>(practicePackages);

	const filteredPackages = $derived(
		listPackages
			.filter((pkg) => {
				const matchQuery =
					searchQuery.trim() === '' ||
					pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					pkg.subject.toLowerCase().includes(searchQuery.toLowerCase());
				const matchSubject = selectedSubject === 'Semua' || pkg.subject === selectedSubject;
				return matchQuery && matchSubject;
			})
			.sort((a, b) => {
				switch (selectedSort) {
					case 'az':
						return a.title.localeCompare(b.title);
					case 'za':
						return b.title.localeCompare(a.title);
					case 'terbanyak':
						return b.questionCount - a.questionCount;
					default:
						return b.id - a.id;
				}
			})
	);

	function resetFilters() {
		searchQuery = '';
		selectedSubject = 'Semua';
		selectedSort = 'terbaru';
	}
</script>

<div class="box-border w-full max-w-full min-w-0">
	<!-- Quiz Generator Feature Card -->
	<a
		href={resolve(ROUTES.practiceQuizGenerator)}
		class="group hover:border-primary-300 mb-8 block rounded-2xl border-2 border-primary-100 bg-linear-to-br from-primary-50 to-white p-5 shadow-sm transition-all hover:shadow-md sm:mb-10 sm:p-6"
	>
		<div class="flex items-start gap-4">
			<div
				class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm sm:h-14 sm:w-14"
			>
				<Zap size={24} />
			</div>
			<div class="min-w-0 flex-1">
				<div class="mb-1 flex items-center gap-2">
					<h2 class="text-base font-bold text-slate-800 sm:text-lg">Latihan Acak</h2>
					<span
						class="rounded-full bg-primary-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary-700 uppercase"
					>
						Generator
					</span>
				</div>
				<p class="mb-3 text-sm leading-relaxed text-slate-500">
					Buat sesi latihan sesuai keinginanmu. Pilih mapel, topik, tingkat kesulitan, dan jumlah
					soal.
				</p>
				<div class="flex flex-wrap items-center gap-3 text-xs text-slate-400">
					<span class="flex items-center gap-1">
						<span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
						7 Mapel
					</span>
					<span class="flex items-center gap-1">
						<span class="bg-primary-400 inline-block h-1.5 w-1.5 rounded-full"></span>
						5-30 Soal
					</span>
					<span class="flex items-center gap-1">
						<span class="inline-block h-1.5 w-1.5 rounded-full bg-amber-400"></span>
						3 Mode
					</span>
				</div>
			</div>
			<ChevronRight
				size={20}
				class="mt-1 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-600"
			/>
		</div>
	</a>

	<!-- Search & Sort Controls -->
	<div class="mb-8 space-y-4 sm:mb-10">
		<div class="flex flex-col gap-3 sm:flex-row">
			<div class="relative min-w-0 flex-1">
				<Search
					size={16}
					class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari paket latihan atau topik..."
					class="box-border w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary-600 focus:outline-none"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={() => (searchQuery = '')}
						class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
					>
						<X size={14} />
					</button>
				{/if}
			</div>

			<div class="relative shrink-0">
				<button
					type="button"
					onclick={() => (isSortDropdownOpen = !isSortDropdownOpen)}
					class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:w-auto sm:justify-start"
				>
					<ArrowUpDown size={14} class="shrink-0 text-primary-600" />
					<span class="truncate">
						{sortOptions.find((s) => s.id === selectedSort)?.label}
					</span>
				</button>

				{#if isSortDropdownOpen}
					<button
						type="button"
						tabindex="-1"
						aria-label="Tutup menu urutan"
						onclick={() => (isSortDropdownOpen = false)}
						class="fixed inset-0 z-30 cursor-default bg-transparent"
					></button>
					<div
						class="animate-in fade-in zoom-in-95 absolute right-0 z-40 mt-2 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg duration-150"
					>
						{#each sortOptions as option (option.id)}
							<button
								type="button"
								onclick={() => {
									selectedSort = option.id;
									isSortDropdownOpen = false;
								}}
								class="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors {selectedSort ===
								option.id
									? 'bg-primary-50 font-semibold text-primary-700'
									: 'text-slate-600 hover:bg-slate-50'}"
							>
								<span>{option.label}</span>
								{#if selectedSort === option.id}
									<Check size={14} class="shrink-0 text-primary-600" />
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Subject Filter Pills -->
		<div class="flex max-w-full scrollbar-none items-center gap-2 overflow-x-auto pb-1">
			<span class="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-400">
				<Filter size={14} /> Filter:
			</span>
			<button
				type="button"
				onclick={() => (selectedSubject = 'Semua')}
				class="shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all {selectedSubject ===
				'Semua'
					? 'border-primary-600 bg-primary-600 text-white shadow-sm'
					: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
			>
				Semua
			</button>
			{#each subjects as subject (subject.name)}
				<button
					type="button"
					onclick={() => (selectedSubject = subject.name)}
					class="shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all {selectedSubject ===
					subject.name
						? 'border-primary-600 bg-primary-600 text-white shadow-sm'
						: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
				>
					{subject.name}
				</button>
			{/each}
		</div>
	</div>

	<!-- Active Filter Bar -->
	{#if searchQuery || selectedSubject !== 'Semua' || selectedSort !== 'terbaru'}
		<div
			class="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-2.5"
		>
			<div class="flex min-w-0 flex-wrap items-center gap-2 text-xs text-slate-600">
				<span class="font-medium text-slate-700">Filter Aktif:</span>
				{#if selectedSubject !== 'Semua'}
					<span
						class="rounded-md border border-primary-200 bg-white px-2.5 py-0.5 font-medium text-primary-700 shadow-sm"
					>
						Mapel: {selectedSubject}
					</span>
				{/if}
				{#if searchQuery}
					<span
						class="max-w-xs truncate rounded-md border border-primary-200 bg-white px-2.5 py-0.5 font-medium text-primary-700 shadow-sm"
					>
						Kata kunci: "{searchQuery}"
					</span>
				{/if}
				{#if selectedSort !== 'terbaru'}
					<span
						class="rounded-md border border-primary-200 bg-white px-2.5 py-0.5 font-medium text-primary-700 shadow-sm"
					>
						Urutan: {sortOptions.find((s) => s.id === selectedSort)?.label}
					</span>
				{/if}
			</div>
			<button
				type="button"
				onclick={resetFilters}
				class="shrink-0 cursor-pointer text-xs font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
			>
				Reset Semua
			</button>
		</div>
	{/if}

	<!-- Package Grid -->
	{#if filteredPackages.length > 0}
		<div class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredPackages as pkg (pkg.id)}
				<a
					href={resolve('/practice/[id]', { id: String(pkg.id) })}
					class="group hover:border-primary-300 relative flex cursor-pointer flex-col rounded-xl border-2 border-primary-100 bg-white p-3 no-underline shadow-sm transition-all hover:shadow-md"
				>
					<div
						class="mb-3 flex h-28 w-full items-center justify-center rounded-lg bg-primary-50 sm:h-32"
					>
						<BookOpen size={36} class="text-primary-300" />
					</div>

					<p class="mb-1 text-xs font-medium text-slate-400">{pkg.subject}</p>
					<p class="line-clamp-2 text-sm leading-snug font-medium text-slate-800 sm:text-base">
						{pkg.title}
					</p>

					<div class="mt-auto pt-3">
						<div class="flex items-center justify-between text-xs text-slate-500">
							<span>{pkg.questionCount} Soal</span>
							<span
								class="rounded-full px-2 py-0.5 text-[10px] font-semibold {pkg.difficulty ===
								'Mudah'
									? 'bg-emerald-50 text-emerald-700'
									: pkg.difficulty === 'Sedang'
										? 'bg-amber-50 text-amber-700'
										: 'bg-red-50 text-red-700'}"
							>
								{pkg.difficulty}
							</span>
						</div>
						<div class="mt-2 flex items-center justify-between">
							<span
								class="text-xs font-semibold text-primary-700 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
							>
								Detail &rarr;
							</span>
							{#if pkg.isVerified}
								<span class="flex items-center gap-1 text-[10px] text-emerald-600">
									<ShieldCheck size={12} /> Terverifikasi
								</span>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div
			class="mx-auto my-12 max-w-md rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center"
		>
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"
			>
				<BookOpen size={24} />
			</div>
			<h3 class="mb-1.5 text-base font-bold text-slate-800">Paket Tidak Ditemukan</h3>
			<p class="mb-5 text-sm text-slate-500">
				Tidak ada paket latihan yang sesuai dengan kata kunci atau filter yang Anda pilih.
			</p>
			<button
				type="button"
				onclick={resetFilters}
				class="cursor-pointer rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
			>
				Reset Filter
			</button>
		</div>
	{/if}

	<!-- Community Section Placeholder -->
	<div class="mt-10 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center sm:mt-12">
		<div
			class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400"
		>
			<Users size={20} />
		</div>
		<h3 class="mb-1 text-sm font-bold text-slate-700">Latihan Komunitas</h3>
		<p class="text-xs text-slate-400">
			Berkontribusi dan berbagi soal latihan dengan komunitas Arcivis. Segera hadir.
		</p>
	</div>
</div>
