<script lang="ts">
	import { ChevronRight, BarChart3, Clock3, Medal, ArrowUpRight } from '@lucide/svelte';

	let nama = 'Pejuang';

	let metrics = [
		{ label: 'Jam belajar', value: '26.5', unit: 'jam', icon: Clock3, color: 'bg-primary-600' },
		{ label: 'Akurasi rata-rata', value: '81', unit: '%', icon: BarChart3, color: 'bg-cyan-500' },
		{ label: 'Level aktif', value: 'Pro', unit: '', icon: Medal, color: 'bg-emerald-500' }
	];

	let progress = [
		{ title: 'Keterampilan Logika', value: 74, color: 'bg-primary-600' },
		{ title: 'Matematika', value: 89, color: 'bg-cyan-500' },
		{ title: 'Bahasa Indonesia', value: 66, color: 'bg-amber-500' }
	];

	let topMapel = [
		{ subject: 'Matematika', score: '89%', trend: '+6%', color: 'bg-cyan-500' },
		{ subject: 'Fisika', score: '82%', trend: '+4%', color: 'bg-primary-600' },
		{ subject: 'Penalaran Umum', score: '78%', trend: '+9%', color: 'bg-emerald-500' }
	];

	let aktivitas = [
		{ title: '7 sesi selesai', subtitle: 'Lebih aktif 18% dari minggu lalu' },
		{ title: 'Rata-rata jawaban benar', subtitle: '81% selama 3 hari terakhir' },
		{ title: 'Target minggu ini', subtitle: '3 sesi tersisa untuk capai goal' }
	];
</script>

<div class="space-y-8">
	<div class="rounded-3xl border border-primary-100/70 bg-white/90 p-6 shadow-sm md:p-8">
		<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<div>
				<p class="text-sm text-slate-500">Statistik Belajar</p>
				<h1 class="text-3xl font-semibold text-slate-900">
					Halo, {nama}! Ini ringkasan progressmu.
				</h1>
			</div>
			<span
				class="inline-flex items-center gap-2 rounded-3xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white"
			>
				Lihat rincian
				<ChevronRight size="18" />
			</span>
		</div>

		<div class="mt-8 grid gap-4 md:grid-cols-3">
			{#each metrics as metric (metric.label)}
				<div class="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
					<div class="grid h-14 w-14 place-items-center rounded-3xl text-white {metric.color}">
						<metric.icon size="24" />
					</div>
					<div>
						<p class="text-2xl font-semibold text-slate-900">{metric.value}{metric.unit}</p>
						<p class="text-sm text-slate-500">{metric.label}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
		<div class="rounded-3xl border border-primary-100/70 bg-white/90 p-6 shadow-sm md:p-8">
			<div class="mb-6 flex items-center justify-between gap-4">
				<div>
					<p class="text-sm tracking-[0.2em] text-slate-400 uppercase">Progress Visual</p>
					<h2 class="text-xl font-semibold text-slate-900">Performa Mapel</h2>
				</div>
				<span
					class="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
				>
					Ringkasan lengkap
					<ArrowUpRight size="16" />
				</span>
			</div>

			<div class="space-y-5">
				{#each progress as item (item.title)}
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<p class="text-sm font-medium text-slate-900">{item.title}</p>
							<p class="text-sm font-semibold text-slate-900">{item.value}%</p>
						</div>
						<div class="h-3 overflow-hidden rounded-full bg-slate-200">
							<div class="h-full rounded-full {item.color}" style="width: {item.value}%;"></div>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
				<p class="text-sm tracking-[0.2em] text-slate-400 uppercase">Trend Mingguan</p>
				<div class="mt-4 grid grid-cols-3 gap-3 text-center text-slate-600">
					<span class="rounded-3xl bg-white p-4 shadow-sm"
						>Sen<br /><strong class="text-slate-900">82%</strong></span
					>
					<span class="rounded-3xl bg-white p-4 shadow-sm"
						>Sel<br /><strong class="text-slate-900">88%</strong></span
					>
					<span class="rounded-3xl bg-white p-4 shadow-sm"
						>Rab<br /><strong class="text-slate-900">79%</strong></span
					>
					<span class="rounded-3xl bg-white p-4 shadow-sm"
						>Kam<br /><strong class="text-slate-900">84%</strong></span
					>
					<span class="rounded-3xl bg-white p-4 shadow-sm"
						>Jum<br /><strong class="text-slate-900">91%</strong></span
					>
					<span class="rounded-3xl bg-white p-4 shadow-sm"
						>Sab<br /><strong class="text-slate-900">87%</strong></span
					>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<div class="rounded-3xl border border-primary-100/70 bg-white/90 p-6 shadow-sm md:p-8">
				<div class="mb-4 flex items-center justify-between gap-4">
					<div>
						<p class="text-sm tracking-[0.2em] text-slate-400 uppercase">Top Mapel</p>
						<h2 class="text-xl font-semibold text-slate-900">Kekuatan Belajarmu</h2>
					</div>
					<span class="inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
						Lainnya
						<ChevronRight size="18" />
					</span>
				</div>
				<div class="space-y-4">
					{#each topMapel as item (item.subject)}
						<div
							class="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
						>
							<div>
								<p class="text-sm font-semibold text-slate-900">{item.subject}</p>
								<p class="text-xs text-slate-500">Skor {item.score}</p>
							</div>
							<span class="rounded-full px-3 py-1 text-xs font-semibold text-white {item.color}"
								>{item.trend}</span
							>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-3xl border border-primary-100/70 bg-white/90 p-6 shadow-sm md:p-8">
				<div class="mb-4 flex items-center justify-between gap-4">
					<div>
						<p class="text-sm tracking-[0.2em] text-slate-400 uppercase">Aktivitas</p>
						<h2 class="text-xl font-semibold text-slate-900">Ringkasan minggu ini</h2>
					</div>
					<div class="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
						Stabil
					</div>
				</div>
				<div class="space-y-4">
					{#each aktivitas as item (item.title)}
						<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
							<p class="font-semibold text-slate-900">{item.title}</p>
							<p class="mt-1 text-sm text-slate-500">{item.subtitle}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
