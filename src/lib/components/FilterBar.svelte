<script lang="ts">
	import { Search, ArrowUpDown, Check, X, Filter } from '@lucide/svelte';

	let {
		searchPlaceholder = 'Cari...',
		filterLabel = 'Filter',
		filterOptions = [],
		selectedFilter = $bindable(''),
		sortOptions = [],
		selectedSort = $bindable(''),
		searchQuery = $bindable(''),
		isSortDropdownOpen = $bindable(false),
		onSearchChange = undefined,
		onFilterChange = undefined,
		onSortChange = undefined,
		onReset = undefined,
		activeFilterLabel = 'Filter Aktif',
		filterTagPrefix = 'Filter'
	}: {
		searchPlaceholder?: string;
		filterLabel?: string;
		filterOptions?: string[];
		selectedFilter?: string;
		sortOptions?: { id: string; label: string }[];
		selectedSort?: string;
		searchQuery?: string;
		isSortDropdownOpen?: boolean;
		onSearchChange?: (value: string) => void;
		onFilterChange?: (value: string) => void;
		onSortChange?: (value: string) => void;
		onReset?: () => void;
		activeFilterLabel?: string;
		filterTagPrefix?: string;
	} = $props();

	function handleInput(e: Event) {
		searchQuery = (e.target as HTMLInputElement).value;
		onSearchChange?.(searchQuery);
	}

	function clearSearch() {
		searchQuery = '';
		onSearchChange?.('');
	}

	function handleFilterClick(option: string) {
		selectedFilter = option;
		onFilterChange?.(option);
	}

	function handleSortSelect(id: string) {
		selectedSort = id;
		onSortChange?.(id);
		isSortDropdownOpen = false;
	}

	let hasActiveFilters = $derived(
		searchQuery.trim() !== '' ||
			(selectedFilter !== '' && selectedFilter !== filterOptions[0]) ||
			(selectedSort !== '' && selectedSort !== sortOptions[0]?.id)
	);

	let activeFilterTags = $derived.by(() => {
		const tags: { label: string; value: string }[] = [];
		if (selectedFilter && selectedFilter !== filterOptions[0]) {
			tags.push({ label: `${filterTagPrefix}: ${selectedFilter}`, value: selectedFilter });
		}
		if (searchQuery.trim() !== '') {
			tags.push({ label: `Kata kunci: "${searchQuery}"`, value: searchQuery });
		}
		if (selectedSort && selectedSort !== sortOptions[0]?.id) {
			const sortLbl = sortOptions.find((s) => s.id === selectedSort)?.label ?? selectedSort;
			tags.push({ label: `Urutan: ${sortLbl}`, value: selectedSort });
		}
		return tags;
	});
</script>

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
				value={searchQuery}
				oninput={handleInput}
				placeholder={searchPlaceholder}
				class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary-600 focus:outline-none"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={clearSearch}
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
					class="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg"
				>
					{#each sortOptions as option (option.id)}
						<button
							type="button"
							onclick={() => handleSortSelect(option.id)}
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

	<!-- Filter Pills -->
	{#if filterOptions.length > 0}
		<div class="flex max-w-full scrollbar-none items-center gap-2 overflow-x-auto pb-1">
			<span class="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-400">
				<Filter size={14} />
				{filterLabel}:
			</span>
			{#each filterOptions as option (option)}
				<button
					type="button"
					onclick={() => handleFilterClick(option)}
					class="shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all {selectedFilter ===
					option
						? 'border-primary-600 bg-primary-600 text-white shadow-sm'
						: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
				>
					{option}
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- Active Filter Bar -->
{#if hasActiveFilters}
	<div
		class="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-2.5"
	>
		<div class="flex min-w-0 flex-wrap items-center gap-2 text-xs text-slate-600">
			<span class="font-medium text-slate-700">{activeFilterLabel}:</span>
			{#each activeFilterTags as tag (tag.value)}
				<span
					class="rounded-md border border-primary-200 bg-white px-2.5 py-0.5 font-medium text-primary-700 shadow-sm"
				>
					{tag.label}
				</span>
			{/each}
		</div>
		{#if onReset}
			<button
				type="button"
				onclick={onReset}
				class="shrink-0 cursor-pointer text-xs font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
			>
				Reset Semua
			</button>
		{/if}
	</div>
{/if}
