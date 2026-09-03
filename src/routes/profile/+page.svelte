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

	// Contribution Data (by category)
	let kontribusiBacaan: Kontribusi[] = [
		{
			id: 1,
			judul: 'Mengapa Kita Sulit Fokus Belajar di Era Distraksi Digital',
			tag: 'Sains',
			status: 'diverifikasi'
		},
		{
			id: 2,
			judul: 'Sastra Lisan Nusantara yang Mulai Dilupakan',
			tag: 'Sastra & esai',
			status: 'direview'
		}
	];

	let kontribusiLatihan: Kontribusi[] = [
		{
			id: 1,
			judul: 'Paket Penalaran Analitis Level Lanjut',
			tag: 'Penalaran',
			status: 'diverifikasi'
		},
		{ id: 2, judul: 'Simulasi Kuantitatif Mingguan #3', tag: 'Matematika', status: 'draft' }
	];

	let kontribusiMateri: Kontribusi[] = [
		{
			id: 1,
			judul: 'Ringkasan Turunan & Integral Dasar',
			tag: 'Matematika',
			status: 'diverifikasi'
		}
	];

	// Derived: Total & Active Count by Tab
	let semuaKontribusi = $derived([...kontribusiBacaan, ...kontribusiLatihan, ...kontribusiMateri]);
	let jumlahDiverifikasi = $derived(
		semuaKontribusi.filter((k) => k.status === 'diverifikasi').length
	);
	let jumlahDireview = $derived(semuaKontribusi.filter((k) => k.status === 'direview').length);

	let daftarAktif = $derived(
		activeTab === 'bacaan'
			? kontribusiBacaan
			: activeTab === 'latihan'
				? kontribusiLatihan
				: kontribusiMateri
	);
</script>

<div class="mx-auto w-full max-w-2xl">
	<!-- Profile Header -->
	<div class="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<div class="mb-5 flex items-center gap-4">
			<span
				class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"
			>
				<User size={28} />
			</span>
			<div class="min-w-0">
				<p class="text-lg font-bold text-slate-800">{nama}</p>
				<p class="flex items-center gap-1.5 text-sm text-slate-400">
					<Calendar size={13} />
					{bio}
				</p>
			</div>
		</div>

		<!-- Stats Row -->
		<div class="flex gap-6 border-t border-slate-100 pt-4">
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
	<div class="mb-5 flex border-b border-slate-200">
		<button
			type="button"
			onclick={() => (activeTab = 'bacaan')}
			class="flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors {activeTab ===
			'bacaan'
				? 'border-primary-600 text-primary-700'
				: 'border-transparent text-slate-400 hover:text-slate-600'}"
		>
			<FileText size={15} /> Bacaan
		</button>
		<button
			type="button"
			onclick={() => (activeTab = 'latihan')}
			class="flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors {activeTab ===
			'latihan'
				? 'border-primary-600 text-primary-700'
				: 'border-transparent text-slate-400 hover:text-slate-600'}"
		>
			<BookOpen size={15} /> Latihan
		</button>
		<button
			type="button"
			onclick={() => (activeTab = 'materi')}
			class="flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors {activeTab ===
			'materi'
				? 'border-primary-600 text-primary-700'
				: 'border-transparent text-slate-400 hover:text-slate-600'}"
		>
			<Layers size={15} /> Materi
		</button>
	</div>

	<!-- Contribution List -->
	{#if daftarAktif.length > 0}
		<div class="flex flex-col gap-3">
			{#each daftarAktif as k (k.id)}
				<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
					<div class="mb-2 flex items-center gap-2">
						<span
							class="rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700"
						>
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
		<p class="py-8 text-center text-sm text-slate-500">Belum ada kontribusi di kategori ini.</p>
	{/if}
</div>
