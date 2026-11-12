<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { BookOpen, PenLine, Plus, X, CircleHelp, FileText, Layers } from '@lucide/svelte';
	import AuthNotice from '#lib/components/AuthNotice.svelte';
	import EmptyState from '#lib/components/EmptyState.svelte';
	import FilterBar from '#lib/components/FilterBar.svelte';
	import { getMyContributions, type MyContribution } from '#lib/services/contributions';
	import { getMyBankQuestions, type BankQuestion } from '#lib/services/bank';
	import { getMyRole, CONTRIBUTOR_ROLES } from '#lib/services/profile';
	import { supabase } from '#lib/services/supabaseClient';

	type TabId = 'soal' | 'article' | 'materi';

	let signedIn = $state<boolean | null>(null);
	let role = $state<string | null>(null);
	const canContribute = $derived(role !== null && CONTRIBUTOR_ROLES.includes(role));

	let questions = $state<BankQuestion[]>([]);
	let mine = $state<MyContribution[]>([]);
	let loadError = $state<string | null>(null);

	let activeTab = $state<TabId>('soal');
	let query = $state('');
	let selectedSort = $state('terbaru');
	let isSortDropdownOpen = $state(false);
	let statusFilter = $state('Semua');
	let composerOpen = $state(false);

	const tabMeta: Record<TabId, { label: string; placeholder: string }> = {
		soal: { label: 'Bank soal', placeholder: 'Cari soal, topik, atau materi...' },
		article: { label: 'Article', placeholder: 'Cari artikel atau topik...' },
		materi: { label: 'Materi', placeholder: 'Cari materi atau topik...' }
	};

	const filterOptions = ['Semua', 'Draft', 'Menunggu persetujuan', 'Perlu revisi', 'Ditolak'];

	const sortOptions = [
		{ id: 'terbaru', label: 'Terbaru' },
		{ id: 'terlama', label: 'Terlama' }
	];

	const newestFirst = $derived(selectedSort !== 'terlama');

	function sortByDate<T>(list: T[], getDate: (item: T) => string): T[] {
		return [...list].sort((a, b) =>
			newestFirst ? getDate(b).localeCompare(getDate(a)) : getDate(a).localeCompare(getDate(b))
		);
	}

	const bankVisible = $derived(
		sortByDate(
			questions.filter(
				(question) =>
					question.status !== 'diverifikasi' &&
					(statusFilter === 'Semua' || bankStatusLabel(question.status) === statusFilter) &&
					(query.trim() === '' ||
						`${question.text} ${question.topic} ${question.subject}`
							.toLowerCase()
							.includes(query.trim().toLowerCase()))
			),
			(question) => question.createdAt
		)
	);

	const myArticles = $derived(
		sortByDate(
			mine.filter(
				(item) =>
					item.type === 'article' &&
					item.status !== 'diverifikasi' &&
					(statusFilter === 'Semua' || statusLabel(item.status) === statusFilter) &&
					(query.trim() === '' || item.title.toLowerCase().includes(query.trim().toLowerCase()))
			),
			(item) => item.updatedAt
		)
	);

	const myMateri = $derived(
		sortByDate(
			mine.filter(
				(item) =>
					item.type === 'learning' &&
					item.status !== 'diverifikasi' &&
					(statusFilter === 'Semua' || statusLabel(item.status) === statusFilter) &&
					(query.trim() === '' || item.title.toLowerCase().includes(query.trim().toLowerCase()))
			),
			(item) => item.updatedAt
		)
	);

	function statusLabel(status: MyContribution['status']): string {
		if (status === 'direview') return 'Menunggu persetujuan';
		if (status === 'revisi') return 'Perlu revisi';
		if (status === 'ditolak') return 'Ditolak';
		return 'Draft';
	}

	function bankStatusLabel(status: string): string {
		if (status === 'direview') return 'Menunggu persetujuan';
		if (status === 'revisi') return 'Perlu revisi';
		if (status === 'ditolak') return 'Ditolak';
		return 'Draft';
	}

	function statusClass(status: MyContribution['status']): string {
		if (status === 'direview') return 'bg-amber-50 text-amber-700';
		if (status === 'revisi') return 'bg-orange-50 text-orange-700';
		if (status === 'ditolak') return 'bg-red-50 text-red-700';
		return 'bg-slate-100 text-slate-500';
	}

	$effect(() => {
		supabase.auth.getSession().then(async ({ data }) => {
			signedIn = !!data.session;
			if (data.session) {
				role = await getMyRole();
				const mineResult = await getMyContributions();
				if (!mineResult.error) mine = mineResult.data;
			}
		});
		getMyBankQuestions().then(({ data, error }) => {
			if (error) loadError = error;
			else questions = data;
		});
	});

	function openComposer(kind: 'soal' | 'article' | 'materi') {
		composerOpen = false;
		if (kind === 'soal') {
			goto(resolve('/contribute/buat?kind=soal'));
		} else {
			goto(
				resolve(`/contribute/buat?kind=tulisan&type=${kind === 'materi' ? 'learning' : 'article'}`)
			);
		}
	}

	function handleFilterChange(value: string) {
		statusFilter = value;
	}

	function resetFilters() {
		query = '';
		selectedSort = 'terbaru';
		isSortDropdownOpen = false;
		handleFilterChange('Semua');
	}
