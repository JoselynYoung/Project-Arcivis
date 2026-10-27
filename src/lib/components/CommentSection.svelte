<script lang="ts">
	import { MessageCircle } from '@lucide/svelte';
	import AuthNotice from '$lib/components/AuthNotice.svelte';
	import { getComments, addComment, deleteComment, type Comment } from '$lib/services/comments';

	let { contentId }: { contentId: string } = $props();

	let comments = $state<Comment[]>([]);
	let draft = $state('');
	let authNotice = $state(false);
	let posting = $state(false);

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});

	$effect(() => {
		let cancelled = false;
		getComments(contentId).then(({ data, error }) => {
			if (error) console.error('Failed to load comments:', error);
			if (cancelled) return;
			comments = data;
		});
		return () => {
			cancelled = true;
		};
	});

	async function submit() {
		if (posting || draft.trim().length === 0) return;
		posting = true;

		const { data, error } = await addComment(contentId, draft);

		posting = false;

		if (error) {
			console.error('Failed to add comment:', error);
			if (error === 'Not signed in') authNotice = true;
			return;
		}

		if (data) {
			comments = [...comments, data];
			draft = '';
		}
	}

	async function remove(id: string) {
		const { error } = await deleteComment(id);

		if (error) {
			console.error('Failed to delete comment:', error);
			return;
		}

		comments = comments.filter((comment) => comment.id !== id);
	}
</script>

<section
	aria-label="Komentar"
	class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
>
	<h2 class="mb-2 flex items-center gap-2.5 text-lg font-bold text-slate-800">
		<MessageCircle size={18} class="text-primary-600" /> Komentar ({comments.length})
	</h2>

	{#if comments.length === 0}
		<p class="mb-6 text-sm text-slate-500">Belum ada komentar. Jadilah yang pertama.</p>
	{:else}
		<div class="mb-6 divide-y divide-slate-100">
			{#each comments as comment (comment.id)}
				<div class="py-4 first:pt-2 last:pb-0">
					<div class="mb-1 flex items-center justify-between gap-2">
						<p class="text-sm font-semibold text-slate-800">
							{comment.authorName}
							<span class="ml-2 font-normal text-slate-400">
								{dateFormatter.format(new Date(comment.createdAt))}
							</span>
						</p>
						<button
							type="button"
							onclick={() => remove(comment.id)}
							aria-label="Hapus komentar"
							class="shrink-0 text-xs text-slate-400 transition-colors hover:text-red-600"
						>
							Hapus
						</button>
					</div>
					<p class="text-sm leading-relaxed text-slate-600">{comment.body}</p>
				</div>
			{/each}
		</div>
	{/if}

	{#if authNotice}
		<AuthNotice message="Komentar belum tersimpan. Masuk untuk ikut diskusi." />
	{/if}

	<div class="flex flex-col gap-3 border-t border-slate-100 pt-5">
		<textarea
			bind:value={draft}
			rows="3"
			maxlength="2000"
			placeholder="Tulis komentar..."
			aria-label="Tulis komentar"
			class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 shadow-inner placeholder:text-slate-400 focus:bg-white focus:outline-none"
		></textarea>
		<button
			type="button"
			onclick={submit}
			disabled={posting || draft.trim().length === 0}
			class="self-end rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400"
		>
			{posting ? 'Mengirim...' : 'Kirim'}
		</button>
	</div>
</section>
