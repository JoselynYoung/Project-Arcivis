<script lang="ts">
	import { Search, ExternalLink, SlidersHorizontal, ChevronUp, BookOpenText, ChevronRight } from '@lucide/svelte';

    interface Sumber {
        id: number;
        nama: string;
        bahasa: 'ID' | 'EN';
        jalur: 'Saintek' | 'Soshum' | 'Sastra' | 'Umum';
        tag: string[];
        url: `https://${string}`;
    }

	interface TulisanPengguna {
		id: number;
		judul: string;
		penulis: string;
		tag: string;
		status: 'diverifikasi' | 'direview';
		ringkasan: string;
		warnaThumb: string;
	}

	// Opsi Filter
	let sortOptions = ['Terbaru', 'Terlama', 'Abjad (A-Z)', 'Abjad (Z-A)'];
	let bahasaOptions = ['Semua bahasa', 'Indonesia', 'English'];
	let jalurOptions = ['Semua jalur', 'Saintek', 'Soshum', 'Sastra', 'Umum'];
	let tagOptions = ['Semua tag', 'Ekonomi', 'Teknologi', 'Budaya', 'Sains', 'Politik & publik', 'Sastra & esai'];

	// State Filter
	let searchQuery = $state('');
	let selectedSort = $state('Terbaru');
	let selectedBahasa = $state('Semua bahasa');
	let selectedJalur = $state('Semua jalur');
	let selectedTag = $state('Semua tag');
	let isFilterOpen = $state(false);

	// Data Section 1: Portal Berita Pilihan Tim
	let daftarSumber: Sumber[] = [
		{ id: 1, nama: 'BBC News', bahasa: 'EN', jalur: 'Umum', tag: ['Politik & publik', 'Teknologi'], url: 'https://bbc.com' },
		{ id: 2, nama: 'National Geographic', bahasa: 'EN', jalur: 'Saintek', tag: ['Sains', 'Budaya'], url: 'https://nationalgeographic.com' },
		{ id: 3, nama: 'NASA', bahasa: 'EN', jalur: 'Saintek', tag: ['Sains', 'Teknologi'], url: 'https://nasa.gov' },
		{ id: 4, nama: 'CNN', bahasa: 'EN', jalur: 'Umum', tag: ['Politik & publik', 'Ekonomi'], url: 'https://cnn.com' },
		{ id: 5, nama: 'Antara News', bahasa: 'ID', jalur: 'Umum', tag: ['Politik & publik', 'Ekonomi', 'Budaya'], url: 'https://antaranews.com' },
		{ id: 6, nama: 'Kompas', bahasa: 'ID', jalur: 'Umum', tag: ['Politik & publik', 'Ekonomi'], url: 'https://kompas.com' },
		{ id: 7, nama: 'Narasi', bahasa: 'ID', jalur: 'Soshum', tag: ['Budaya', 'Politik & publik'], url: 'https://narasi.tv' },
		{ id: 8, nama: 'Mojok', bahasa: 'ID', jalur: 'Sastra', tag: ['Budaya', 'Sastra & esai'], url: 'https://mojok.co' }
	];

	// Data Section 2: Arsip Komunitas
	let daftarTulisan: TulisanPengguna[] = [
		{
			id: 1,
			judul: 'Mengapa Kita Sulit Fokus Belajar di Era Distraksi Digital',
			penulis: 'Rahmat W.',
			tag: 'Sains',
			status: 'diverifikasi',
			ringkasan: 'Ulasan singkat soal dopamin, notifikasi, dan cara otak kita memproses gangguan saat belajar.',
			warnaThumb: 'bg-primary-100'
		},
		{
			id: 2,
			judul: 'Inflasi dan Dompet Mahasiswa: Kenapa Semua Terasa Naik?',
			penulis: 'Sinta A.',
			tag: 'Ekonomi',
			status: 'diverifikasi',
			ringkasan: 'Penjelasan sederhana konsep inflasi memakai contoh harga jajanan kampus.',
			warnaThumb: 'bg-amber-100'
		},
		{
			id: 3,
			judul: 'Sastra Lisan Nusantara yang Mulai Dilupakan',
			penulis: 'Dimas P.',
			tag: 'Sastra & esai',
			status: 'direview',
			ringkasan: 'Catatan reflektif tentang tradisi mendongeng yang tergeser budaya digital.',
			warnaThumb: 'bg-rose-100'
		},
		{
			id: 4,
			judul: 'Krisis Iklim dari Kacamata Anak Muda Kota Kecil',
			penulis: 'Larasati N.',
			tag: 'Sains',
			status: 'diverifikasi',
			ringkasan: 'Observasi personal soal perubahan cuaca ekstrem dan dampaknya ke kehidupan sehari-hari.',
			warnaThumb: 'bg-emerald-100'
		}
	];

	// Hasil Filter: Section 1
	let filteredSumber = $derived(
		daftarSumber
			.filter((s) => {
				const matchQuery = searchQuery.trim() === '' || s.nama.toLowerCase().includes(searchQuery.toLowerCase());
				const matchBahasa = selectedBahasa === 'Semua bahasa' || (selectedBahasa === 'Indonesia' ? s.bahasa === 'ID' : s.bahasa === 'EN');
				const matchJalur = selectedJalur === 'Semua jalur' || s.jalur === selectedJalur;
				const matchTag = selectedTag === 'Semua tag' || s.tag.includes(selectedTag);
				return matchQuery && matchBahasa && matchJalur && matchTag;
			})
			.sort((a, b) => {
				if (selectedSort === 'Abjad (A-Z)') return a.nama.localeCompare(b.nama);
				if (selectedSort === 'Abjad (Z-A)') return b.nama.localeCompare(a.nama);
				return 0;
			})
	);

	// Hasil Filter: Section 2
	let filteredTulisan = $derived(
		daftarTulisan.filter((t) => {
			const matchQuery =
				searchQuery.trim() === '' ||
				t.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
				t.penulis.toLowerCase().includes(searchQuery.toLowerCase());
			const matchTag = selectedTag === 'Semua tag' || t.tag === selectedTag;
			return matchQuery && matchTag;
		})
	);
