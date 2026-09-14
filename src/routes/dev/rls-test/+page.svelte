<script lang="ts">
	import { supabase } from '$lib/services/supabaseClient';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let session = $state<import('@supabase/supabase-js').Session | null>(null);
	let currentUserId = $state<string | null>(null);
	let isLoading = $state(false);
	let results = $state<
		Record<string, { data: unknown; error: { message: string } | string | null }>
	>({});

	async function loadSession() {
		const { data } = await supabase.auth.getSession();
		session = data.session;
		currentUserId = session?.user?.id ?? null;
	}

	onMount(() => {
		loadSession();
		const { data: listener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
			session = newSession;
			currentUserId = newSession?.user?.id ?? null;
		});
		return () => listener?.subscription.unsubscribe();
	});

	async function runTest(
		name: string,
		fn: () => Promise<{ data: unknown; error: { message: string } | string | null }>
	) {
		if (!currentUserId) {
			results = { ...results, [name]: { data: null, error: 'Not logged in' } };
			return;
		}
		isLoading = true;
		try {
			const result = await fn();
			results = { ...results, [name]: { data: result.data, error: result.error } };
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : String(e);
			results = { ...results, [name]: { data: null, error: message } };
		} finally {
			isLoading = false;
		}
	}

	async function testRoleEscalation() {
		if (!currentUserId) throw new Error('Not logged in');
		const { data, error } = await supabase
			.from('profiles')
			.update({ role: 'admin' })
			.eq('id', currentUserId)
			.select();
		return { data, error: error ? { message: error.message } : null };
	}

	async function testBookmarkIsolation() {
		const { data, error } = await supabase.from('bookmarks').select('*');
		return { data, error: error ? { message: error.message } : null };
	}

	async function testAttemptsIsolation() {
		const { data, error } = await supabase.from('attempts').select('*');
		return { data, error: error ? { message: error.message } : null };
	}
</script>

<div class="mx-auto w-full max-w-2xl px-4 py-8">
	<h1 class="mb-8 text-center text-2xl font-bold text-slate-800">RLS Security Test</h1>

	{#if !session}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
			<p class="text-amber-800">
				Please log in first at <a href={resolve('/dev/auth-test')} class="underline"
					>/dev/auth-test</a
				>
			</p>
		</div>
	{:else}
		<div class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
			<p class="font-semibold text-emerald-800">Logged in as {session.user?.email}</p>
			<p class="font-mono text-sm text-emerald-700">UID: {currentUserId}</p>
		</div>

		<div class="space-y-8">
			<!-- Test A: Self Role Escalation -->
			<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-slate-800">Test A — Self Role Escalation</h2>
				<p class="mb-4 text-sm text-slate-600">
					Attempt to change own role to <code class="rounded bg-slate-100 px-1.5 py-0.5">admin</code
					> via client update.
				</p>
				<button
					onclick={() => runTest('roleEscalation', testRoleEscalation)}
					disabled={isLoading}
					class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
				>
					{isLoading ? 'Testing...' : 'Test Become Admin'}
				</button>

				{#if results.roleEscalation}
					<div
						class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm whitespace-pre-wrap"
					>
						<strong>Error:</strong>
						{typeof results.roleEscalation.error === 'string'
							? results.roleEscalation.error
							: (results.roleEscalation.error?.message ?? 'None')}
						<br />
						<strong>Data:</strong>
						{JSON.stringify(results.roleEscalation.data, null, 2)}
					</div>
				{/if}
			</div>

			<!-- Test B: Bookmark Isolation -->
			<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-slate-800">Test B — Bookmark Isolation</h2>
				<p class="mb-4 text-sm text-slate-600">
					Query all bookmarks. Should only return current user's bookmarks.
				</p>
				<button
					onclick={() => runTest('bookmarkIsolation', testBookmarkIsolation)}
					disabled={isLoading}
					class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
				>
					{isLoading ? 'Testing...' : 'Test My Bookmarks'}
				</button>

				{#if results.bookmarkIsolation}
					<div
						class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm whitespace-pre-wrap"
					>
						<strong>Error:</strong>
						{typeof results.bookmarkIsolation.error === 'string'
							? results.bookmarkIsolation.error
							: (results.bookmarkIsolation.error?.message ?? 'None')}
						<br />
						<strong>Data:</strong>
						{JSON.stringify(results.bookmarkIsolation.data, null, 2)}
					</div>
				{/if}
			</div>

			<!-- Test C: Attempts Isolation -->
			<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-slate-800">Test C — Attempts Isolation</h2>
				<p class="mb-4 text-sm text-slate-600">
					Query all attempts. Should only return current user's attempts.
				</p>
				<button
					onclick={() => runTest('attemptsIsolation', testAttemptsIsolation)}
					disabled={isLoading}
					class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
				>
					{isLoading ? 'Testing...' : 'Test My Attempts'}
				</button>

				{#if results.attemptsIsolation}
					<div
						class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm whitespace-pre-wrap"
					>
						<strong>Error:</strong>
						{typeof results.attemptsIsolation.error === 'string'
							? results.attemptsIsolation.error
							: (results.attemptsIsolation.error?.message ?? 'None')}
						<br />
						<strong>Data:</strong>
						{JSON.stringify(results.attemptsIsolation.data, null, 2)}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
