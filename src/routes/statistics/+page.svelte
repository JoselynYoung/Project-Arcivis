<script lang="ts">
	import {
		ChevronRight,
		BarChart3,
		Clock3,
		Medal,
		ArrowUpRight,
		LogIn,
		BookOpen
	} from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { ROUTES } from '$lib/constants/routes';
	import { getProfil } from '$lib/services/profile';
	import { getMyStatistics, type MyStatistics } from '$lib/services/attempts';

	let nama = $state('Pejuang');
	let stats = $state<MyStatistics | null>(null);
	let signedIn: boolean | null = $state(null);

	const barColors = ['bg-primary-600', 'bg-cyan-500', 'bg-emerald-500'];

	$effect(() => {
		getProfil().then(({ data }) => {
			if (data) nama = data.nama;
		});
		getMyStatistics().then(({ data, error }) => {
			if (error) console.error('Failed to load statistics:', error);
			stats = data;
		});
		supabaseAuthCheck();
	});

	async function supabaseAuthCheck() {
		const { supabase } = await import('$lib/services/supabaseClient');
		const { data } = await supabase.auth.getSession();
		signedIn = !!data.session;
	}
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
				<ChevronRight size={18} />
			</span>
		</div>

		{#if signedIn === false}
			<div class="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
				<p class="text-sm font-medium text-slate-700">Masuk untuk melihat statistik belajarmu.</p>
				<p class="mt-1 text-sm text-slate-500">
					Sesi latihan, akurasi, dan jumlah soal hanya tercatat untuk akun yang masuk.
				</p>
				<a
					href={resolve(ROUTES.login)}
					class="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
				>
					<LogIn size={16} /> Masuk
				</a>
			</div>
		{:else if stats && stats.sessions > 0}
			{@const metrics = [
				{
					label: 'Sesi selesai',
					value: String(stats.sessions),
					unit: '',
					icon: Clock3,
					color: 'bg-primary-600'
				},
				{
					label: 'Akurasi rata-rata',
					value: stats.accuracy === null ? '–' : String(stats.accuracy),
					unit: stats.accuracy === null ? '' : '%',
					icon: BarChart3,
					color: 'bg-cyan-500'
				},
				{
					label: 'Soal dikerjakan',
					value: String(stats.questions),
					unit: '',
					icon: Medal,
					color: 'bg-emerald-500'
				}
			]}
			<div class="mt-8 grid gap-4 md:grid-cols-3">
				{#each metrics as metric (metric.label)}
					<div class="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
						<div class="grid h-14 w-14 place-items-center rounded-3xl text-white {metric.color}">
							<metric.icon size={24} />
						</div>
						<div>
							<p class="text-2xl font-semibold text-slate-900">{metric.value}{metric.unit}</p>
							<p class="text-sm text-slate-500">{metric.label}</p>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
				<p class="text-sm font-medium text-slate-700">Belum ada sesi latihan yang tercatat.</p>
				<p class="mt-1 text-sm text-slate-500">
					Kerjakan satu paket latihan atau buat sesi acak untuk mulai mengisi statistikmu.
				</p>
				<a
					href={resolve(ROUTES.practice)}
					class="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
				>
					<BookOpen size={16} /> Mulai latihan
				</a>
			</div>
		{/if}
	</div>

	{#if stats && stats.sessions > 0}
		{@const topSubjects = stats.perSubject.slice(0, 3)}
		{@const activeWeek = stats.weekly.some((day) => day.accuracy !== null)}
		<div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
			<div class="rounded-3xl border border-primary-100/70 bg-white/90 p-6 shadow-sm md:p-8">
				<div class="mb-6 flex items-center justify-between gap-4">
					<div>
						<p class="text-sm tracking-[0.2em] text-slate-400 uppercase">Performa Visual</p>
						<h2 class="text-xl font-semibold text-slate-900">Performa Mapel</h2>
					</div>
					<span
						class="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
					>
						Ringkasan lengkap
						<ArrowUpRight size={16} />
					</span>
				</div>

				<div class="space-y-5">
					{#each topSubjects as item, i (item.subject)}
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<p class="text-sm font-medium text-slate-900">{item.subject}</p>
								<p class="text-sm font-semibold text-slate-900">
									{item.accuracy === null ? '–' : `${item.accuracy}%`}
								</p>
							</div>
							<div class="h-3 overflow-hidden rounded-full bg-slate-200">
								<div
									class="h-full rounded-full {barColors[i % barColors.length]}"
									style="width: {item.accuracy ?? 0}%;"
								></div>
							</div>
						</div>
					{/each}
				</div>

				<div class="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
					<p class="text-sm tracking-[0.2em] text-slate-400 uppercase">Tren Mingguan</p>
					<div class="mt-4 grid grid-cols-3 gap-3 text-center text-slate-600">
						{#each stats.weekly.slice(0, 6) as day (day.day)}
							<span class="rounded-3xl bg-white p-4 shadow-sm"
								>{day.day}<br /><strong class="text-slate-900"
									>{day.accuracy === null ? '–' : `${day.accuracy}%`}</strong
								></span
							>
						{/each}
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
							<ChevronRight size={18} />
						</span>
					</div>
					<div class="space-y-4">
						{#each topSubjects as item, i (item.subject)}
							<div
								class="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
							>
								<div>
									<p class="text-sm font-semibold text-slate-900">{item.subject}</p>
									<p class="text-xs text-slate-500">
										{item.accuracy === null ? 'Belum ada skor' : `Akurasi ${item.accuracy}%`}
									</p>
								</div>
								<span
									class="rounded-full px-3 py-1 text-xs font-semibold text-white {barColors[
										i % barColors.length
									]}">{item.sessions} sesi</span
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
						<div
							class="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700"
						>
							{activeWeek ? 'Aktif' : 'Mulai'}
						</div>
					</div>
					<div class="space-y-4">
						<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
							<p class="font-semibold text-slate-900">{stats.sessions} sesi selesai</p>
							<p class="mt-1 text-sm text-slate-500">Total sesi latihan yang tercatat.</p>
						</div>
						<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
							<p class="font-semibold text-slate-900">
								Rata-rata benar {stats.accuracy === null ? '–' : `${stats.accuracy}%`}
							</p>
							<p class="mt-1 text-sm text-slate-500">Dari seluruh sesi yang memiliki skor.</p>
						</div>
						<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
							<p class="font-semibold text-slate-900">{stats.questions} soal dikerjakan</p>
							<p class="mt-1 text-sm text-slate-500">
								{stats.lastActive
									? `Terakhir aktif ${new Date(stats.lastActive).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}.`
									: 'Belum ada aktivitas tercatat.'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
