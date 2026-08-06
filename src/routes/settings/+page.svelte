<script lang="ts">
	import { User, Bell, Moon, LogOut, KeyRound } from '@lucide/svelte';

	let nama = $state('Pejuang');
	let email = 'pejuang@email.com';

	// Preferensi (toggle switch)
	let isDarkMode = $state(false);
	let isNotifAktif = $state(true);

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
	}

	function toggleNotif() {
		isNotifAktif = !isNotifAktif;
	}
</script>

<div class="w-full max-w-2xl">
	<h1 class="mb-8 text-2xl font-bold text-slate-800">Pengaturan</h1>

	<!-- Section: Profil -->
	<div class="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
		<h2 class="mb-4 text-sm font-semibold text-slate-500">Profil</h2>

		<div class="mb-5 flex items-center gap-4">
			<span
				class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700"
			>
				<User size={28} />
			</span>
			<div>
				<p class="font-semibold text-slate-800">{nama}</p>
				<p class="text-sm text-slate-400">{email}</p>
			</div>
		</div>

		<label for="namaInput" class="mb-1.5 block text-xs font-medium text-slate-500"
			>Nama Tampilan</label
		>
		<input
			id="namaInput"
			type="text"
			bind:value={nama}
			class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-600 focus:outline-none"
		/>
	</div>

	<!-- Section: Preferensi -->
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

	<!-- Section: Akun -->
	<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
		<h2 class="mb-4 text-sm font-semibold text-slate-500">Akun</h2>

		<button
			type="button"
			class="flex w-full items-center gap-3 border-b border-slate-100 py-3 text-sm text-slate-700 hover:text-primary-700"
		>
			<KeyRound size={18} class="text-slate-400" />
			Ganti Kata Sandi
		</button>

		<button
			type="button"
			class="flex w-full items-center gap-3 py-3 text-sm text-red-600 hover:text-red-700"
		>
			<LogOut size={18} />
			Keluar
		</button>
	</div>
</div>
