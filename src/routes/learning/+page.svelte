<script lang="ts">
	import { Search, ArrowUpDown, Bookmark, BookOpen, X, Check, Filter } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { learningMaterials, type LearningMaterial } from '$lib/mocks/learning';

	let mapelOptions = [
		'Semua',
		'Matematika',
		'Fisika',
		'Kimia',
		'Biologi',
		'B.Indonesia',
		'B.Inggris',
		'Penalaran'
	];

	let sortOptions = [
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

	// Filter & Sort Logic
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
	<!-- Search & Sort Controls -->
	<div class="mb-8 space-y-4 sm:mb-10">
		<div class="flex flex-col gap-3 sm:flex-row">
			<!-- Search Input -->
			<div class="relative min-w-0 flex-1">
				<Search
					size={16}
					class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari materi, topik, atau rumus..."
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

			<!-- Sort Dropdown -->
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

		<!-- Mapel Filter Pills -->
		<div class="flex max-w-full scrollbar-none items-center gap-2 overflow-x-auto pb-1">
			<span class="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-400">
				<Filter size={14} /> Filter:
			</span>
			{#each mapelOptions as mapel (mapel)}
				<button
					type="button"
					onclick={() => (selectedMapel = mapel)}
					class="shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all {selectedMapel ===
					mapel
						? 'border-primary-600 bg-primary-600 text-white shadow-sm'
						: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
				>
					{mapel}
				</button>
			{/each}
		</div>
	</div>

	<!-- Active Filter Bar -->
	{#if searchQuery || selectedMapel !== 'Semua' || selectedSort !== 'terbaru'}
		<div
			class="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-2.5"
		>
			<div class="flex min-w-0 flex-wrap items-center gap-2 text-xs text-slate-600">
				<span class="font-medium text-slate-700">Filter Aktif:</span>
				{#if selectedMapel !== 'Semua'}
					<span
						class="rounded-md border border-primary-200 bg-white px-2.5 py-0.5 font-medium text-primary-700 shadow-sm"
					>
						Mapel: {selectedMapel}
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

	<!-- Materi Cards -->
	{#if filteredMateri.length > 0}
		<div class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredMateri as item (item.id)}
				<a
					href={resolve('/learning/[id]', { id: String(item.id) })}
					class="group hover:border-primary-300 relative flex cursor-pointer flex-col rounded-xl border-2 border-primary-100 bg-white p-3 no-underline shadow-sm transition-all hover:shadow-md"
				>
					<!-- Top colored block placeholder -->
					<div
						class="mb-3 h-28 w-full rounded-lg sm:h-32 {item.badgeWarna} flex items-center justify-center"
					>
						<BookOpen size={36} class="opacity-80" />
					</div>

					<!-- Card text content -->
					<p class="mb-1 line-clamp-1 text-xs font-medium text-slate-400">{item.mapel}</p>
					<p class="line-clamp-2 text-sm leading-snug font-medium text-slate-800 sm:text-base">
						{item.judul}
					</p>

					<div class="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500">
						<span>{item.durasi}</span>
						<span
							class="font-semibold text-primary-700 transition-transform group-hover:translate-x-0.5"
						>
							Detail &rarr;
						</span>
					</div>
					<!-- Bookmark absolute button -->
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
		<!-- Empty State -->
		<div
			class="mx-auto my-12 max-w-md rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center"
		>
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"
			>
				<BookOpen size={24} />
			</div>
			<h3 class="mb-1.5 text-base font-bold text-slate-800">Materi Tidak Ditemukan</h3>
			<p class="mb-5 text-sm text-slate-500">
				Tidak ada materi yang sesuai dengan kata kunci atau filter yang Anda pilih.
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
</div>
