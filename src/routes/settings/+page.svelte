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

	<h1 class="text-2xl font-bold text-slate-800 mb-8">Pengaturan</h1>

	<!-- Section: Profil -->
	<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
		<h2 class="text-sm font-semibold text-slate-500 mb-4">Profil</h2>

		<div class="flex items-center gap-4 mb-5">
			<span class="h-16 w-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
				<User size={28} />
			</span>
			<div>
				<p class="font-semibold text-slate-800">{nama}</p>
				<p class="text-sm text-slate-400">{email}</p>
			</div>
		</div>

		<label for="namaInput" class="block text-xs font-medium text-slate-500 mb-1.5">Nama Tampilan</label>
		<input
			id="namaInput"
			type="text"
			bind:value={nama}
			class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
		/>
	</div>

	<!-- Section: Preferensi -->
	<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
		<h2 class="text-sm font-semibold text-slate-500 mb-4">Preferensi</h2>

		<div class="flex items-center justify-between py-3 border-b border-slate-100">
			<div class="flex items-center gap-3">
				<Moon size={18} class="text-slate-400" />
				<p class="text-sm text-slate-700">Mode Gelap</p>
			</div>
            <button
                onclick={toggleDarkMode}
                type="button"
                aria-label="Aktifkan mode gelap"
                class="relative w-11 h-6 rounded-full transition-colors {isDarkMode ? 'bg-primary-600' : 'bg-slate-200'}">
                <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform {isDarkMode ? 'translate-x-5' : 'translate-x-0'}"></span>
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
				class="relative w-11 h-6 rounded-full transition-colors {isNotifAktif ? 'bg-primary-600' : 'bg-slate-200'}">
				<span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform {isNotifAktif ? 'translate-x-5' : 'translate-x-0'}"></span>
			</button>
		</div>
	</div>

	<!-- Section: Akun -->
	<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
		<h2 class="text-sm font-semibold text-slate-500 mb-4">Akun</h2>

		<button type="button" class="w-full flex items-center gap-3 py-3 border-b border-slate-100 text-sm text-slate-700 hover:text-primary-700">
			<KeyRound size={18} class="text-slate-400" />
			Ganti Kata Sandi
		</button>

		<button type="button" class="w-full flex items-center gap-3 py-3 text-sm text-red-600 hover:text-red-700">
			<LogOut size={18} />
			Keluar
		</button>
	</div>

</div>