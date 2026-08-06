<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		ArrowLeft,
		BookOpen,
		Clock,
		User,
		Calendar,
		Eye,
		Bookmark,
		Share2,
		Sparkles
	} from '@lucide/svelte';
	import { learningMaterials } from '$lib/mocks/learning';
	import { ROUTES } from '$lib/constants/routes';

	const materialId = $derived(Number(page.params.id));
	const material = $derived(learningMaterials.find((m) => m.id === materialId) ?? null);

	let isBookmarked = $state(false);

	$effect(() => {
		if (material) {
			isBookmarked = !!material.isBookmark;
		}
	});

	function toggleBookmark() {
		isBookmarked = !isBookmarked;
	}
</script>

<div class="mx-auto w-full max-w-4xl pb-12">
	<!-- Back Button & Breadcrumb Navigation -->
	<div class="mb-6 flex items-center justify-between">
		<a
			href={resolve(ROUTES.learning)}
			class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
		>
			<ArrowLeft size={18} />
			<span>Kembali ke Daftar Materi</span>
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

	{#if !material}
		<div class="rounded-3xl border border-slate-200 bg-white p-12 text-center">
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500"
			>
				<BookOpen size={28} />
			</div>
			<h2 class="mb-2 text-xl font-bold text-slate-800">Materi Tidak Ditemukan</h2>
			<p class="mb-6 text-sm text-slate-500">
				Materi pelajaran yang Anda cari tidak tersedia atau telah dipindahkan.
			</p>
			<a
				href={resolve(ROUTES.learning)}
				class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
			>
				Lihat Semua Materi
			</a>
		</div>
	{:else}
		<!-- Main Detail Layout (Book / Detail Pattern) -->
		<div class="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
			<!-- Left Column: Thumbnail / Cover Showcase -->
			<div class="md:col-span-5 lg:col-span-4">
				<div class="sticky top-6">
					<div class="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
						<div
							class="relative mb-5 flex aspect-3/4 w-full flex-col items-center justify-center overflow-hidden rounded-2xl p-6 text-white shadow-inner {material.badgeWarna.includes(
								'primary'
							)
								? 'bg-linear-to-br from-primary-600 to-primary-800'
								: material.badgeWarna.includes('cyan')
									? 'bg-linear-to-br from-cyan-600 to-cyan-800'
									: material.badgeWarna.includes('emerald')
										? 'bg-linear-to-br from-emerald-600 to-emerald-800'
										: material.badgeWarna.includes('amber')
											? 'bg-linear-to-br from-amber-600 to-amber-800'
											: material.badgeWarna.includes('rose')
												? 'bg-linear-to-br from-rose-600 to-rose-800'
												: material.badgeWarna.includes('indigo')
													? 'bg-linear-to-br from-indigo-600 to-indigo-800'
													: 'bg-linear-to-br from-purple-600 to-purple-800'}"
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
									{material.mapel}
								</span>
								<p class="text-xs font-medium text-white/80">{material.durasi}</p>
							</div>
						</div>

						<!-- Action CTA Button -->
						<a
							href={resolve('/learning/[id]/read', { id: String(material.id) })}
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-bold text-white no-underline shadow-md transition-all hover:bg-primary-700 hover:shadow-lg"
						>
							<Sparkles size={18} />
							<span>Mulai Belajar / Read</span>
						</a>
					</div>
				</div>
			</div>

			<!-- Right Column: Metadata & Detailed Overview -->
			<div class="space-y-6 md:col-span-7 lg:col-span-8">
				<!-- Header info -->
				<div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<div class="flex items-center gap-2">
						<span class="rounded-full border px-3 py-1 text-xs font-semibold {material.badgeWarna}">
							{material.mapel}
						</span>
						<span class="flex items-center gap-1 text-xs font-medium text-slate-400">
							<Clock size={14} />
							{material.durasi}
						</span>
					</div>

					<h1 class="text-2xl leading-tight font-extrabold text-slate-900 sm:text-3xl">
						{material.judul}
					</h1>

					<p class="text-base leading-relaxed text-slate-600">
						{material.deskripsi}
					</p>

					<!-- Metadata bar -->
					<div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs sm:grid-cols-3">
						<div class="flex items-center gap-2 text-slate-600">
							<User size={16} class="shrink-0 text-primary-600" />
							<div>
								<p class="text-slate-400">Penyusun</p>
								<p class="font-medium text-slate-700">{material.author}</p>
							</div>
						</div>

						<div class="flex items-center gap-2 text-slate-600">
							<Calendar size={16} class="shrink-0 text-primary-600" />
							<div>
								<p class="text-slate-400">Update Terakhir</p>
								<p class="font-medium text-slate-700">{material.updatedAt}</p>
							</div>
						</div>

						<div class="col-span-2 flex items-center gap-2 text-slate-600 sm:col-span-1">
							<Eye size={16} class="shrink-0 text-primary-600" />
							<div>
								<p class="text-slate-400">Pembaca</p>
								<p class="font-medium text-slate-700">
									{material.dibaca.toLocaleString('id-ID')} orang
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Topics & Focus Areas -->
				{#if material.topics && material.topics.length > 0}
					<div class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
						<h2 class="text-base font-bold text-slate-800">Topik & Konsep Kunci</h2>
						<div class="flex flex-wrap gap-2">
							{#each material.topics as topic (topic)}
								<span
									class="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
								>
									#{topic}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Summary Box / Reading Prep -->
				<div class="space-y-3 rounded-3xl border border-primary-100 bg-primary-50/60 p-6 sm:p-8">
					<h2 class="flex items-center gap-2 text-base font-bold text-primary-900">
						<BookOpen size={18} class="text-primary-600" />
						Panduan Pembelajaran
					</h2>
					<ul class="list-inside list-disc space-y-2 text-sm text-primary-800/90">
						<li>Pelajari setiap bab secara berurutan untuk pemahaman maksimal.</li>
						<li>Catat poin-poin rumus dan konsep penting selama membaca.</li>
						<li>Gunakan fitur bookmark jika ingin menyimpan materi untuk diulas kembali.</li>
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>
