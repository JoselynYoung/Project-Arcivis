<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Bell, Moon, LogOut, KeyRound } from '@lucide/svelte';
	import { signOut } from '$lib/services/auth';

	// Preference Toggles (local-only by design: dark mode is cosmetic,
	// reminders have no backend yet)
	let isDarkMode = $state(false);
	let isNotifAktif = $state(true);

	async function logout() {
		await signOut();
		await goto(resolve('/'));
	}

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
	}

	function toggleNotif() {
		isNotifAktif = !isNotifAktif;
	}
</script>

<div class="w-full max-w-2xl">
	<!-- Preference Section -->
	<div class="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
		<h2 class="mb-4 text-sm font-semibold text-slate-500">Preferensi</h2>

		<div class="flex items-center justify-between border-b border-slate-100 py-3">
			<div class="flex items-center gap-3">
				<Moon size={18} class="text-slate-400" />
				<p class="text-sm text-slate-700">Mode Gelap</p>
			</div>
			<button
				onclick={toggleDarkMode}
				type="button"
				role="switch"
				aria-checked={isDarkMode}
				aria-label="Aktifkan mode gelap"
				class="relative h-6 w-11 rounded-full transition-colors {isDarkMode
					? 'bg-primary-600'
					: 'bg-slate-200'}"
			>
				<span
					class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform {isDarkMode
						? 'translate-x-5'
						: 'translate-x-0'}"
				></span>
			</button>
		</div>

		<div class="flex items-center justify-between py-3">
			<div class="flex items-center gap-3">
				<Bell size={18} class="text-slate-400" />
				<p class="text-sm text-slate-700">Pengingat Belajar Harian</p>
			</div>
			<button
				onclick={toggleNotif}
				type="button"
				role="switch"
				aria-checked={isNotifAktif}
				aria-label="Aktifkan pengingat belajar harian"
				class="relative h-6 w-11 rounded-full transition-colors {isNotifAktif
					? 'bg-primary-600'
					: 'bg-slate-200'}"
			>
				<span
					class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform {isNotifAktif
						? 'translate-x-5'
						: 'translate-x-0'}"
				></span>
			</button>
		</div>
	</div>

	<!-- Account Section -->
	<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
		<h2 class="mb-4 text-sm font-semibold text-slate-500">Akun</h2>

		<button
			type="button"
			onclick={() => goto(resolve('/login/reset'))}
			class="flex w-full items-center gap-3 border-b border-slate-100 py-3 text-sm text-slate-700 hover:text-primary-700"
		>
			<KeyRound size={18} class="text-slate-400" />
			Ganti Kata Sandi
		</button>

		<button
			type="button"
			onclick={logout}
			class="flex w-full items-center gap-3 py-3 text-sm text-red-600 hover:text-red-700"
		>
			<LogOut size={18} />
			Keluar
		</button>
	</div>
</div>
