<script lang="ts">
	import { untrack } from 'svelte';
	import { resolve } from '$app/paths';
	import { Bookmark, BookOpen, Zap, ChevronRight } from '@lucide/svelte';
	import { ROUTES } from '$lib/constants/routes';
	import type { PracticePackage } from '$lib/services/practice';
	import { getBookmarkIds, toggleBookmark as toggleBookmarkRequest } from '$lib/services/bookmarks';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import type { PageData } from './$types';
	import AuthNotice from '$lib/components/AuthNotice.svelte';

	let { data }: { data: PageData } = $props();
	const subjects = $derived(data.subjects ?? []);

	let searchQuery = $state('');
	let selectedSubject = $state('Semua');
	let selectedSort = $state('terbaru');
	let isSortDropdownOpen = $state(false);
	let activeTab = $state<'paket' | 'buat'>('paket');
	let authNotice = $state(false);

	const sortOptions = [
		{ id: 'terbaru', label: 'Terbaru' },
		{ id: 'az', label: 'Abjad A-Z' },
		{ id: 'za', label: 'Abjad Z-A' },
		{ id: 'terbanyak', label: 'Paling Banyak Soal' }
	];

	const subjectFilterOptions = $derived(['Semua', ...subjects.map((s) => s.name)]);

	let listPackages = $state<PracticePackage[]>(untrack(() => data.packages ?? []));

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
						return 0;
				}
			})
	);

	function getSubjectColor(subjectName: string): string {
		return subjects.find((s) => s.name === subjectName)?.color ?? 'bg-slate-50 text-slate-700';
	}

	$effect(() => {
		let cancelled = false;
		getBookmarkIds().then(({ data: ids, error }) => {
			if (error) console.error('Failed to load bookmarks:', error);
			if (cancelled || ids.size === 0) return;
			listPackages = listPackages.map((pkg) =>
				ids.has(pkg.id) ? { ...pkg, isBookmark: true } : pkg
			);
		});
		return () => {
			cancelled = true;
		};
	});

	async function toggleBookmark(id: string) {
		const { saved, signedIn, error } = await toggleBookmarkRequest(id);

		if (error) {
			console.error('Failed to toggle bookmark:', error);
			if (!signedIn) authNotice = true;
			return;
		}

		listPackages = listPackages.map((pkg) => (pkg.id === id ? { ...pkg, isBookmark: saved } : pkg));
	}

	function resetFilters() {
		searchQuery = '';
		selectedSubject = 'Semua';
		selectedSort = 'terbaru';
	}
</script>

<div class="box-border w-full max-w-full min-w-0">
	<div class="mb-6 flex border-b border-slate-200" role="tablist" aria-label="Jenis latihan">
		<button
			type="button"
			role="tab"
			aria-selected={activeTab === 'paket'}
			onclick={() => (activeTab = 'paket')}
			class="flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors {activeTab ===
			'paket'
				? 'border-primary-600 text-primary-700'
				: 'border-transparent text-slate-400 hover:text-slate-600'}"
		>
			<BookOpen size={15} /> Paket Soal
		</button>
		<button
			type="button"
			role="tab"
			aria-selected={activeTab === 'buat'}
			onclick={() => (activeTab = 'buat')}
			class="flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors {activeTab ===
			'buat'
				? 'border-primary-600 text-primary-700'
				: 'border-transparent text-slate-400 hover:text-slate-600'}"
		>
			<Zap size={15} /> Lab Soal
		</button>
	</div>

	{#if activeTab === 'buat'}
		<div
			class="mb-8 rounded-2xl border-2 border-primary-100 bg-linear-to-br from-primary-50 to-white p-5 shadow-sm sm:mb-10 sm:p-6"
		>
			<div class="flex items-start gap-4">
				<div
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm sm:h-14 sm:w-14"
					aria-hidden="true"
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
					<p class="mb-4 text-sm leading-relaxed text-slate-500">
						Buat sesi latihan sesuai keinginanmu. Pilih mapel, topik, tingkat kesulitan, dan jumlah
						soal.
					</p>
					<div class="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
						<span class="flex items-center gap-1">
							<span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
							{subjects.length} Mapel
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
					<a
						href={resolve(ROUTES.practiceQuizGenerator)}
						class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-700"
					>
						Buka Generator <ChevronRight size={16} />
					</a>
				</div>
			</div>
		</div>
	{:else}
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
		{#if authNotice}
			<AuthNotice />
		{/if}

		{#if filteredPackages.length > 0}
			<div class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
				{#each filteredPackages as pkg (pkg.id)}
					<div
						class="group hover:border-primary-300 relative flex flex-col rounded-xl border-2 border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md"
					>
						<a
							href={resolve('/practice/[id]', { id: String(pkg.id) })}
							aria-label="{pkg.title}, {pkg.subject}"
							class="flex flex-1 cursor-pointer flex-col no-underline"
						>
							<div
								class="mb-3 h-28 w-full rounded-lg sm:h-32 {getSubjectColor(
									pkg.subject
								)} flex items-center justify-center"
							>
								<BookOpen size={28} class="opacity-40" />
							</div>

							<p class="mb-1 text-xs font-medium text-slate-400">{pkg.subject}</p>
							<p class="line-clamp-2 text-sm leading-snug font-medium text-slate-800 sm:text-base">
								{pkg.title}
							</p>

							<div class="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500">
								<span>{pkg.questionCount} Soal</span>
								<span
									class="font-semibold text-primary-700 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
								>
									Detail &rarr;
								</span>
							</div>
						</a>

						<button
							type="button"
							onclick={() => toggleBookmark(pkg.id)}
							aria-label={pkg.isBookmark ? 'Hapus bookmark' : 'Simpan bookmark'}
							class="absolute top-5 right-5 z-10 rounded-lg bg-white/80 p-1.5 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-slate-600"
						>
							<Bookmark size={16} class={pkg.isBookmark ? 'fill-amber-400 text-amber-500' : ''} />
						</button>
					</div>
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
	{/if}
</div>
