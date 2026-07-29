<script lang="ts">
	import { User, ShieldCheck, Clock3, FileText, BookOpen, Layers, Calendar } from '@lucide/svelte';

	// Profile Data
	let nama = 'Pejuang';
	let bio = 'Kontributor Arcivis · Bergabung sejak Juli 2026';

	interface Kontribusi {
		id: number;
		judul: string;
		tag: string;
		status: 'diverifikasi' | 'direview' | 'draft';
	}

	// Tab State
	let activeTab = $state<'bacaan' | 'latihan' | 'materi'>('bacaan');

	// Contribution Data (per kategori)
	let kontribusiBacaan: Kontribusi[] = [
		{ id: 1, judul: 'Mengapa Kita Sulit Fokus Belajar di Era Distraksi Digital', tag: 'Sains', status: 'diverifikasi' },
		{ id: 2, judul: 'Sastra Lisan Nusantara yang Mulai Dilupakan', tag: 'Sastra & esai', status: 'direview' }
	];

	let kontribusiLatihan: Kontribusi[] = [
		{ id: 1, judul: 'Paket Penalaran Analitis Level Lanjut', tag: 'Penalaran', status: 'diverifikasi' },
		{ id: 2, judul: 'Simulasi Kuantitatif Mingguan #3', tag: 'Matematika', status: 'draft' }
	];

	let kontribusiMateri: Kontribusi[] = [
		{ id: 1, judul: 'Ringkasan Turunan & Integral Dasar', tag: 'Matematika', status: 'diverifikasi' }
	];

	// Derived: total & aktif berdasarkan tab
	let semuaKontribusi = $derived([...kontribusiBacaan, ...kontribusiLatihan, ...kontribusiMateri]);
	let jumlahDiverifikasi = $derived(semuaKontribusi.filter((k) => k.status === 'diverifikasi').length);
	let jumlahDireview = $derived(semuaKontribusi.filter((k) => k.status === 'direview').length);

	let daftarAktif = $derived(
		activeTab === 'bacaan' ? kontribusiBacaan : activeTab === 'latihan' ? kontribusiLatihan : kontribusiMateri
	);
</script>

<div class="w-full max-w-2xl mx-auto">

	<!-- Profile Header -->
	<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
		<div class="flex items-center gap-4 mb-5">
			<span class="h-16 w-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
				<User size={28} />
			</span>
			<div class="min-w-0">
				<p class="font-bold text-lg text-slate-800">{nama}</p>
				<p class="text-sm text-slate-400 flex items-center gap-1.5">
					<Calendar size={13} /> {bio}
				</p>
			</div>
		</div>

		<!-- Stats Row -->
		<div class="flex gap-6 pt-4 border-t border-slate-100">
			<div>
				<p class="font-bold text-slate-800">{semuaKontribusi.length}</p>
				<p class="text-xs text-slate-500">Kontribusi</p>
			</div>
			<div>
				<p class="font-bold text-emerald-600">{jumlahDiverifikasi}</p>
				<p class="text-xs text-slate-500">Diverifikasi</p>
			</div>
			<div>
				<p class="font-bold text-amber-600">{jumlahDireview}</p>
				<p class="text-xs text-slate-500">Direview</p>
			</div>
		</div>
	</div>

	<!-- Tabs -->
	<div class="flex border-b border-slate-200 mb-5">
		<button
			type="button"
			onclick={() => (activeTab = 'bacaan')}
			class="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors {activeTab === 'bacaan' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-400 hover:text-slate-600'}"
		>
			<FileText size={15} /> Bacaan
		</button>
		<button
			type="button"
			onclick={() => (activeTab = 'latihan')}
			class="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors {activeTab === 'latihan' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-400 hover:text-slate-600'}"
		>
			<BookOpen size={15} /> Latihan
		</button>
		<button
			type="button"
			onclick={() => (activeTab = 'materi')}
			class="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors {activeTab === 'materi' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-400 hover:text-slate-600'}"
		>
			<Layers size={15} /> Materi
		</button>
	</div>

	<!-- Contribution List -->
	{#if daftarAktif.length > 0}
		<div class="flex flex-col gap-3">
			{#each daftarAktif as k (k.id)}
				<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
							{k.tag}
						</span>
						{#if k.status === 'diverifikasi'}
							<span class="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
								<ShieldCheck size={11} /> Diverifikasi
							</span>
						{:else if k.status === 'direview'}
							<span class="flex items-center gap-1 text-[10px] font-medium text-amber-600">
								<Clock3 size={11} /> Sedang direview
							</span>
						{:else}
							<span class="text-[10px] font-medium text-slate-400">Draft</span>
						{/if}
					</div>
					<p class="text-sm font-medium text-slate-800">{k.judul}</p>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-sm text-slate-500 text-center py-8">Belum ada kontribusi di kategori ini.</p>
	{/if}

</div>