<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { ArrowLeft, User, Calendar } from '@lucide/svelte';
	import { ROUTES } from '$lib/constants/routes';
	import type { PageData } from './$types';
	import ContentBody from '$lib/components/ContentBody.svelte';
	import { recordArticleView } from '$lib/services/articles';

	let { data }: { data: PageData } = $props();

	const article = $derived(data.article);

	onMount(() => {
		if (!article) return;

		const key = 'arcivis:view-session';
		const sessionId = sessionStorage.getItem(key) ?? crypto.randomUUID().replaceAll('-', '');
		sessionStorage.setItem(key, sessionId);
		void recordArticleView(article.id, sessionId);
	});
</script>

<div class="mx-auto w-full max-w-4xl pb-12">
	{#if data.articlesError}
		<div class="rounded-3xl border border-slate-200 bg-white p-12 text-center">
			<h2 class="text-xl font-bold text-slate-800">Artikel Tidak Dapat Dimuat</h2>
			<a href={resolve(ROUTES.articles)} class="mt-4 inline-block text-primary-600 hover:underline">
				Kembali ke Artikel
			</a>
		</div>
	{:else if !article}
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
			<div class="prose max-w-none prose-slate">
				<ContentBody body={article.body} editorSchemaVersion={article.editorSchemaVersion} />
			</div>
		</article>
	{/if}
</div>
