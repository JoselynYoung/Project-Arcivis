<script lang="ts">
	import { resolve } from '$app/paths';
	import { BookOpen, Zap, ChevronRight, ShieldCheck, Users } from '@lucide/svelte';
	import { subjects, practicePackages } from '$lib/mocks/practice';
	import { ROUTES } from '$lib/constants/routes';
	import type { PracticePackage } from '$lib/types/practice';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

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

	const subjectFilterOptions = ['Semua', ...subjects.map((s) => s.name)];

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

	<FilterBar
		searchPlaceholder="Cari paket latihan atau topik..."
		filterOptions={subjectFilterOptions}
		bind:selectedFilter={selectedSubject}
		{sortOptions}
		bind:selectedSort
		bind:searchQuery
		bind:isSortDropdownOpen
		onReset={resetFilters}
	/>

	{#if filteredPackages.length > 0}
		<div class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredPackages as pkg (pkg.id)}
				<a
					href={resolve('/practice/[id]', { id: String(pkg.id) })}
					class="group hover:border-primary-300 relative flex cursor-pointer flex-col rounded-xl border-2 border-slate-100 bg-white p-3 no-underline shadow-sm transition-all hover:shadow-md"
				>
					<div
						class="mb-3 flex h-28 w-full items-center justify-center rounded-lg bg-primary-50 sm:h-32"
					>
						<BookOpen size={28} class="opacity-40" />
					</div>

					<p class="mb-1 text-xs font-medium text-slate-400">{pkg.subject}</p>
					<p class="line-clamp-2 text-sm leading-snug font-medium text-slate-800 sm:text-base">
						{pkg.title}
					</p>

					<div class="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500">
						<div class="flex items-center gap-2">
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
						<span
							class="font-semibold text-primary-700 transition-transform group-hover:translate-x-0.5"
						>
							Detail &rarr;
						</span>
					</div>
					{#if pkg.isVerified}
						<span
							class="absolute top-5 right-5 z-10 flex items-center gap-1 rounded-lg bg-white/80 px-2 py-1 text-[10px] font-semibold text-emerald-600 shadow-sm"
						>
							<ShieldCheck size={12} /> Terverifikasi
						</span>
					{/if}
				</a>
			{/each}
		</div>
	{:else}
		<EmptyState
			icon={BookOpen}
			title="Paket Tidak Ditemukan"
			description="Tidak ada paket latihan yang sesuai dengan kata kunci atau filter yang Anda pilih."
			onReset={resetFilters}
		/>
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
