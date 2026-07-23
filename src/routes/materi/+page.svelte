<script lang="ts">
	import {
		Search,
		ArrowUpDown,
		Bookmark,
		BookOpen,
		X,
		Check,
		Filter
	} from '@lucide/svelte';

	interface MateriItem {
		id: number;
		judul: string;
		deskripsi: string;
		mapel: string;
		tanggal: string; // YYYY-MM-DD
		dibaca: number;
		durasi: string;
		badgeWarna: string;
		iconWarna: string;
		isBookmark?: boolean;
	}

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

	let listMateri = $state<MateriItem[]>([
		{
			id: 1,
			judul: 'Fungsi Kuadrat Lanjutan & Modifikasi Grafik',
			deskripsi: 'Memahami pergeseran grafik, titik puncak, serta analisis diskriminan pada soal UTBK.',
			mapel: 'Matematika',
			tanggal: '2026-07-20',
			dibaca: 1420,
			durasi: '8 min baca',
			badgeWarna: 'bg-primary-50 text-primary-700 border-primary-200',
			iconWarna: 'bg-primary-600 text-white',
			isBookmark: false
		},
		{
			id: 2,
			judul: 'Gerak Parabola & Hukum Kinematika 2D',
			deskripsi: 'Penurunan rumus cepat sudut elevasi, tinggi maksimum, dan jangkauan terjauh.',
			mapel: 'Fisika',
			tanggal: '2026-07-18',
			dibaca: 980,
			durasi: '12 min baca',
			badgeWarna: 'bg-cyan-50 text-cyan-700 border-cyan-200',
			iconWarna: 'bg-cyan-600 text-white',
			isBookmark: true
		},
		{
			id: 3,
			judul: 'Struktur Atom & Sistem Periodik Unsur',
			deskripsi: 'Trik menghafal konfigurasi elektron, jari-jari atom, dan energi ionisasi.',
			mapel: 'Kimia',
			tanggal: '2026-07-15',
			dibaca: 2150,
			durasi: '10 min baca',
			badgeWarna: 'bg-emerald-50 text-emerald-700 border-emerald-200',
			iconWarna: 'bg-emerald-600 text-white',
			isBookmark: false
		},
		{
			id: 4,
			judul: 'Metabolisme Sel: Respirasi Aerob & Anaerob',
			deskripsi: 'Tahapan glikolisis, siklus krebs, hingga transpor elektron dengan ilustrasi visual.',
			mapel: 'Biologi',
			tanggal: '2026-07-10',
			dibaca: 1890,
			durasi: '15 min baca',
			badgeWarna: 'bg-amber-50 text-amber-700 border-amber-200',
			iconWarna: 'bg-amber-600 text-white',
			isBookmark: false
		},
		{
			id: 5,
			judul: 'Literasi Bacaan & Identifikasi Ide Pokok',
			deskripsi: 'Teknik skimming & scanning untuk menemukan kalimat utama dalam paragraf panjang.',
			mapel: 'B.Indonesia',
			tanggal: '2026-07-22',
			dibaca: 3100,
			durasi: '6 min baca',
			badgeWarna: 'bg-rose-50 text-rose-700 border-rose-200',
			iconWarna: 'bg-rose-600 text-white',
			isBookmark: true
		},
		{
			id: 6,
			judul: 'Reading Comprehension & Inference Questions',
			deskripsi: 'Strategi menjawab soal inferensi dan vocabulary in context pada SNBT Bahasa Inggris.',
			mapel: 'B.Inggris',
			tanggal: '2026-07-12',
			dibaca: 1250,
			durasi: '9 min baca',
			badgeWarna: 'bg-indigo-50 text-indigo-700 border-indigo-200',
			iconWarna: 'bg-indigo-600 text-white',
			isBookmark: false
		},
		{
			id: 7,
			judul: 'Penalaran Analitis & Silogisme Logika',
			deskripsi: 'Langkah taktis memecahkan soal urutan tempat duduk, jadwal, dan implikasi logika.',
			mapel: 'Penalaran',
			tanggal: '2026-07-21',
			dibaca: 4500,
			durasi: '11 min baca',
			badgeWarna: 'bg-purple-50 text-purple-700 border-purple-200',
			iconWarna: 'bg-purple-600 text-white',
			isBookmark: true
		},
		{
			id: 8,
			judul: 'Turunan & Aplikasi Nilai Maksimum Minima',
			deskripsi: 'Konsep dasar diferensial untuk menghitung titik belok dan masalah optimasi.',
			mapel: 'Matematika',
			tanggal: '2026-07-05',
			dibaca: 870,
			durasi: '14 min baca',
			badgeWarna: 'bg-primary-50 text-primary-700 border-primary-200',
			iconWarna: 'bg-primary-600 text-white',
			isBookmark: false
		}
	]);

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

