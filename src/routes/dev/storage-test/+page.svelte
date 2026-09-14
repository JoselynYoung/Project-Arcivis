<script lang="ts">
	import { supabase } from '$lib/services/supabaseClient';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let session = $state<import('@supabase/supabase-js').Session | null>(null);
	let currentUserId = $state<string | null>(null);
	let isLoading = $state(false);
	let message = $state<string | null>(null);
	let uploadedFile = $state<{ path: string; publicUrl: string; name: string } | null>(null);
	let selectedFile = $state<File | null>(null);

	async function loadSession() {
		const { data } = await supabase.auth.getSession();
		session = data.session;
	}

	onMount(() => {
		loadSession();
		const { data: listener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
			session = newSession;
		});
		return () => listener?.subscription.unsubscribe();
	});

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			selectedFile = input.files[0];
		}
	}

	async function handleUpload() {
		if (!session?.user) {
			message = 'Please log in first.';
			return;
		}
		if (!selectedFile) {
			message = 'Please select a file first.';
			return;
		}

		message = null;
		const file = selectedFile;
		const timestamp = Date.now();
		const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
		const path = `${session.user.id}/${timestamp}-${safeName}`;

		try {
			const { data, error } = await supabase.storage.from('content-covers').upload(path, file, {
				cacheControl: '3600',
				upsert: false
			});

			if (error) {
				throw error;
			}

			const { data: publicUrlData } = supabase.storage
				.from('content-covers')
				.getPublicUrl(data.path);

			uploadedFile = {
				path: data.path,
				publicUrl: publicUrlData.publicUrl,
				name: file.name
			};
			selectedFile = null;
		} catch (e: any) {
			message = `Upload failed: ${e.message}`;
		}
	}

	async function handleDelete() {
		if (!uploadedFile || !session?.user) return;

		try {
			const { error } = await supabase.storage.from('content-covers').remove([uploadedFile.path]);

			if (error) {
				throw error;
			}

			uploadedFile = null;
		} catch (e: any) {
			message = `Delete failed: ${e.message}`;
		}
	}

	async function testAnonymousUpload() {
		// Sign out first to test anonymous
		await supabase.auth.signOut();
		try {
			const testFile = new File(['test'], 'test.png', { type: 'image/png' });
			const path = `anonymous/test.png`;
			const { error } = await supabase.storage.from('content-covers').upload(path, testFile);
			return { error: error?.message ?? null };
		} catch (e: any) {
			return { error: e.message };
		}
	}
</script>

<div class="mx-auto w-full max-w-2xl px-4 py-8">
	<h1 class="mb-8 text-center text-2xl font-bold text-slate-800">Storage Test — Content Covers</h1>

	{#if !session}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
			<p class="mb-4 text-amber-800">
				Please log in first at <a href="/dev/auth-test" class="underline">/dev/auth-test</a>
			</p>
			<button
				onclick={testAnonymousUpload}
				class="rounded-xl bg-slate-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
			>
				Test Anonymous Upload (should fail)
			</button>
		</div>
	{:else}
		<div class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
			<p class="font-semibold text-emerald-800">Logged in as {session.user?.email}</p>
			<p class="font-mono text-sm text-emerald-700">UID: {session.user?.id}</p>
		</div>

		<div class="space-y-8">
			<!-- Upload Section -->
			<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-slate-800">Upload Cover Image</h2>
				<p class="mb-4 text-sm text-slate-600">Max 2MB. Allowed: PNG, JPEG, WebP.</p>
				<div class="space-y-4">
					<input
						type="file"
						accept="image/png,image/jpeg,image/webp"
						onchange={handleFileSelect}
						class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-primary-600 focus:outline-none"
					/>
					<button
						onclick={handleUpload}
						disabled={!selectedFile}
						class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
					>
						Upload
					</button>
				</div>
			</div>

			{#if uploadedFile}
				<!-- Display Uploaded Image -->
				<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-slate-800">
						Uploaded Image (Public Read Test)
					</h2>
					<p class="mb-2 text-sm text-slate-600">
						If the image below renders, public read policy works.
					</p>
					<div class="mb-4">
						<img
							src={uploadedFile.publicUrl}
							alt={uploadedFile.name}
							class="max-h-64 max-w-full rounded-lg border border-slate-200"
						/>
					</div>
					<div class="mb-4 rounded-lg bg-slate-50 p-4 font-mono text-sm whitespace-pre-wrap">
						<strong>Public URL:</strong>
						{uploadedFile.publicUrl}
					</div>
					<button
						onclick={handleDelete}
						class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
					>
						Delete File
					</button>
				</div>
			{/if}

			<!-- Anonymous Test Result -->
			<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-slate-800">Anonymous Upload Test</h2>
				<p class="mb-4 text-sm text-slate-600">Test that anonymous users cannot upload.</p>
				<button
					onclick={async () => {
						try {
							const testFile = new File(['test'], 'test.png', { type: 'image/png' });
							const path = `anonymous/test.png`;
							const { error } = await supabase.storage
								.from('content-covers')
								.upload(path, testFile);
							if (error) {
								alert('Expected error (anonymous): ' + error.message);
							} else {
								alert('ERROR: Anonymous upload succeeded (should fail)');
							}
						} catch (e: any) {
							alert('Expected error (anonymous): ' + e.message);
						}
					}}
					class="rounded-xl bg-slate-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
				>
					Test Anonymous Upload (should fail)
				</button>
			</div>
		</div>
	{/if}
</div>
