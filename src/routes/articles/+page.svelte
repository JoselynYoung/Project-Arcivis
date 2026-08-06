<script lang="ts">
	import { resolve } from '$app/paths';
	import { Search, ArrowUpDown, Check, BookOpen, Filter, X } from '@lucide/svelte';
	import { articles } from '$lib/mocks/articles';

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

	const filteredArticles = $derived(
		articles
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

	function resetFilters() {
		searchQuery = '';
		selectedKategori = 'Semua Kategori';
		selectedSort = 'terbaru';
	}
</script>

<div class="box-border w-full max-w-full">
	<h1 class="mb-6 text-2xl font-bold text-slate-800">Artikel</h1>

	<!-- Search & Sort -->
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
					placeholder="Cari artikel, topik, atau kategori..."
					class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary-600 focus:outline-none"
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
					class="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:w-auto sm:justify-start"
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
						class="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg"
					>
						{#each sortOptions as option (option.id)}
							<button
								type="button"
								onclick={() => {
									selectedSort = option.id;
									isSortDropdownOpen = false;
								}}
								class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors {selectedSort ===
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

		<!-- Kategori Filter Pills -->
		<div class="flex max-w-full scrollbar-none items-center gap-2 overflow-x-auto pb-1">
			<span class="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-400">
				<Filter size={14} /> Filter:
			</span>
			{#each kategoriOptions as kategori (kategori)}
				<button
					type="button"
					onclick={() => (selectedKategori = kategori)}
					class="shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all {selectedKategori ===
					kategori
						? 'border-primary-600 bg-primary-600 text-white shadow-sm'
						: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
				>
					{kategori}
				</button>
			{/each}
		</div>
	</div>

	<!-- Active Filter Bar -->
	{#if searchQuery || selectedKategori !== 'Semua Kategori' || selectedSort !== 'terbaru'}
		<div
			class="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-2.5"
		>
			<div class="flex min-w-0 flex-wrap items-center gap-2 text-xs text-slate-600">
				<span class="font-medium text-slate-700">Filter Aktif:</span>
				{#if selectedKategori !== 'Semua Kategori'}
					<span
						class="rounded-md border border-primary-200 bg-white px-2.5 py-0.5 font-medium text-primary-700 shadow-sm"
					>
						Kategori: {selectedKategori}
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

	<!-- Articles Grid -->
	{#if filteredArticles.length > 0}
		<div class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredArticles as article (article.id)}
				<a
					href={resolve('/articles/[id]', { id: String(article.id) })}
					class="group hover:border-primary-300 flex flex-col rounded-xl border-2 border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md"
					aria-label={`${article.judul}, ${article.kategori}`}
				>
					<div
						class="mb-3 h-28 w-full rounded-lg sm:h-32 {article.badgeWarna} flex items-center justify-center"
					>
						<BookOpen size={28} class="text-current opacity-40" />
					</div>
					<p class="mb-1 text-xs font-medium text-slate-400">{article.kategori}</p>
					<p class="line-clamp-2 text-sm leading-snug font-medium text-slate-800">
						{article.judul}
					</p>
					<div class="mt-auto flex items-center justify-between pt-3">
						<span class="text-xs text-slate-400">{article.author}</span>
						<span
							class="text-xs font-medium text-primary-600 opacity-0 transition-opacity group-hover:opacity-100"
						>
							Detail →
						</span>
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
			<h3 class="mb-1.5 text-base font-bold text-slate-800">Artikel Tidak Ditemukan</h3>
			<p class="mb-5 text-sm text-slate-500">
				Tidak ada artikel yang sesuai dengan kata kunci atau filter yang Anda pilih.
			</p>
			<button
				type="button"
				onclick={resetFilters}
				class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
			>
				Reset Filter
			</button>
		</div>
	{/if}
</div>