<!-- Wrapper to prevent any overflow -->
<div class="w-full min-w-0 max-w-full box-border">

	<!-- Search & Sort Controls -->
	<div class="mb-8 sm:mb-10 space-y-4">
		<div class="flex flex-col sm:flex-row gap-3">
			<!-- Search Input -->
			<div class="relative flex-1 min-w-0">
				<Search size={16} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari materi, topik, atau rumus..."
					class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm transition-all box-border shadow-sm"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={() => (searchQuery = '')}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
					class="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all cursor-pointer shadow-sm"
				>
					<ArrowUpDown size={14} class="text-primary-600 shrink-0" />
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
						class="fixed inset-0 z-30 bg-transparent cursor-default"
					></button>
					<div class="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-xl shadow-lg z-40 p-1.5 animate-in fade-in zoom-in-95 duration-150">
						{#each sortOptions as option (option.id)}
							<button
								type="button"
								onclick={() => {
									selectedSort = option.id;
									isSortDropdownOpen = false;
								}}
								class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg text-left transition-colors cursor-pointer {selectedSort === option.id ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}"
							>
								<span>{option.label}</span>
								{#if selectedSort === option.id}
									<Check size={14} class="text-primary-600 shrink-0" />
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Mapel Filter Pills -->
		<div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
			<span class="text-xs font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1.5">
				<Filter size={14} /> Filter:
			</span>
			{#each mapelOptions as mapel (mapel)}
				<button
					type="button"
					onclick={() => (selectedMapel = mapel)}
					class="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border {selectedMapel === mapel ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}"
				>
					{mapel}
				</button>
			{/each}
		</div>
	</div>

	<!-- Active Filter Bar -->
	{#if searchQuery || selectedMapel !== 'Semua' || selectedSort !== 'terbaru'}
		<div class="flex flex-wrap items-center justify-between gap-3 bg-primary-50/70 border border-primary-100 rounded-xl px-4 py-2.5 mb-8">
			<div class="flex flex-wrap items-center gap-2 text-xs text-slate-600 min-w-0">
				<span class="font-medium text-slate-700">Filter Aktif:</span>
				{#if selectedMapel !== 'Semua'}
					<span class="bg-white border border-primary-200 text-primary-700 px-2.5 py-0.5 rounded-md font-medium shadow-sm">
						Mapel: {selectedMapel}
					</span>
				{/if}
				{#if searchQuery}
					<span class="bg-white border border-primary-200 text-primary-700 px-2.5 py-0.5 rounded-md font-medium shadow-sm truncate max-w-xs">
						Kata kunci: "{searchQuery}"
					</span>
				{/if}
				{#if selectedSort !== 'terbaru'}
					<span class="bg-white border border-primary-200 text-primary-700 px-2.5 py-0.5 rounded-md font-medium shadow-sm">
						Urutan: {sortOptions.find((s) => s.id === selectedSort)?.label}
					</span>
				{/if}
			</div>
			<button
				type="button"
				onclick={resetFilters}
				class="text-xs text-primary-700 hover:text-primary-800 font-semibold underline underline-offset-2 cursor-pointer shrink-0"
			>
				Reset Semua
			</button>
		</div>
	{/if}

	<!-- Materi Cards -->
	{#if filteredMateri.length > 0}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
			{#each filteredMateri as item (item.id)}
				<div class="group bg-white rounded-xl shadow-sm p-3 border-2 border-primary-100 hover:border-primary-300 transition-colors cursor-pointer relative flex flex-col">
					<!-- Top colored block placeholder -->
					<div class="w-full rounded-lg h-28 sm:h-32 mb-3 {item.badgeWarna}"></div>
					
					<!-- Card text content -->
					<p class="text-xs text-slate-400 font-medium mb-1 line-clamp-1">{item.mapel}</p>
					<p class="text-sm sm:text-base font-medium text-slate-800 leading-snug line-clamp-2">{item.judul}</p>
					
					<!-- Bookmark absolute button -->
					<button
						type="button"
						onclick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
						aria-label="Simpan bookmark"
						class="absolute top-5 right-5 p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 shadow-sm transition-all"
					>
						<Bookmark size={16} class={item.isBookmark ? 'fill-amber-400 text-amber-500' : ''} />
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="bg-white border border-dashed border-slate-200 rounded-3xl p-8 text-center max-w-md mx-auto my-12">
			<div class="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
				<BookOpen size={24} />
			</div>
			<h3 class="text-base font-bold text-slate-800 mb-1.5">Materi Tidak Ditemukan</h3>
			<p class="text-sm text-slate-500 mb-5">
				Tidak ada materi yang sesuai dengan kata kunci atau filter yang Anda pilih.
			</p>
			<button
				type="button"
				onclick={resetFilters}
				class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
			>
				Reset Filter
			</button>
		</div>
	{/if}
</div>

