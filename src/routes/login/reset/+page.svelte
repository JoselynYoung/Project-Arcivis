<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { supabase } from '$lib/services/supabaseClient';
	import { updatePassword } from '$lib/services/auth';

	let password = $state('');
	let confirm = $state('');
	let message = $state('');
	let busy = $state(false);
	let ready = $state(false);
	let done = $state(false);

	$effect(() => {
		const { data: listener } = supabase.auth.onAuthStateChange((event) => {
			if (event === 'PASSWORD_RECOVERY') {
				ready = true;
			}
		});
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) ready = true;
		});
		return () => {
			listener.subscription.unsubscribe();
		};
	});

	async function submit(event: Event) {
		event.preventDefault();
		if (busy) return;

		if (password.length < 6) {
			message = 'Kata sandi terlalu pendek (minimal 6 karakter).';
			return;
		}

		if (password !== confirm) {
			message = 'Konfirmasi kata sandi tidak sama.';
			return;
		}

		busy = true;
		message = '';

		const { error } = await updatePassword(password);

		busy = false;

		if (error) {
			message = error;
			return;
		}

		done = true;
		await supabase.auth.signOut();
	}
</script>

<div class="mx-auto w-full max-w-md py-8">
	<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
		<h1 class="mb-1 text-xl font-bold text-slate-800">Buat kata sandi baru</h1>
		<p class="mb-6 text-sm text-slate-500">Masukkan kata sandi pengganti untuk akunmu.</p>

		{#if done}
			<p class="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700" role="alert">
				Kata sandi berhasil diganti. Silakan masuk kembali.
			</p>
			<button
				type="button"
				onclick={() => goto(resolve('/login'))}
				class="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700"
			>
				Ke halaman masuk
			</button>
		{:else if !ready}
			<p class="text-sm text-slate-500">Menyiapkan tautan pemulihan...</p>
		{:else}
			{#if message}
				<p class="mb-4 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-700" role="alert">
					{message}
				</p>
			{/if}

			<form onsubmit={submit} class="flex flex-col gap-4">
				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Kata sandi baru
					<input
						type="password"
						required
						minlength={6}
						bind:value={password}
						autocomplete="new-password"
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
				</label>
				<label class="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
					Ulangi kata sandi
					<input
						type="password"
						required
						minlength={6}
						bind:value={confirm}
						autocomplete="new-password"
						class="focus:border-primary-500 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
					/>
				</label>
				<button
					type="submit"
					disabled={busy}
					class="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400"
				>
					{busy ? 'Menyimpan...' : 'Simpan kata sandi'}
				</button>
			</form>
		{/if}
	</div>
</div>
