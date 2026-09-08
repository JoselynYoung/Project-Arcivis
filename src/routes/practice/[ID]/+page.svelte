<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		ArrowLeft,
		BookOpen,
		User,
		Bookmark,
		Share2,
		Play,
		ShieldCheck,
		ListChecks
	} from '@lucide/svelte';
	import { practicePackages, subjects } from '$lib/mocks/practice';
	import { ROUTES } from '$lib/constants/routes';

	const packageId = $derived(Number(page.params.id));
	const pkg = $derived(practicePackages.find((p) => p.id === packageId) ?? null);

	function getSubjectBadgeColor(subjectName: string): string {
		return subjects.find((s) => s.name === subjectName)?.color ?? 'bg-slate-50 text-slate-700';
	}

	let isBookmarked = $state(false);
	function toggleBookmark() {
		isBookmarked = !isBookmarked;
	}
</script>

<div class="mx-auto w-full max-w-4xl pb-12">
	<div class="mb-6 flex items-center justify-between">
		<a
			href={resolve(ROUTES.practice)}
			class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
		>
			<ArrowLeft size={18} />
			<span>Kembali ke Daftar Latihan</span>
		</a>

		<div class="flex items-center gap-2">
			{#if pkg?.isVerified}
				<span
					class="hidden items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex"
				>
					<ShieldCheck size={14} /> Terverifikasi
				</span>
			{/if}
			<button
				type="button"
				onclick={toggleBookmark}
				aria-label="Simpan ke Bookmark"
				class="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-all hover:bg-slate-50"
			>
				<Bookmark size={18} class={isBookmarked ? 'fill-amber-400 text-amber-500' : ''} />
			</button>
			<button
				type="button"
				aria-label="Bagikan Halaman"
				class="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-all hover:bg-slate-50"
			>
				<Share2 size={18} />
			</button>
		</div>
	</div>

	{#if !pkg}
		<div class="rounded-3xl border border-slate-200 bg-white p-12 text-center">
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500"
			>
				<BookOpen size={28} />
			</div>
			<h2 class="mb-2 text-xl font-bold text-slate-800">Paket Latihan Tidak Ditemukan</h2>
			<p class="mb-6 text-sm text-slate-500">
				Paket yang Anda cari tidak tersedia atau telah dipindahkan.
			</p>
			<a
				href={resolve(ROUTES.practice)}
				class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
			>
				Lihat Semua Paket Latihan
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
			<!-- Left Column: Cover / Showcase -->
			<div class="md:col-span-5 lg:col-span-4">
				<div class="sticky top-6">
					<div class="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
						<div
							class="relative mb-5 flex aspect-3/4 w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-primary-600 to-primary-800 p-6 text-white shadow-inner"
						>
							<div class="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
							<div class="relative z-10 flex flex-col items-center">
								<div
									class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md"
								>
									<BookOpen size={36} class="text-white" />
								</div>
								<span
									class="mb-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase"
								>
									{pkg.subject}
								</span>
							</div>
						</div>

						<div class="flex flex-col gap-3">
							<a
								href={resolve('/practice/[id]/quiz', { id: String(pkg.id) })}
								class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-bold text-white no-underline shadow-md transition-all hover:bg-primary-700 hover:shadow-lg"
							>
								<Play size={18} />
								<span>Mulai Kerjakan</span>
							</a>
							<button
								type="button"
								onclick={() => alert('Fitur unduh PDF segera hadir')}
								class="w-full rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
							>
								Unduh PDF
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column: Metadata & Detailed Overview -->
			<div class="space-y-6 md:col-span-7 lg:col-span-8">
				<div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<div class="flex flex-wrap items-center gap-2">
						<span
							class="rounded-full px-3 py-1 text-xs font-semibold {getSubjectBadgeColor(
								pkg.subject
							)}"
						>
							{pkg.subject}
						</span>
						{#if pkg.isVerified}
							<span
								class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:hidden"
							>
								<ShieldCheck size={14} /> Terverifikasi
							</span>
						{/if}
					</div>

					<h1 class="text-2xl leading-tight font-extrabold text-slate-900 sm:text-3xl">
						{pkg.title}
					</h1>

					<p class="text-base leading-relaxed text-slate-600">
						{pkg.description}
					</p>

					<div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs sm:grid-cols-2">
						<div class="flex items-center gap-2 text-slate-600">
							<User size={16} class="shrink-0 text-primary-600" />
							<div>
								<p class="text-slate-400">Penyusun</p>
								<p class="font-medium text-slate-700">{pkg.author}</p>
							</div>
						</div>

						<div class="flex items-center gap-2 text-slate-600">
							<ListChecks size={16} class="shrink-0 text-primary-600" />
							<div>
								<p class="text-slate-400">Jumlah Soal</p>
								<p class="font-medium text-slate-700">{pkg.questionCount} Soal</p>
							</div>
						</div>
					</div>

					{#if pkg.topics && pkg.topics.length > 0}
						<div class="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
							<p class="w-full text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
								Topik yang Dicakup
							</p>
							{#each pkg.topics as topic (topic)}
								<span
									class="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
								>
									#{topic}
								</span>
							{/each}
						</div>
					{/if}
				</div>

				<div class="space-y-3 rounded-3xl border border-primary-100 bg-primary-50/60 p-6 sm:p-8">
					<h2 class="flex items-center gap-2 text-base font-bold text-primary-900">
						<BookOpen size={18} class="text-primary-600" />
						Panduan Mengerjakan
					</h2>
					<ul class="m-0 list-none space-y-3 pl-0 text-sm text-primary-800/90">
						<li class="flex items-start gap-3">
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"
							>
								<BookOpen size={14} />
							</span>
							<span class="leading-6">Kerjakan soal secara berurutan untuk hasil terbaik.</span>
						</li>
						<li class="flex items-start gap-3">
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"
							>
								<BookOpen size={14} />
							</span>
							<span class="leading-6"
								>Setiap jawaban langsung diperiksa lengkap dengan pembahasan.</span
							>
						</li>
						<li class="flex items-start gap-3">
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"
							>
								<BookOpen size={14} />
							</span>
							<span class="leading-6"
								>Gunakan fitur bookmark jika ingin menyimpan paket untuk diulas kembali.</span
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>
