<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ArrowLeft, BookOpen, Bookmark, CheckCircle2, Clock, Share2 } from '@lucide/svelte';
	import { learningMaterials } from '$lib/mocks/learning';
	import { ROUTES } from '$lib/constants/routes';

	const materialId = $derived(Number(page.params.id));
	const material = $derived(learningMaterials.find((m) => m.id === materialId) ?? null);

	let isCompleted = $state(false);
	let isBookmarked = $state(false);

	$effect(() => {
		if (material) {
			isBookmarked = !!material.isBookmark;
		}
	});

	function toggleBookmark() {
		isBookmarked = !isBookmarked;
	}

	function markAsCompleted() {
		isCompleted = true;
	}
</script>

<div class="mx-auto w-full max-w-3xl pb-16">
	{#if !material}
		<div class="my-8 rounded-3xl border border-slate-200 bg-white p-12 text-center">
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500"
			>
				<BookOpen size={28} />
			</div>
			<h2 class="mb-2 text-xl font-bold text-slate-800">Materi Tidak Ditemukan</h2>
			<p class="mb-6 text-sm text-slate-500">Halaman bacaan yang Anda minta tidak tersedia.</p>
			<a
				href={resolve(ROUTES.learning)}
				class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
			>
				Kembali ke Modul Learning
			</a>
		</div>
	{:else}
		<!-- Reader Sticky Header -->
		<div
			class="sticky top-0 z-20 -mx-4 mb-6 flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6"
		>
			<a
				href={resolve('/learning/[id]', { id: String(material.id) })}
				class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-primary-700"
			>
				<ArrowLeft size={18} />
				<span class="hidden sm:inline">Kembali ke Detail Materi</span>
				<span class="sm:hidden">Detail</span>
			</a>

			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={toggleBookmark}
					aria-label="Simpan ke Bookmark"
					class="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-all hover:bg-slate-50"
				>
					<Bookmark size={16} class={isBookmarked ? 'fill-amber-400 text-amber-500' : ''} />
				</button>
				<button
					type="button"
					aria-label="Bagikan"
					class="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-all hover:bg-slate-50"
				>
					<Share2 size={16} />
				</button>
			</div>
		</div>

		<!-- Article Reader Card -->
		<article class="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
			<!-- Header Title Info -->
			<div class="space-y-4 border-b border-slate-100 pb-6">
				<div class="flex items-center gap-2">
					<span class="rounded-full border px-3 py-1 text-xs font-semibold {material.badgeWarna}">
						{material.mapel}
					</span>
					<span class="flex items-center gap-1 text-xs font-medium text-slate-400">
						<Clock size={14} />
						{material.durasi}
					</span>
				</div>

				<h1 class="text-2xl leading-tight font-extrabold text-slate-900 sm:text-4xl">
					{material.judul}
				</h1>

				<div class="flex items-center justify-between pt-2 text-xs text-slate-500">
					<span>Penulis: <strong class="text-slate-700">{material.author}</strong></span>
					<span>Diperbarui: {material.updatedAt}</span>
				</div>
			</div>

			<!-- Article Body Content -->
			<div
				class="prose max-w-none space-y-6 text-base leading-relaxed text-slate-700 prose-slate [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html material.content}
			</div>

			<!-- Completion Footer Action -->
			<div
				class="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row"
			>
				<div class="text-sm text-slate-500">
					{#if isCompleted}
						<span class="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
							<CheckCircle2 size={18} /> Materi ini telah Anda selesaikan!
						</span>
					{:else}
						<span>Selesaikan membaca untuk menandai kemajuan Anda.</span>
					{/if}
				</div>

				{#if !isCompleted}
					<button
						type="button"
						onclick={markAsCompleted}
						class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:w-auto"
					>
						<CheckCircle2 size={18} />
						Tandai Selesai
					</button>
				{:else}
					<a
						href={resolve(ROUTES.learning)}
						class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-primary-700 sm:w-auto"
					>
						Lanjut ke Materi Lain
					</a>
				{/if}
			</div>
		</article>
	{/if}
</div>
