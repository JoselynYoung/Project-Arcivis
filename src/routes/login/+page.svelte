<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { LogIn, UserPlus, LogOut } from '@lucide/svelte';
	import { supabase } from '$lib/services/supabaseClient';
	import { signIn, signUp, signOut } from '$lib/services/auth';

	let email = $state('');
	let password = $state('');
	let mode = $state<'masuk' | 'daftar'>('masuk');
	let message = $state('');
	let busy = $state(false);
	let accountEmail = $state<string | null>(null);

	$effect(() => {
		supabase.auth.getSession().then(({ data }) => {
			accountEmail = data.session?.user.email ?? null;
		});
		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			accountEmail = session?.user.email ?? null;
		});
		return () => {
			listener.subscription.unsubscribe();
		};
	});

	async function submit(event: Event) {
		event.preventDefault();
		if (busy) return;
		busy = true;
		message = '';

		const { error } =
			mode === 'masuk' ? await signIn(email, password) : await signUp(email, password);

		busy = false;

		if (error) {
			message = error;
			return;
		}

		if (mode === 'daftar') {
			message = 'Pendaftaran berhasil. Silakan masuk.';
			mode = 'masuk';
			return;
		}

		await goto(resolve('/'));
	}

	async function logout() {
		await signOut();
		accountEmail = null;
	}
</script>

<div class="mx-auto w-full max-w-md py-8">
	<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
		{#if accountEmail}
			<h1 class="mb-2 text-xl font-bold text-slate-800">Sudah masuk</h1>
			<p class="mb-6 text-sm text-slate-500">{accountEmail}</p>
			<button
				type="button"
				onclick={logout}
				class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
			>
				<LogOut size={16} /> Keluar
			</button>
		{:else}
			<h1 class="mb-1 text-xl font-bold text-slate-800">
				{mode === 'masuk' ? 'Masuk ke Arcivis' : 'Daftar akun Arcivis'}
			</h1>
			<p class="mb-6 text-sm text-slate-500">
				{mode === 'masuk'
					? 'Simpan bookmark, nilai, dan komentar atas namamu.'
					: 'Satu akun untuk semua fitur Arcivis.'}
			</p>

			<div class="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
				<button
					type="button"
					onclick={() => {
						mode = 'masuk';
						message = '';
					}}
					aria-pressed={mode === 'masuk'}
					class="flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-colors {mode ===
					'masuk'
						? 'bg-white text-slate-800 shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					<LogIn size={15} /> Masuk
				</button>
				<button
					type="button"
					onclick={() => {
						mode = 'daftar';
						message = '';
					}}
					aria-pressed={mode === 'daftar'}
					class="flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-colors {mode ===
					'daftar'
						? 'bg-white text-slate-800 shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					<UserPlus size={15} /> Daftar
				</button>
			</div>

			{#if message}
				<p class="mb-4 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-700" role="alert">
					{message}
				</p>
			{/if}

			<form onsubmit={submit} class="flex flex-col gap-4">
				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Email
					<input
						type="email"
						required
						bind:value={email}
						placeholder="nama@email.com"
						autocomplete="email"
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
				</label>
				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Kata sandi
					<input
						type="password"
						required
						minlength={6}
						bind:value={password}
						placeholder="Minimal 6 karakter"
						autocomplete={mode === 'masuk' ? 'current-password' : 'new-password'}
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
				</label>
				<button
					type="submit"
					disabled={busy}
					class="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400"
				>
					{busy ? 'Memproses...' : mode === 'masuk' ? 'Masuk' : 'Daftar'}
				</button>
			</form>
		{/if}
	</div>
</div>
