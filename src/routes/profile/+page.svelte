<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		User,
		ShieldCheck,
		Clock3,
		FileText,
		BookOpen,
		Layers,
		Calendar,
		Pencil,
		Check,
		X,
		MessageCircle,
		Flag,
		Activity
	} from '@lucide/svelte';
	import { supabase } from '$lib/services/supabaseClient';
	import { getProfil, type ContributionItem } from '$lib/services/profile';
	import { getOwnComments, type OwnComment } from '$lib/services/comments';
	import { getOwnReports, type OwnReport } from '$lib/services/reports';

	// Profile Data
	let nama = $state('');
	let bio = $state('');
	let peran = $state('');
	let bergabung = $state('');
	let editingName = $state(false);
	let savingName = $state(false);
	let submittingId = $state<string | null>(null);

	// Tab State
	let activeTab = $state<'bacaan' | 'latihan' | 'materi' | 'aktivitas'>('bacaan');

	// Contribution Data (by category)
	let kontribusiBacaan = $state<ContributionItem[]>([]);
	let kontribusiLatihan = $state<ContributionItem[]>([]);
	let kontribusiMateri = $state<ContributionItem[]>([]);
	let komentarSaya = $state<OwnComment[]>([]);
	let laporanSaya = $state<OwnReport[]>([]);

	$effect(() => {
		let cancelled = false;
		getProfil().then(({ data, error }) => {
			if (error) console.error('Failed to load profile:', error);
			if (cancelled) return;

			if (!data) {
				nama = 'Pengunjung';
				return;
			}

			nama = data.nama;
			peran = roleLabel(data.role);
			bergabung = formatJoined(data.createdAt);
			kontribusiBacaan = data.bacaan;
			kontribusiLatihan = data.latihan;
			kontribusiMateri = data.materi;
			getOwnActivity(cancelled);
		});
		return () => {
			cancelled = true;
		};
	});

	async function getOwnActivity(cancelled: boolean) {
		const [{ data: comments }, { data: reports }] = await Promise.all([
			getOwnComments(),
			getOwnReports()
		]);
		if (!cancelled) {
			komentarSaya = comments;
			laporanSaya = reports;
		}
	}

	async function saveName() {
		const value = nama.trim();

		if (!value || savingName) {
			editingName = false;
			return;
		}
		savingName = true;

		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			savingName = false;
			editingName = false;
			return;
		}

		const { error } = await supabase.from('profiles').update({ name: value }).eq('id', user.id);

		savingName = false;
		if (error) {
			console.error('Failed to save name:', error.message);
			return;
		}

		nama = value;
		editingName = false;
	}

	function roleLabel(role: string): string {
		const labels: Record<string, string> = {
			guest: 'Pengunjung',
			member: 'Anggota',
			contributor: 'Kontributor',
			moderator: 'Moderator',
			admin: 'Admin'
		};
		return `${labels[role] ?? 'Anggota'} Arcivis`;
	}

	function formatJoined(iso: string): string {
		if (!iso) return '';
		const label = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(
			new Date(iso)
		);
		return `Bergabung ${label}`;
	}

	async function submitDraft(id: string) {
		if (submittingId) return;
		submittingId = id;

		const { submitForReview } = await import('$lib/services/review');
		const { error } = await submitForReview(id);

		submittingId = null;

		if (error) {
			console.error('Failed to submit for review:', error);
			return;
		}

		const bump = (list: ContributionItem[]) =>
			list.map((item) => (item.id === id ? { ...item, status: 'direview' as const } : item));
		kontribusiBacaan = bump(kontribusiBacaan);
		kontribusiLatihan = bump(kontribusiLatihan);
		kontribusiMateri = bump(kontribusiMateri);
	}

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

	type ActivityItem = {
		id: string;
		kind: 'komentar' | 'laporan';
		title: string;
		detail: string;
		createdAt: string;
	};

	// Activity feed: own comments and reports, newest first.
	let aktivitas = $derived<ActivityItem[]>(
		[
			...komentarSaya.map((comment) => ({
				id: `komentar-${comment.id}`,
				kind: 'komentar' as const,
				title: comment.body,
				detail: `pada ${comment.contentTitle}`,
				createdAt: comment.createdAt
			})),
			...laporanSaya.map((report) => ({
				id: `laporan-${report.id}`,
				kind: 'laporan' as const,
				title: report.reason,
				detail: `pada ${report.contentTitle}`,
				createdAt: report.createdAt
			}))
		].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
	);

	const activityDate = new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
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
			<div class="min-w-0 flex-1">
				{#if editingName}
					<div class="flex items-center gap-2">
						<input
							type="text"
							bind:value={nama}
							maxlength={80}
							aria-label="Nama tampilan"
							class="focus:border-primary-500 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-lg font-bold text-slate-800 focus:outline-none"
						/>
						<button
							type="button"
							onclick={saveName}
							disabled={savingName}
							aria-label="Simpan nama"
							class="rounded-lg bg-primary-600 p-2 text-white transition-colors hover:bg-primary-700 disabled:bg-slate-200"
						>
							<Check size={16} />
						</button>
						<button
							type="button"
							onclick={() => (editingName = false)}
							aria-label="Batal"
							class="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200"
						>
							<X size={16} />
						</button>
					</div>
				{:else}
					<div class="flex items-center gap-2">
						<p class="text-lg font-bold text-slate-800">{nama}</p>
						{#if nama !== 'Pengunjung'}
							<button
								type="button"
								onclick={() => (editingName = true)}
								aria-label="Ubah nama tampilan"
								class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
							>
								<Pencil size={14} />
							</button>
						{/if}
					</div>
				{/if}
				<p class="text-sm text-slate-500">{bio || peran}</p>
				{#if bergabung}
					<p class="flex items-center gap-1.5 text-sm text-slate-400">
						<Calendar size={13} />
						{bergabung}
					</p>
				{/if}
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
		<button
			type="button"
			onclick={() => (activeTab = 'aktivitas')}
			class="flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors {activeTab ===
			'aktivitas'
				? 'border-primary-600 text-primary-700'
				: 'border-transparent text-slate-400 hover:text-slate-600'}"
		>
			<Activity size={15} /> Aktivitas
		</button>
	</div>

	{#if activeTab === 'aktivitas'}
		{#if aktivitas.length > 0}
			<div class="flex flex-col gap-3">
				{#each aktivitas as item (item.id)}
					<div
						class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
					>
						<span class="mt-0.5 shrink-0 text-slate-400">
							{#if item.kind === 'komentar'}
								<MessageCircle size={16} />
							{:else}
								<Flag size={16} />
							{/if}
						</span>
						<div class="min-w-0">
							<p class="text-sm font-medium text-slate-800">
								{item.kind === 'komentar' ? 'Mengomentari' : 'Melaporkan'}
								{item.detail}
							</p>
							<p class="line-clamp-2 text-sm text-slate-600">“{item.title}”</p>
							<p class="mt-1 text-xs text-slate-400">
								{activityDate.format(new Date(item.createdAt))}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="py-8 text-center text-sm text-slate-500">
				Belum ada aktivitas. Komentar dan laporanmu akan tercatat di sini.
			</p>
		{/if}
	{:else if daftarAktif.length > 0}
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
					<div class="mt-2 flex items-center justify-between gap-2">
						<p class="text-sm font-medium text-slate-800">{k.judul}</p>
						<div class="flex shrink-0 items-center gap-2">
							{#if k.status === 'draft' || k.status === 'direview'}
								<a
									href={resolve('/contribute/[id]', { id: k.id })}
									class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
								>
									Ubah
								</a>
							{/if}
							{#if k.status === 'draft'}
								<button
									type="button"
									onclick={() => submitDraft(k.id)}
									disabled={submittingId === k.id}
									class="shrink-0 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 disabled:text-slate-400"
								>
									{submittingId === k.id ? '...' : 'Ajukan review'}
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="py-8 text-center text-sm text-slate-500">Belum ada kontribusi di kategori ini.</p>
	{/if}
</div>
