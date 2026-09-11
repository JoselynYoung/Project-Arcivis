<script lang="ts">
	import { supabase } from '$lib/services/supabaseClient';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let message = $state('');
	let isLoading = $state(false);

	let session = $state<import('@supabase/supabase-js').Session | null>(null);
	let profile = $state<{ id: string; name: string; role: string } | null>(null);

	async function loadSession() {
		const { data } = await supabase.auth.getSession();
		session = data.session;
		if (session?.user) {
			await loadProfile(session.user.id);
		}
	}

	async function loadProfile(userId: string) {
		const { data } = await supabase
			.from('profiles')
			.select('id, name, role')
			.eq('id', userId)
			.single();
		profile = data;
	}

	async function handleSignup(e: Event) {
		e.preventDefault();
		message = '';
		isLoading = true;
		const { error } = await supabase.auth.signUp({ email, password });
		isLoading = false;
		if (error) {
			message = `Signup error: ${error.message}`;
		} else {
			message = 'Signup successful! Please check your email to confirm, then log in.';
		}
	}

	async function handleLogin(e: Event) {
		e.preventDefault();
		message = '';
		isLoading = true;
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		isLoading = false;
		if (error) {
			message = `Login error: ${error.message}`;
		} else {
			session = data.session;
			if (data.session?.user) {
				await loadProfile(data.session.user.id);
			}
			message = 'Logged in successfully!';
		}
	}

	async function handleLogout() {
		message = '';
		await supabase.auth.signOut();
		session = null;
		profile = null;
		message = 'Logged out successfully.';
	}

	onMount(() => {
		loadSession();
		const { data: listener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
			session = newSession;
			if (newSession?.user) {
				await loadProfile(newSession.user.id);
			} else {
				profile = null;
			}
		});
		return () => listener?.subscription.unsubscribe();
	});
</script>

<div class="mx-auto w-full max-w-md px-4 py-12">
	<h1 class="mb-8 text-center text-2xl font-bold text-slate-800">Dev Auth Test</h1>

	{#if session}
		<div class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
			<p class="mb-2 font-semibold text-emerald-800">Logged in</p>
			<p class="mb-1 font-mono text-sm text-emerald-700">{session.user?.email}</p>
			<p class="mb-1 font-mono text-sm text-emerald-700">UID: {session.user?.id}</p>
			{#if profile}
				<div class="mt-4 rounded-lg bg-emerald-100 p-4 text-left">
					<p class="font-medium text-emerald-800">Profile from DB:</p>
					<p class="text-sm text-emerald-700">Name: {profile.name}</p>
					<p class="text-sm text-emerald-700">Role: {profile.role}</p>
					<p class="text-sm text-emerald-700">ID: {profile.id}</p>
				</div>
			{/if}
			<button
				onclick={handleLogout}
				class="mt-4 w-full rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
			>
				Logout
			</button>
		</div>
	{:else}
		<div class="space-y-6">
			<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-slate-800">Sign Up</h2>
				<form onsubmit={handleSignup} class="space-y-3">
					<div>
						<label for="signup-email" class="mb-1 block text-sm font-medium text-slate-700"
							>Email</label
						>
						<input
							id="signup-email"
							type="email"
							bind:value={email}
							required
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-primary-600 focus:outline-none"
						/>
					</div>
					<div>
						<label for="signup-password" class="mb-1 block text-sm font-medium text-slate-700"
							>Password</label
						>
						<input
							id="signup-password"
							type="password"
							bind:value={password}
							required
							minlength={6}
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-primary-600 focus:outline-none"
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						class="w-full rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
					>
						{isLoading ? 'Signing up...' : 'Sign Up'}
					</button>
				</form>
			</div>

			<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-slate-800">Log In</h2>
				<form onsubmit={handleLogin} class="space-y-3">
					<div>
						<label for="login-email" class="mb-1 block text-sm font-medium text-slate-700"
							>Email</label
						>
						<input
							id="login-email"
							type="email"
							bind:value={email}
							required
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-primary-600 focus:outline-none"
						/>
					</div>
					<div>
						<label for="login-password" class="mb-1 block text-sm font-medium text-slate-700"
							>Password</label
						>
						<input
							id="login-password"
							type="password"
							bind:value={password}
							required
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-primary-600 focus:outline-none"
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						class="w-full rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
					>
						{isLoading ? 'Logging in...' : 'Log In'}
					</button>
				</form>
			</div>
		</div>
	{/if}

	{#if message}
		<div
			class="mt-6 rounded-xl p-4 text-center text-sm {message.startsWith('Error') ||
			message.startsWith('Signup error') ||
			message.startsWith('Login error')
				? 'border-red-200 bg-red-50 text-red-700'
				: 'border-emerald-200 bg-emerald-50 text-emerald-700'}"
		>
			{message}
		</div>
	{/if}
</div>
