<script lang="ts">
	import { Bookmark, BookOpen } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { learningMaterials, type LearningMaterial } from '$lib/mocks/learning';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	const mapelOptions = [
		'Semua',
		'Matematika',
		'Fisika',
		'Kimia',
		'Biologi',
		'B.Indonesia',
		'B.Inggris',
		'Penalaran'
	];

	const sortOptions = [
		{ id: 'terbaru', label: 'Terbaru' },
		{ id: 'terlama', label: 'Terlama' },
		{ id: 'az', label: 'Abjad (A - Z)' },
		{ id: 'za', label: 'Abjad (Z - A)' },
		{ id: 'populer', label: 'Paling Populer' }
	];

	let searchQuery = $state('');
	let selectedMapel = $state('Semua');
	let selectedSort = $state('terbaru');
	let isSortDropdownOpen = $state(false);

	let listMateri = $state<LearningMaterial[]>(learningMaterials);

	let filteredMateri = $derived(
		listMateri
			.filter((item) => {
				const matchQuery =
					searchQuery.trim() === '' ||
					item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.mapel.toLowerCase().includes(searchQuery.toLowerCase());

				const matchMapel = selectedMapel === 'Semua' || item.mapel === selectedMapel;

				return matchQuery && matchMapel;
			})
			.sort((a, b) => {
				if (selectedSort === 'terbaru') {
					return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
				} else if (selectedSort === 'terlama') {
					return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
				} else if (selectedSort === 'az') {
					return a.judul.localeCompare(b.judul);
				} else if (selectedSort === 'za') {
					return b.judul.localeCompare(a.judul);
				} else if (selectedSort === 'populer') {
					return b.dibaca - a.dibaca;
				}
				return 0;
			})
	);

	function toggleBookmark(id: number) {
		listMateri = listMateri.map((m) => (m.id === id ? { ...m, isBookmark: !m.isBookmark } : m));
	}

	function resetFilters() {
		searchQuery = '';
		selectedMapel = 'Semua';
		selectedSort = 'terbaru';
	}
</script>

<div class="box-border w-full max-w-full min-w-0">
	<FilterBar
		searchPlaceholder="Cari materi, topik, atau rumus..."
		filterOptions={mapelOptions}
		bind:selectedFilter={selectedMapel}
		{sortOptions}
		bind:selectedSort
		bind:searchQuery
		bind:isSortDropdownOpen
		onReset={resetFilters}
	/>

	{#if filteredMateri.length > 0}
		<div class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredMateri as item (item.id)}
				<a
					href={resolve('/learning/[id]', { id: String(item.id) })}
					class="group hover:border-primary-300 relative flex cursor-pointer flex-col rounded-xl border-2 border-slate-100 bg-white p-3 no-underline shadow-sm transition-all hover:shadow-md"
				>
					<div
						class="mb-3 h-28 w-full rounded-lg sm:h-32 {item.badgeWarna} flex items-center justify-center"
					>
						<BookOpen size={28} class="opacity-40" />
					</div>

					<p class="mb-1 line-clamp-1 text-xs font-medium text-slate-400">{item.mapel}</p>
					<p class="line-clamp-2 text-sm leading-snug font-medium text-slate-800 sm:text-base">
						{item.judul}
					</p>

					<div class="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500">
						<span></span>
						<span
							class="font-semibold text-primary-700 transition-transform group-hover:translate-x-0.5"
						>
							Detail &rarr;
						</span>
					</div>
					<button
						type="button"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							toggleBookmark(item.id);
						}}
						aria-label="Simpan bookmark"
						class="absolute top-5 right-5 z-10 rounded-lg bg-white/80 p-1.5 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-slate-600"
					>
						<Bookmark size={16} class={item.isBookmark ? 'fill-amber-400 text-amber-500' : ''} />
					</button>
				</a>
			{/each}
		</div>
	{:else}
		<EmptyState
			icon={BookOpen}
			title="Materi Tidak Ditemukan"
			description="Tidak ada materi yang sesuai dengan kata kunci atau filter yang Anda pilih."
			onReset={resetFilters}
		/>
	{/if}
</div>