</script>

<div class="w-full min-w-0 max-w-full">

	<!-- Judul -->
	<h1 class="text-2xl font-bold text-slate-800 mb-6">Portal &amp; Sumber</h1>

	<!-- Search Bar + Toggle Filter -->
	<div class="flex flex-col sm:flex-row gap-3 mb-4">
		<div class="relative flex-1">
			<Search size={16} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Cari nama sumber atau tulisan..."
				class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm shadow-sm"
			/>
		</div>
		<button
			type="button"
			onclick={() => (isFilterOpen = !isFilterOpen)}
			class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 shadow-sm"
		>
			{#if isFilterOpen}
				<ChevronUp size={16} class="text-primary-600" /> Sembunyikan Filter
			{:else}
				<SlidersHorizontal size={16} class="text-primary-600" /> Advanced Filter
			{/if}
		</button>
	</div>

	<!-- Panel Advanced Filter -->
	{#if isFilterOpen}
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-xl p-4 mb-8">

			<div>
				<label for="sortSelect" class="block text-xs font-medium text-slate-500 mb-1.5">Urutkan</label>
				<select id="sortSelect" bind:value={selectedSort}
					class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-600">
					{#each sortOptions as opsi (opsi)}
						<option value={opsi}>{opsi}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="bahasaSelect" class="block text-xs font-medium text-slate-500 mb-1.5">Bahasa</label>
				<select id="bahasaSelect" bind:value={selectedBahasa}
					class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-600">
					{#each bahasaOptions as opsi (opsi)}
						<option value={opsi}>{opsi}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="jalurSelect" class="block text-xs font-medium text-slate-500 mb-1.5">Jalur</label>
				<select id="jalurSelect" bind:value={selectedJalur}
					class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-600">
					{#each jalurOptions as opsi (opsi)}
						<option value={opsi}>{opsi}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="tagSelect" class="block text-xs font-medium text-slate-500 mb-1.5">Tag</label>
				<select id="tagSelect" bind:value={selectedTag}
					class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-600">
					{#each tagOptions as opsi (opsi)}
						<option value={opsi}>{opsi}</option>
					{/each}
				</select>
			</div>

		</div>
	{/if}

	<!-- Section 1: Portal Berita Pilihan Tim -->
	<div class="mb-10">
		<h2 class="text-lg font-bold text-slate-800 mb-4">Portal Berita Pilihan Tim</h2>

		{#if filteredSumber.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each filteredSumber as s (s.id)}
					<div class="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-primary-300 transition-colors p-4 flex flex-col">
						<p class="text-xs font-bold text-primary-700 uppercase tracking-wide mb-0.5">{s.nama}</p>
						<p class="text-xs text-primary-600 mb-2">{s.jalur}</p>
						<span class="inline-block w-fit text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 mb-3">
							{s.bahasa}
						</span>
						<p class="font-semibold text-slate-800 mb-1.5">{s.nama}</p>
						<p class="text-xs text-slate-500 mb-4">{s.tag.join(' · ')}</p>
						<a href={s.url} target="_blank" rel="noopener noreferrer"
							class="mt-auto text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
							Buka situs <ExternalLink size={13} />
						</a>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-sm text-slate-500">Tidak ada sumber yang cocok dengan filter ini.</p>
		{/if}
	</div>

	<!-- Section 2: Arsip Komunitas -->
	<div>
		<h2 class="text-lg font-bold text-slate-800 mb-4">Arsip Komunitas</h2>

		{#if filteredTulisan.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each filteredTulisan as t (t.id)}
					<div class="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-primary-300 transition-colors p-4 flex flex-col">

						<span class="text-[10px] font-medium w-fit px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200 mb-2">
							{t.tag}
						</span>

						<p class="font-semibold text-slate-800 leading-snug line-clamp-2 mb-1.5">{t.judul}</p>
						<p class="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">{t.ringkasan}</p>

						<div class="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
							<p class="text-xs text-slate-400">oleh {t.penulis}</p>
							<button type="button" class="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
								<BookOpenText size={13} /> Baca <ChevronRight size={12} />
							</button>
						</div>

					</div>
				{/each}
			</div>
		{:else}
			<p class="text-sm text-slate-500">Belum ada tulisan pengguna yang cocok dengan filter ini.</p>
		{/if}
	</div>

</div>