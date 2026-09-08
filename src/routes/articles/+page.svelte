<script lang="ts">
	import { Bookmark, BookOpen } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { articles, type Article } from '$lib/mocks/articles';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	const kategoriOptions = [
		'Semua Kategori',
		'Opini',
		'Tips Belajar',
		'Berita Kampus',
		'Review Buku',
		'Karir'
	];
	const sortOptions = [
		{ id: 'terbaru', label: 'Terbaru' },
		{ id: 'terlama', label: 'Terlama' },
		{ id: 'az', label: 'Abjad A-Z' },
		{ id: 'za', label: 'Abjad Z-A' },
		{ id: 'populer', label: 'Paling Populer' }
	];

	let searchQuery = $state('');
	let selectedKategori = $state('Semua Kategori');
	let selectedSort = $state('terbaru');
	let isSortDropdownOpen = $state(false);

	let listArticles = $state<Article[]>(articles);

	const filteredArticles = $derived(
		listArticles
			.filter((a) => {
				const matchQuery =
					searchQuery.trim() === '' ||
					a.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
					a.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
				const matchKategori =
					selectedKategori === 'Semua Kategori' || a.kategori === selectedKategori;
				return matchQuery && matchKategori;
			})
			.sort((a, b) => {
				switch (selectedSort) {
					case 'terbaru':
						return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
					case 'terlama':
						return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
					case 'az':
						return a.judul.localeCompare(b.judul);
					case 'za':
						return b.judul.localeCompare(a.judul);
					case 'populer':
						return b.dibaca - a.dibaca;
					default:
						return 0;
				}
			})
	);

	function toggleBookmark(id: number) {
		listArticles = listArticles.map((a) => (a.id === id ? { ...a, isBookmark: !a.isBookmark } : a));
	}

	function resetFilters() {
		searchQuery = '';
		selectedKategori = 'Semua Kategori';
		selectedSort = 'terbaru';
	}
</script>

<div class="box-border w-full max-w-full">
	<h1 class="mb-6 text-2xl font-bold text-slate-800">Artikel</h1>

	<FilterBar
		searchPlaceholder="Cari artikel, topik, atau kategori..."
		filterOptions={kategoriOptions}
		bind:selectedFilter={selectedKategori}
		{sortOptions}
		bind:selectedSort
		bind:searchQuery
		bind:isSortDropdownOpen
		onReset={resetFilters}
	/>

	{#if filteredArticles.length > 0}
		<div class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredArticles as article (article.id)}
				<a
					href={resolve('/articles/[id]', { id: String(article.id) })}
					aria-label="{article.judul}, {article.kategori}"
					class="group hover:border-primary-300 relative flex cursor-pointer flex-col rounded-xl border-2 border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md"
				>
					<div
						class="mb-3 h-28 w-full rounded-lg sm:h-32 {article.badgeWarna} flex items-center justify-center"
					>
						<BookOpen size={28} class="opacity-40" />
					</div>

					<p class="mb-1 text-xs font-medium text-slate-400">{article.kategori}</p>
					<p class="line-clamp-2 text-sm leading-snug font-medium text-slate-800">
						{article.judul}
					</p>

					<div class="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500">
						<span>{article.author}</span>
						<span
							class="font-semibold text-primary-700 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
						>
							Detail &rarr;
						</span>
					</div>

					<button
						type="button"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							toggleBookmark(article.id);
						}}
						aria-label={article.isBookmark ? 'Hapus bookmark' : 'Simpan bookmark'}
						class="absolute top-5 right-5 z-10 rounded-lg bg-white/80 p-1.5 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-slate-600"
					>
						<Bookmark size={16} class={article.isBookmark ? 'fill-amber-400 text-amber-500' : ''} />
					</button>
				</a>
			{/each}
		</div>
	{:else}
		<EmptyState
			icon={BookOpen}
			title="Artikel Tidak Ditemukan"
			description="Tidak ada artikel yang sesuai dengan kata kunci atau filter yang Anda pilih."
			onReset={resetFilters}
		/>
	{/if}
</div>
