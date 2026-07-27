<script lang="ts">
	import { ChevronRight, ShieldCheck, CreditCard, UserCircle2, MessageCircle, CalendarDays, Sparkles, MapPin } from '@lucide/svelte';

	let nama = 'Alya Nur';
	let email = 'alya.nur@example.com';
	let sekolah = 'SMA Negeri 14 Jakarta';
	let statusAkun = 'Premium';
	let totalSesi = 72;
	let akurasi = 89;
	let soalSelesai = 482;
	let streak = 14;

	let tab = $state('profil');

	function pilihTab(pilihan: string) {
		tab = pilihan;
	}
</script>

<div class="space-y-8">

	<section class="rounded-3xl bg-white/90 border border-primary-100/70 shadow-sm p-6 md:p-8">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-4">
				<div class="h-16 w-16 rounded-3xl bg-primary-50 text-primary-700 grid place-items-center text-3xl font-bold">
					A
				</div>
				<div>
					<p class="text-sm text-slate-500">Halo,</p>
					<h1 class="text-3xl font-semibold text-slate-900">{nama}</h1>
					<p class="text-sm text-slate-500 mt-1">Kelola informasi akunmu dan pantau perkembangan belajar di sini.</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<div class="rounded-3xl bg-slate-50 p-4 text-center">
					<p class="text-3xl font-bold text-slate-900">{totalSesi}</p>
					<p class="text-xs uppercase tracking-[0.2em] text-slate-400 mt-2">Sesi</p>
				</div>
				<div class="rounded-3xl bg-slate-50 p-4 text-center">
					<p class="text-3xl font-bold text-slate-900">{akurasi}%</p>
					<p class="text-xs uppercase tracking-[0.2em] text-slate-400 mt-2">Akurasi</p>
				</div>
				<div class="rounded-3xl bg-slate-50 p-4 text-center">
					<p class="text-3xl font-bold text-slate-900">{soalSelesai}</p>
					<p class="text-xs uppercase tracking-[0.2em] text-slate-400 mt-2">Soal selesai</p>
				</div>
				<div class="rounded-3xl bg-slate-50 p-4 text-center">
					<p class="text-3xl font-bold text-slate-900">{streak} hari</p>
					<p class="text-xs uppercase tracking-[0.2em] text-slate-400 mt-2">Streak</p>
				</div>
			</div>
		</div>

		<div class="mt-8 grid gap-4 sm:grid-cols-3">
			<div class="rounded-3xl border border-slate-200 p-5 bg-slate-50">
				<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</p>
				<p class="mt-3 text-slate-900">{email}</p>
			</div>
			<div class="rounded-3xl border border-slate-200 p-5 bg-slate-50">
				<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sekolah</p>
				<p class="mt-3 text-slate-900">{sekolah}</p>
			</div>
			<div class="rounded-3xl border border-slate-200 p-5 bg-slate-50">
				<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status Akun</p>
				<p class="mt-3 text-primary-700 font-semibold">{statusAkun}</p>
			</div>
		</div>
	</section>

	<section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
		<div class="rounded-3xl bg-white/90 border border-primary-100/70 shadow-sm p-6 md:p-8">
			<div class="flex items-center justify-between gap-4 mb-6">
				<div>
					<h2 class="text-xl font-semibold text-slate-900">Pengaturan Akun</h2>
					<p class="text-sm text-slate-500">Perbarui detail profil, keamanan, dan preferensi.</p>
				</div>
				<button type="button" class="inline-flex items-center gap-2 rounded-3xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
					<UserCircle2 size="18" />
					Edit Profil
				</button>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				<button type="button" onclick={() => pilihTab('profil')} class="rounded-3xl border p-4 text-left transition {tab === 'profil' ? 'border-primary-300 bg-primary-50 shadow-sm' : 'border-slate-200 bg-white hover:border-primary-200'}">
					<p class="text-sm font-semibold text-slate-900">Detail Profil</p>
					<p class="text-xs text-slate-500 mt-2">Nama, email, sekolah, dan info dasar.</p>
				</button>
				<button type="button" onclick={() => pilihTab('keamanan')} class="rounded-3xl border p-4 text-left transition {tab === 'keamanan' ? 'border-primary-300 bg-primary-50 shadow-sm' : 'border-slate-200 bg-white hover:border-primary-200'}">
					<p class="text-sm font-semibold text-slate-900">Keamanan</p>
					<p class="text-xs text-slate-500 mt-2">Ubah password dan autentikasi.</p>
				</button>
				<button type="button" onclick={() => pilihTab('langganan')} class="rounded-3xl border p-4 text-left transition {tab === 'langganan' ? 'border-primary-300 bg-primary-50 shadow-sm' : 'border-slate-200 bg-white hover:border-primary-200'}">
					<p class="text-sm font-semibold text-slate-900">Langganan</p>
					<p class="text-xs text-slate-500 mt-2">Detail paket dan pembayaran.</p>
				</button>
				<button type="button" onclick={() => pilihTab('bantuan')} class="rounded-3xl border p-4 text-left transition {tab === 'bantuan' ? 'border-primary-300 bg-primary-50 shadow-sm' : 'border-slate-200 bg-white hover:border-primary-200'}">
					<p class="text-sm font-semibold text-slate-900">Bantuan</p>
					<p class="text-xs text-slate-500 mt-2">Akses panduan dan dukungan.</p>
				</button>
			</div>

			<div class="mt-6 rounded-3xl bg-slate-50 p-6 border border-slate-200">
				{#if tab === 'profil'}
					<div class="space-y-4">
						<div class="flex items-center gap-3">
							<UserCircle2 size="20" class="text-primary-700" />
							<div>
								<p class="text-sm font-semibold text-slate-900">Detail Profil</p>
								<p class="text-sm text-slate-500">Kelola nama dan informasi pribadi.</p>
							</div>
						</div>
						<p class="text-sm text-slate-600">Nama: <span class="font-semibold text-slate-900">{nama}</span></p>
						<p class="text-sm text-slate-600">Email: <span class="font-semibold text-slate-900">{email}</span></p>
						<p class="text-sm text-slate-600">Sekolah: <span class="font-semibold text-slate-900">{sekolah}</span></p>
						<button type="button" class="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-primary-700 border border-primary-200 hover:bg-primary-50">
							<ChevronRight size="16" />
							Perbarui Profil
						</button>
					</div>
				{:else if tab === 'keamanan'}
					<div class="space-y-4">
						<div class="flex items-center gap-3">
							<ShieldCheck size="20" class="text-primary-700" />
							<div>
								<p class="text-sm font-semibold text-slate-900">Keamanan Akun</p>
								<p class="text-sm text-slate-500">Gunakan kata sandi kuat dan aktifkan perlindungan ekstra.</p>
							</div>
						</div>
						<p class="text-sm text-slate-600">Kata sandi: <span class="font-semibold text-slate-900">••••••••••</span></p>
						<p class="text-sm text-slate-600">Autentikasi dua faktor: <span class="font-semibold text-slate-900">Nonaktif</span></p>
						<button type="button" class="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-primary-700 border border-primary-200 hover:bg-primary-50">
							<ChevronRight size="16" />
							Atur Keamanan
						</button>
					</div>
				{:else if tab === 'langganan'}
					<div class="space-y-4">
						<div class="flex items-center gap-3">
							<CreditCard size="20" class="text-primary-700" />
							<div>
								<p class="text-sm font-semibold text-slate-900">Langganan Premium</p>
								<p class="text-sm text-slate-500">Keuntungan belajar tanpa batas dan konten eksklusif.</p>
							</div>
						</div>
						<p class="text-sm text-slate-600">Tagihan berikutnya: <span class="font-semibold text-slate-900">12 Agustus 2026</span></p>
						<p class="text-sm text-slate-600">Metode pembayaran: <span class="font-semibold text-slate-900">Visa •••• 1234</span></p>
						<button type="button" class="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-primary-700 border border-primary-200 hover:bg-primary-50">
							<ChevronRight size="16" />
							Kelola Langganan
						</button>
					</div>
				{:else}
					<div class="space-y-4">
						<div class="flex items-center gap-3">
							<MessageCircle size="20" class="text-primary-700" />
							<div>
								<p class="text-sm font-semibold text-slate-900">Bantuan Cepat</p>
								<p class="text-sm text-slate-500">Butuh bantuan? Lihat FAQ atau hubungi tim support.</p>
							</div>
						</div>
						<p class="text-sm text-slate-600">Panduan penggunaan: <span class="font-semibold text-slate-900">Tersedia</span></p>
						<p class="text-sm text-slate-600">Respon support: <span class="font-semibold text-slate-900">1-2 hari kerja</span></p>
						<button type="button" class="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-primary-700 border border-primary-200 hover:bg-primary-50">
							<ChevronRight size="16" />
							Hubungi Support
						</button>
					</div>
				{/if}
			</div>
		</div>

		<div class="space-y-6">
			<div class="rounded-3xl bg-white/90 border border-primary-100/70 shadow-sm p-6 md:p-8">
				<div class="flex items-center justify-between gap-4 mb-4">
					<div>
						<p class="text-sm uppercase tracking-[0.2em] text-slate-400">Catatan Cepat</p>
						<h2 class="text-lg font-semibold text-slate-900">Ringkasan akun</h2>
					</div>
					<span class="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Akun aktif</span>
				</div>

				<div class="grid gap-3">
					<div class="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
						<CalendarDays size="20" class="text-primary-700" />
						<div>
							<p class="text-sm font-semibold text-slate-900">Jadwal belajar</p>
							<p class="text-sm text-slate-500">Senin - Jumat ⸱ 17.00 - 18.30</p>
						</div>
					</div>
					<div class="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
						<Sparkles size="20" class="text-primary-700" />
						<div>
							<p class="text-sm font-semibold text-slate-900">Pencapaian terbaru</p>
							<p class="text-sm text-slate-500">Mencapai 89% akurasi dalam 3 hari terakhir.</p>
						</div>
					</div>
					<div class="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
						<MapPin size="20" class="text-primary-700" />
						<div>
							<p class="text-sm font-semibold text-slate-900">Tingkatkan aktivitas</p>
							<p class="text-sm text-slate-500">Tambah 1 sesi lagi untuk mempertahankan streak.</p>
						</div>
					</div>
				</div>
			</div>

			<div class="rounded-3xl bg-white/90 border border-primary-100/70 shadow-sm p-6 md:p-8">
				<div class="flex items-center justify-between gap-4 mb-4">
					<div>
						<p class="text-sm uppercase tracking-[0.2em] text-slate-400">Riwayat</p>
						<h2 class="text-lg font-semibold text-slate-900">Aktivitas terbaru</h2>
					</div>
					<button type="button" class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
						Lihat semua
						<ChevronRight size="18" />
					</button>
				</div>

				<ul class="space-y-3">
					<li class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
						<p class="text-sm font-semibold text-slate-900">Memulai modul Matematika</p>
						<p class="text-sm text-slate-500">1 jam lalu · Modul Topik Aljabar</p>
					</li>
					<li class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
						<p class="text-sm font-semibold text-slate-900">Mencapai streak 14 hari</p>
						<p class="text-sm text-slate-500">Kemarin · Konsistensi belajar</p>
					</li>
					<li class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
						<p class="text-sm font-semibold text-slate-900">Pembaruan email</p>
						<p class="text-sm text-slate-500">2 hari lalu · Email diperbarui</p>
					</li>
				</ul>
			</div>
		</div>
	</section>

</div>