</script>

<div class="mx-auto w-full max-w-5xl pb-24">
	{#if signedIn === null}
		<p class="py-8 text-sm text-slate-500">Memuat...</p>
	{:else if !signedIn}
		<div class="py-8">
			<AuthNotice message="Masuk untuk berkontribusi." />
		</div>
	{:else}
		<div class="mb-5 flex items-start gap-2 sm:gap-3">
			<div class="min-w-0 flex-1 [&>div]:mb-0">
				{#key activeTab}
					<FilterBar
						searchPlaceholder={tabMeta[activeTab].placeholder}
						filterLabel="Status"
						{filterOptions}
						bind:selectedFilter={statusFilter}
						{sortOptions}
						bind:selectedSort
						bind:searchQuery={query}
						bind:isSortDropdownOpen
						onFilterChange={handleFilterChange}
						onReset={resetFilters}
						showActiveFilters={false}
					/>
				{/key}
			</div>
			<button
				type="button"
				onclick={() => (composerOpen = true)}
				class="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-600 px-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-primary-700 sm:px-4"
			>
				<Plus size={17} /><span class="hidden sm:inline">Buat kontribusi</span><span
					class="sm:hidden">Buat</span
				>
			</button>
		</div>

		{#if !canContribute && signedIn}
			<div class="mb-5">
				<EmptyState
					icon={PenLine}
					title="Khusus Kontributor"
					description="Menulis dibuka untuk peran Kontributor ke atas. Hubungi admin untuk upgrade."
				/>
			</div>
		{/if}

		<section
			aria-label="Daftar kontribusi"
			class="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm"
		>
			<div class="flex flex-col border-b border-slate-100 px-3 pt-3 sm:px-4">
				<div class="flex gap-0.5 overflow-x-auto" role="tablist" aria-label="Jenis kontribusi">
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === 'soal'}
						onclick={() => (activeTab = 'soal')}
						class="inline-flex shrink-0 items-center gap-1.5 rounded-t-lg border-b-2 px-2.5 py-2.5 text-[11px] font-semibold transition sm:gap-2 sm:px-3 sm:text-[13px] {activeTab ===
						'soal'
							? 'border-primary-600 text-slate-800'
							: 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'}"
					>
						<CircleHelp size={14} class="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />Bank soal
						<span
							class="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
							>{bankVisible.length}</span
						>
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === 'article'}
						onclick={() => (activeTab = 'article')}
						class="inline-flex shrink-0 items-center gap-1.5 rounded-t-lg border-b-2 px-2.5 py-2.5 text-[11px] font-semibold transition sm:gap-2 sm:px-3 sm:text-[13px] {activeTab ===
						'article'
							? 'border-primary-600 text-slate-800'
							: 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'}"
					>
						<FileText size={14} class="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />Article
						<span
							class="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
							>{myArticles.length}</span
						>
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === 'materi'}
						onclick={() => (activeTab = 'materi')}
						class="inline-flex shrink-0 items-center gap-1.5 rounded-t-lg border-b-2 px-2.5 py-2.5 text-[11px] font-semibold transition sm:gap-2 sm:px-3 sm:text-[13px] {activeTab ===
						'materi'
							? 'border-primary-600 text-slate-800'
							: 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'}"
					>
						<Layers size={14} class="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />Materi
						<span
							class="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
							>{myMateri.length}</span
						>
					</button>
				</div>
			</div>

			<div class="p-3 sm:p-4">
				{#if activeTab === 'soal'}
					{#if loadError}
						<EmptyState icon={BookOpen} title="Bank Tidak Dapat Dimuat" description={loadError} />
					{:else if bankVisible.length === 0}
						<p
							class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500"
						>
							Belum ada kiriman yang direview.
						</p>
					{:else}
						<div class="flex flex-col gap-3">
							{#each bankVisible as question (question.id)}
								<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
									<div class="mb-1 flex items-center gap-2 text-xs">
										<span class="font-medium text-slate-400">{question.subject}</span>
										{#if question.topic}
											<span class="text-slate-400">· {question.topic}</span>
										{/if}
										<span class="ml-auto font-medium text-slate-500">{question.difficulty}</span>
									</div>
									<p class="text-sm font-medium text-slate-800">{question.text}</p>
									<p class="mt-1 text-xs text-slate-400">oleh {question.authorName}</p>
								</div>
							{/each}
						</div>
					{/if}
				{:else if activeTab === 'article'}
					{#if myArticles.length === 0}
						<p
							class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500"
						>
							Belum ada artikel yang perlu direview.
						</p>
					{:else}
						<div class="flex flex-col gap-3">
							{#each myArticles as item (item.id)}
								<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
									<div class="mb-1 flex items-center gap-2 text-xs">
										<span class="font-medium text-slate-400">{item.subject}</span>
										<span
											class="ml-auto rounded-full px-2 py-0.5 font-medium {statusClass(
												item.status
											)}"
										>
											{statusLabel(item.status)}
										</span>
									</div>
									<p class="text-sm font-medium text-slate-800">{item.title}</p>
									{#if item.tags.length > 0}
										<p class="mt-1 text-xs text-slate-400">{item.tags.join(' · ')}</p>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				{:else if activeTab === 'materi'}
					{#if myMateri.length === 0}
						<p
							class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500"
						>
							Belum ada materi yang perlu direview.
						</p>
					{:else}
						<div class="flex flex-col gap-3">
							{#each myMateri as item (item.id)}
								<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
									<div class="mb-1 flex items-center gap-2 text-xs">
										<span class="font-medium text-slate-400">{item.subject}</span>
										<span
											class="ml-auto rounded-full px-2 py-0.5 font-medium {statusClass(
												item.status
											)}"
										>
											{statusLabel(item.status)}
										</span>
									</div>
									<p class="text-sm font-medium text-slate-800">{item.title}</p>
									{#if item.tags.length > 0}
										<p class="mt-1 text-xs text-slate-400">{item.tags.join(' · ')}</p>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		</section>
	{/if}
</div>

<button
	type="button"
	onclick={() => (composerOpen = true)}
	class="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6 md:hidden"
	aria-label="Buat kontribusi baru"
>
	+
</button>

{#if composerOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={(event) => {
			if (event.target === event.currentTarget) composerOpen = false;
		}}
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="composer-title"
			class="w-full max-w-md rounded-2xl border border-white/70 bg-white p-5 shadow-xl sm:p-6"
		>
			<div class="mb-5 flex items-start justify-between">
				<div>
					<span
						class="mb-2 inline-flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600"
					>
						<PenLine size={18} />
					</span>
					<h2 id="composer-title" class="text-lg font-semibold text-slate-800">Mulai kontribusi</h2>
					<p class="mt-1 text-sm text-slate-500">Pilih yang ingin kamu bagikan ke komunitas.</p>
				</div>
				<button
					type="button"
					aria-label="Tutup"
					onclick={() => (composerOpen = false)}
					class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
				>
					<X size={18} />
				</button>
			</div>
			<div class="space-y-2">
				<button
					type="button"
					onclick={() => openComposer('soal')}
					class="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-primary-200 hover:bg-primary-50/50"
				>
					<span
						class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"
					>
						<CircleHelp size={18} />
					</span>
					<span class="flex-1">
						<span class="block text-sm font-semibold text-slate-800">Buat soal</span>
						<span class="block text-xs text-slate-500"
							>Tambah soal pilihan ganda ke bank komunitas</span
						>
					</span>
					<span class="text-slate-400 transition group-hover:translate-x-0.5">→</span>
				</button>
				<button
					type="button"
					onclick={() => openComposer('article')}
					class="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-primary-200 hover:bg-primary-50/50"
				>
					<span
						class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"
					>
						<FileText size={18} />
					</span>
					<span class="flex-1">
						<span class="block text-sm font-semibold text-slate-800">Buat articles</span>
						<span class="block text-xs text-slate-500">Tulis artikel untuk komunitas</span>
					</span>
					<span class="text-slate-400 transition group-hover:translate-x-0.5">→</span>
				</button>
				<button
					type="button"
					onclick={() => openComposer('materi')}
					class="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-primary-200 hover:bg-primary-50/50"
				>
					<span
						class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"
					>
						<Layers size={18} />
					</span>
					<span class="flex-1">
						<span class="block text-sm font-semibold text-slate-800">Buat materi</span>
						<span class="block text-xs text-slate-500">Bagikan rangkuman atau materi belajar</span>
					</span>
					<span class="text-slate-400 transition group-hover:translate-x-0.5">→</span>
				</button>
			</div>
		</div>
	</div>
{/if}
