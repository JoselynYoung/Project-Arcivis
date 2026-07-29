<script lang="ts">
	import { resolve } from '$app/paths';
	import { Calculator, Atom, FlaskConical, Leaf, BookOpen, Languages, Brain } from '@lucide/svelte';

	// Subject Shortcuts
	let mapel = [
		{ nama: 'Matematika', icon: Calculator, warna: 'bg-primary-50 text-primary-700' },
		{ nama: 'Fisika', icon: Atom, warna: 'bg-cyan-50 text-cyan-700' },
		{ nama: 'Kimia', icon: FlaskConical, warna: 'bg-emerald-50 text-emerald-700' },
		{ nama: 'Biologi', icon: Leaf, warna: 'bg-amber-50 text-amber-700' },
		{ nama: 'B.Indonesia', icon: BookOpen, warna: 'bg-rose-50 text-rose-700' },
		{ nama: 'B.Inggris', icon: Languages, warna: 'bg-indigo-50 text-indigo-700' },
		{ nama: 'Penalaran', icon: Brain, warna: 'bg-purple-50 text-purple-700' }
	];

	// Question Package Data (id ditambahkan supaya bisa dijadikan URL /latihan/{id})
	let paketSoal = [
		{
			judul: 'Paket Latihan Soal A',
			items: [
				{ id: 1, label: 'Penalaran Umum', jumlah: '20 Soal' },
				{ id: 2, label: 'Pengetahuan Kuantitatif', jumlah: '15 Soal' },
				{ id: 3, label: 'Penalaran Matematika', jumlah: '20 Soal' }
			]
		},
		{
			judul: 'Paket Latihan Soal B',
			items: [
				{ id: 4, label: 'Literasi B. Indonesia', jumlah: '15 Soal' },
				{ id: 5, label: 'Literasi B. Inggris', jumlah: '15 Soal' },
				{ id: 6, label: 'Pemahaman Bacaan', jumlah: '10 Soal' }
			]
		},
		{
			judul: 'Paket Latihan Soal C',
			items: [
				{ id: 7, label: 'Matematika Dasar', jumlah: '20 Soal' },
				{ id: 8, label: 'Fisika Terapan', jumlah: '15 Soal' },
				{ id: 9, label: 'Kimia Dasar', jumlah: '15 Soal' }
			]
		}
	];
</script>

<!-- Search Bar -->
<div class="mb-8">
	<input
		type="text"
		placeholder="Cari paket soal atau topik..."
		class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600"
	/>
</div>

<!-- Subject Shortcuts -->
<div class="mb-10">
	<p class="text-sm font-medium text-slate-500 mb-3">Tempat Latihan Soal</p>
	<div class="grid grid-cols-4 sm:grid-cols-7 gap-3">
		{#each mapel as m (m.nama)}
			<button type="button" class="flex flex-col items-center gap-2">
				<span class="h-12 w-12 rounded-2xl flex items-center justify-center {m.warna}">
					<m.icon size={22} />
				</span>
				<span class="text-xs text-slate-600 text-center leading-tight">{m.nama}</span>
			</button>
		{/each}
	</div>
</div>

<!-- Paket Latihan Soal A/B/C -->
{#each paketSoal as paket (paket.judul)}
	<div class="mb-8 sm:mb-10">
		<p class="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4">{paket.judul}</p>

		<div class="flex gap-3 sm:gap-4 overflow-x-auto pb-3 w-full max-w-full scrollbar-thin">
			{#each paket.items as item (item.id)}
				<a
					href={resolve(`/latihan/${item.id}`)}
					class="shrink-0 w-40 sm:w-44 bg-white rounded-xl shadow-sm p-3 border-2 border-primary-100 hover:border-primary-300 transition-colors"
				>
					<div class="bg-primary-50 rounded-lg h-24 mb-3"></div>
					<p class="text-xs text-slate-400 mb-0.5">{item.label}</p>
					<p class="text-sm font-medium text-slate-800 leading-snug">{item.jumlah}</p>
				</a>
			{/each}
		</div>
	</div>
{/each}