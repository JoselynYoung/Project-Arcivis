<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ArrowLeft, User, Calendar } from '@lucide/svelte';
	import { articles } from '$lib/mocks/articles';
	import { ROUTES } from '$lib/constants/routes';

	const articleId = $derived(Number(page.params.id));
	const article = $derived(articles.find((a) => a.id === articleId) ?? null);

	const paragraphs = $derived(
		article ? article.konten.split('\n\n').filter((p) => p.trim() !== '') : []
	);
</script>

<div class="mx-auto w-full max-w-4xl pb-12">
	{#if !article}
		<div class="rounded-3xl border border-slate-200 bg-white p-12 text-center">
			<h2 class="text-xl font-bold text-slate-800">Artikel Tidak Ditemukan</h2>
			<a href={resolve(ROUTES.articles)} class="mt-4 inline-block text-primary-600 hover:underline">
				Kembali ke Artikel
			</a>
		</div>
	{:else}
		<div class="mb-8">
			<a
				href={resolve('/articles/[id]', { id: String(article.id) })}
				class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-700"
			>
				<ArrowLeft size={18} />
				<span>Kembali ke Detail Artikel</span>
			</a>
			<h1 class="mb-4 text-3xl font-bold text-slate-800">{article.judul}</h1>
			<div class="flex flex-wrap items-center gap-4 text-sm text-slate-500">
				<span class="flex items-center gap-1.5">
					<User size={16} class="text-primary-600" />
					{article.author}
				</span>
				<span class="flex items-center gap-1.5">
					<Calendar size={16} class="text-primary-600" />
					{article.updatedAt}
				</span>
			</div>
		</div>

		<article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<div class="prose prose-slate max-w-none">
				{#each paragraphs as paragraph, i (i)}
					<p class="mb-4 text-base leading-relaxed text-slate-700">{paragraph}</p>
				{/each}
			</div>
		</article>
	{/if}
</div>