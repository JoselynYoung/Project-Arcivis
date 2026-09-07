<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ArrowLeft, BookOpen, User, Bookmark, Share2, Sparkles } from '@lucide/svelte';
	import { articles } from '$lib/mocks/articles';
	import { ROUTES } from '$lib/constants/routes';

	const articleId = $derived(Number(page.params.id));
	const article = $derived(articles.find((a) => a.id === articleId) ?? null);

	let isBookmarked = $state(false);
	$effect(() => {
		if (article) isBookmarked = !!article.isBookmark;
	});
	function toggleBookmark() {
		isBookmarked = !isBookmarked;
	}
</script>

<div class="mx-auto w-full max-w-4xl pb-12">
	<div class="mb-6 flex items-center justify-between">
		<a
			href={resolve(ROUTES.articles)}
			class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
		>
			<ArrowLeft size={18} />
			<span>Kembali ke Daftar Artikel</span>
		</a>
		<div class="flex items-center gap-2">
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

	{#if !article}
		<div class="rounded-3xl border border-slate-200 bg-white p-12 text-center">
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500"
			>
				<BookOpen size={28} />
			</div>
			<h2 class="mb-2 text-xl font-bold text-slate-800">Artikel Tidak Ditemukan</h2>
			<p class="mb-6 text-sm text-slate-500">
				Artikel yang Anda cari tidak tersedia atau telah dipindahkan.
			</p>
			<a
				href={resolve(ROUTES.articles)}
				class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
			>
				Lihat Semua Artikel
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
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
									{article.kategori}
								</span>
							</div>
						</div>
						<div class="flex flex-col gap-3">
							<a
								href={resolve('/articles/[id]/read', { id: String(article.id) })}
								class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-bold text-white no-underline shadow-md transition-all hover:bg-primary-700 hover:shadow-lg"
							>
								<Sparkles size={18} />
								<span>Baca</span>
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

			<div class="space-y-6 md:col-span-7 lg:col-span-8">
				<div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<div class="flex items-center gap-2">
						<span class="rounded-full border px-3 py-1 text-xs font-semibold {article.badgeWarna}">
							{article.kategori}
						</span>
					</div>
					<h1 class="text-2xl leading-tight font-extrabold text-slate-900 sm:text-3xl">
						{article.judul}
					</h1>
					<p class="text-base leading-relaxed text-slate-600">
						{article.deskripsi}
					</p>

					<div
						class="flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-600"
					>
						<User size={16} class="shrink-0 text-primary-600" />
						<div>
							<p class="text-slate-400">Penulis</p>
							<p class="font-medium text-slate-700">{article.author}</p>
						</div>
					</div>

					{#if article.topics && article.topics.length > 0}
						<div class="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
							<p class="w-full text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
								Topik & Kata Kunci
							</p>
							{#each article.topics as topic (topic)}
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
						Panduan Membaca
					</h2>
					<ul class="m-0 list-none space-y-3 pl-0 text-sm text-primary-800/90">
						<li class="flex items-start gap-3">
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"
							>
								<BookOpen size={14} />
							</span>
							<span class="leading-6"
								>Baca sesuai kecepatan Anda sendiri, catat poin penting bila perlu.</span
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>
