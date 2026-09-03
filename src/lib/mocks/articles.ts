export interface Article {
	id: number;
	judul: string;
	deskripsi: string;
	kategori: string; // e.g. "Opini", "Tips Belajar", "Berita Kampus"
	author: string;
	updatedAt: string;
	dibaca: number;
	badgeWarna: string;
	isBookmark?: boolean;
	topics?: string[];
	konten: string; // full article content (plain text with \n paragraphs)
}

export const articles: Article[] = [
	{
		id: 1,
		judul: 'Mengapa Kita Sulit Fokus Belajar di Era Distraksi Digital',
		deskripsi:
			'Ulasan singkat soal dopamin, notifikasi, dan cara otak kita memproses gangguan saat belajar.',
		kategori: 'Opini',
		author: 'Rahmat W.',
		updatedAt: '15 Jul 2026',
		dibaca: 1420,
		badgeWarna: 'bg-primary-50 text-primary-700 border-primary-200',
		isBookmark: true,
		topics: ['fokus', 'distraksi digital', 'dopamin'],
		konten: `Pernah tidak ketika kamu baru mau membuka materi, tanganmu lebih dulu menyentuh notifikasi? Kamu cuma berniat mengecek satu pesan, lalu satu jam kemudian masih menggulir layar. Sebagian besar dari kita tidak kekurangan niat untuk belajar, melainkan kalah bersaing dengan rangsangan yang lebih cepat dan lebih menyenangkan bagi otak.

Setiap notifikasi, likes, dan scrolling pendek memicu pelepasan dopamin, zat di otak yang membuat kita terus ingin mengulang. Fokus bukan cuma soal kemauan, tapi soal seberapa sering otak tergoda untuk beralih. Makin sering kita berhenti di tengah membaca untuk mengecek ponsel, makin terbiasa otak kita mencari alasan menghindari tugas yang butuh usaha.

Ada beberapa cara yang bisa dicoba untuk mengurangi godaan itu tanpa harus ekstrem. Matikan notifikasi aplikasi yang paling sering mengalihkan selama jam belajar. Letakkan ponsel di ruangan lain atau setidaknya di luar jangkauan tangan. Belajar dalam satu blok waktu singkat dengan teknik pomodoro, misalnya dua puluh lima menit fokus diikuti lima menit istirahat, lebih mudah dijaga daripada mencoba fokus berjam-jam tanpa jeda.

Fokus yang dijaga secara rutin bukan hanya mempercepat pemahaman, tetapi juga melatih otak untuk kembali menikmati kegiatan yang menurut sebagian orang membosankan. Seiring waktu, duduk membaca buku pelajaran menjadi lebih ringan, dan godaan untuk membuka ponsel makin mudah ditolak.`
	},
	{
		id: 2,
		judul: 'Tips Ampuh Menghadapi UTBK 2026',
		deskripsi: 'Kumpulan strategi belajar efektif dari para pejuang PTN.',
		kategori: 'Tips Belajar',
		author: 'Sinta A.',
		updatedAt: '12 Jul 2026',
		dibaca: 2300,
		badgeWarna: 'bg-amber-50 text-amber-700 border-amber-200',
		isBookmark: false,
		topics: ['UTBK', 'strategi belajar', 'manajemen waktu'],
		konten: `UTBK bukan perlombaan untuk siapa yang memahami materi paling banyak dalam waktu semalam. Skor yang baik lebih sering berasal dari persiapan yang konsisten selama berbulan-bulan, lengkap dengan latihan soal dan evaluasi rutin. Tiga komponen yang paling berpengaruh adalah penguasaan materi, kebiasaan latihan, dan kesiapan mental saat hari ujian.

Mulailah dengan memetakan materi yang sudah dikuasai dan yang masih lemah. Gunakan hasil try out untuk melihat subtes mana yang paling banyak menurunkan skor, lalu alokasikan waktu lebih ke sana. Mengerjakan soal UTBK tahun sebelumnya jauh lebih berguna daripada sekadar membaca ringkasan, karena kamu belajar mengenali pola soal dan mengatur kecepatan mengerjakan.

Jadwal belajar realistis lebih baik daripada jadwal padat yang tidak bisa dipertahankan. Tiga sampai empat jam terbagi per hari, dengan satu hari istirahat dalam seminggu, cukup untuk kemajuan yang stabil. Jangan lupa simulasi ujian dengan waktu yang benar-benar dibatasi, karena mengerjakan dengan kecepatan santai tidak menggambarkan kondisi sebenarnya.

Menjelang hari-H, prioritas berubah dari menambah materi menjadi menjaga kondisi. Tidur cukup malam sebelum ujian, siapkan perlengkapan yang diperlukan, dan sampai di tempat ujian lebih awal. Rasa percaya diri yang dibangun dari persiapan yang jujur akan membantu kamu tetap tenang dan berpikir jernih saat menghadapi soal.`
	},
	{
		id: 3,
		judul: 'Krisis Iklim dari Kacamata Anak Muda Kota Kecil',
		deskripsi: 'Observasi personal soal perubahan cuaca ekstrem dan dampaknya.',
		kategori: 'Opini',
		author: 'Larasati N.',
		updatedAt: '10 Jul 2026',
		dibaca: 980,
		badgeWarna: 'bg-emerald-50 text-emerald-700 border-emerald-200',
		isBookmark: false,
		topics: ['iklim', 'lingkungan', 'anak muda'],
		konten: `Saya tumbuh di kota kecil yang ramai hanya di pagi hari. Dulu hujan turun hampir setiap sore, dan anak-anak di kampung tahu kapan harus berlari pulang sebelum langit mendung menjadi gelap. Sekarang pola itu berubah. Musim kemarau terasa lebih panjang dan lebih panas, sementara hujan kadang datang begitu deras dalam waktu singkat sehingga selokan di depan rumah tidak sanggup menampungnya.

Tidak semua orang di kota kecil membaca laporan tentang kenaikan suhu global atau karbon dioksida di atmosfer, tetapi mereka merasakan dampaknya lewat hasil panen yang menurun dan air sumur yang lebih cepat habis. Kedua hal itu lebih dekat dengan keseharian warga daripada istilah yang jarang mereka dengar. Ini membuat saya sadar bahwa isu iklim bukan cerita di layar, melainkan bagian dari cuaca yang mereka alami setiap hari.

Anak muda di kota kecil justru bisa berperan dengan cara yang paling sederhana. Menanam pohon di halaman, mengurangi sampah plastik sekali pakai, dan ikut membersihkan saluran air adalah langkah yang langsung terlihat hasilnya oleh tetangga. Aksi kecil yang nyata lebih mudah ditiru daripada kampanye besar yang tidak dirasa dampaknya sehari-hari.

Sikap yang saya harap tumbuh adalah tidak perlu menunggu orang dewasa atau pemerintah bergerak lebih dulu. Memahami cuaca dan lingkungan sekitar, lalu mulai dari satu kebiasaan yang kita kontrol sendiri, sudah menjadi awal yang berarti untuk menghadapi perubahan iklim dari akar yang paling dekat.`
	},
	{
		id: 4,
		judul: 'Beasiswa S1 Luar Negeri: Peluang Emas 2026',
		deskripsi: 'Informasi lengkap beasiswa S1 ke berbagai negara.',
		kategori: 'Berita Kampus',
		author: 'Budi D.',
		updatedAt: '8 Jul 2026',
		dibaca: 3150,
		badgeWarna: 'bg-cyan-50 text-cyan-700 border-cyan-200',
		isBookmark: true,
		topics: ['beasiswa', 'kuliah luar negeri'],
		konten: `Bagi calon mahasiswa yang ingin melanjutkan studi S1 ke luar negeri tanpa membebani keuangan keluarga, beasiswa adalah salah satu jalur yang paling realistis. Banyak negara menawarkan pendanaan penuh yang mencakup biaya kuliah, biaya hidup, hingga tiket pesawat. Yang dibutuhkan sejak awal adalah riset yang teliti dan persiapan berkas jauh sebelum tenggat.

Sebagian besar program beasiswa menilai tiga hal: prestasi akademik, kemampuan bahasa asing, dan cerita atau motivasi yang kuat. Nilai yang baik membantu, tetapi tidak menjamin. Panitia mencari pelamar yang bisa menunjukkan alasan yang jelas untuk mengambil jurusan itu dan apa yang akan mereka kontribusikan setelah kembali ke tanah air. Karena itu, pengalaman organisasi, lomba, atau kegiatan sosial yang relevan tetap perlu didokumentasikan.

Dokumen seperti esai, surat rekomendasi, dan transkrip sebaiknya disiapkan sejak dini. Esai motivasi ditulis dalam bahasa yang alami dan spesifik, bukan kalimat bombastis yang kosong. Minta orang lain membaca ulang esai untuk memastikan alurnya jelas dan tidak ada kesalahan penulisan, karena kesalahan kecil sering menjadi bahan penilaian.

Waktu yang tepat untuk mulai adalah jauh sebelum tenggat pendaftaran. Beberapa program menutup pendaftaran setahun lebih awal, sehingga menunda persiapan hanya menyulitkan diri sendiri. Membuat daftar program yang diminati, menandai tanggal penting, dan menyusun berkas secara bertahap adalah kebiasaan yang akan mempermudah seluruh proses.`
	},
	{
		id: 5,
		judul: 'Membedah Buku "Atomic Habits" untuk Pelajar',
		deskripsi: 'Review dan aplikasi konsep kebiasaan kecil dalam rutinitas belajar.',
		kategori: 'Review Buku',
		author: 'Dimas P.',
		updatedAt: '5 Jul 2026',
		dibaca: 1890,
		badgeWarna: 'bg-rose-50 text-rose-700 border-rose-200',
		isBookmark: false,
		topics: ['kebiasaan', 'produktivitas', 'review buku'],
		konten: `Atomic Habits karya James Clear menawarkan cara yang masuk akal untuk membangun kebiasaan belajar: fokus pada sistem harian, bukan pada target akhir. Daripada bertekad mendapat nilai bagus dalam satu bulan, buku ini menyarankan kamu memperbaiki satu-dua kebiasaan kecil yang bisa diulang setiap hari sampai akhirnya otomatis.

Gagasannya dikenal dengan istilah kebiasaan atom, yaitu perubahan kecil yang tampak sepele tapi terakumulasi jika dilakukan konsisten. Untuk pelajar, contohnya membuka buku hanya pada jam yang sama setiap hari, menyiapkan materi malam sebelumnya, atau langsung mencatat inti pelajaran setelah kelas selesai. Masing-masing tidak terasa besar, tetapi digabungkan menjadi rutinitas yang sulit dilewatkan.

Buku ini juga membahas cara membuat kebiasaan lebih mudah dimulai. Satu prinsip yang menarik adalah aturan dua menit, yaitu memulai dengan versi paling sederhana dari kebiasaan itu. Kalau kamu ingin biasa membaca, cukup mulai dengan membuka satu halaman. Titik awal yang ringan membuat godaan untuk menunda menjadi kecil.

Perlu dicatat bahwa buku ini berfokus pada membangun kebiasaan ke arah yang benar, bukan memberi resep belajar khusus untuk ujian. Ia paling bermanfaat bagi pelajar yang sudah cukup materi tetapi kesulitan menjaga konsistensi. Bagi pembaca yang butuh strategi mengerjakan soal dan manajemen waktu ujian, isi buku ini sebaiknya dilengkapi dengan latihan dan pembahasan soal secara langsung.`
	},
	{
		id: 6,
		judul: 'Pentingnya Literasi Digital di Kalangan Mahasiswa',
		deskripsi: 'Mengapa mahasiswa harus melek digital di era informasi.',
		kategori: 'Opini',
		author: 'Nadia K.',
		updatedAt: '1 Jul 2026',
		dibaca: 760,
		badgeWarna: 'bg-purple-50 text-purple-700 border-purple-200',
		isBookmark: false,
		topics: ['literasi digital', 'mahasiswa'],
		konten: `Menjadi mahasiswa di era informasi berarti setiap hari dihujani berita, opini, dan unggahan yang setengah benar. Kemampuan melek digital bukan sekadar bisa menggunakan gawai atau media sosial, melainkan bisa menilai apakah sebuah informasi layak dipercaya sebelum menyebarkannya. Kecakapan ini semakin penting ketika banyak konten dirancang untuk memancing emosi, bukan menyampaikan fakta.

Salah satu langkah paling praktis adalah memeriksa sumber sebelum mempercayai berita. Cari tahu siapa yang menulis, institusi apa yang mendukung, dan apakah sumber itu sering mencampur fakta dengan opini tanpa tanda yang jelas. Bandingkan dengan media lain yang independen. Informasi penting hampir tidak pernah hanya datang dari satu tempat.

Di lingkungan kampus, literasi digital juga berarti memakai internet untuk hal yang mendukung kuliah. Menggunakan basis data jurnal, menulis dengan merujuk sumber yang benar, dan menghindari plagiarisme adalah bagian dari kecakapan yang diuji tidak hanya di kelas, tetapi juga dalam tugas akhir. Mahasiswa yang melek digital bisa membedakan sumber yang bisa dikutip dari sekadar unggahan yang viral.

Kesadaran ini tidak datang otomatis. Ia dibentuk dari kebiasaan membaca dengan bertanya, mengecek, dan tidak langsung membagikan apa yang hanya sekilas masuk akal. Semakin banyak mahasiswa terbiasa melakukannya, semakin kecil ruang bagi misinformasi untuk berkembang di sekitar mereka.`
	},
	{
		id: 7,
		judul: 'Resep Sukses Magang di Startup Teknologi',
		deskripsi: 'Cerita pengalaman magang dan tips menembus industri tech.',
		kategori: 'Karir',
		author: 'Rizky F.',
		updatedAt: '28 Jun 2026',
		dibaca: 2100,
		badgeWarna: 'bg-indigo-50 text-indigo-700 border-indigo-200',
		isBookmark: true,
		topics: ['magang', 'startup', 'karir'],
		konten: `Magang di startup teknologi terasa seperti kelas paralel di luar perkuliahan. Di sana kamu diajak langsung mengerjakan masalah nyata dengan tenggat yang singkat dan umpan balik yang cepat. Pengalaman ini tidak hanya menambah isi CV, tetapi juga melatih cara bekerja dalam tim kecil yang hasil kerjanya langsung dilihat banyak orang.

Proses mendaftarnya hampir mirip untuk banyak perusahaan: kirim lamaran, ikuti seleksi, lalu wawancara. Yang membedakan pelamar satu dengan lainnya biasanya bukan nilai, melainkan cara mereka menunjukkan rasa ingin tahu dan inisiatif. Sebuah proyek kecil yang kamu kerjakan sendiri, bahkan sekadar aplikasi sederhana, sering berbicara lebih kuat daripada daftar mata kuliah yang sudah lulus.

Begitu diterima, hal terpenting adalah tidak takut bertanya dan terbuka terhadap kritik. Kode yang pernah kamu tulis bisa saja dirombak, dan desain yang kamu buat mungkin diubah oleh tim lain. Ini bukan kegagalan pribadi, melainkan cara kerja yang menaruh hasil produk di atas ego masing-masing anggota.

Magang juga menjadi waktu yang tepat untuk memahami apakah dunia teknologi memang cocok dengan cara kamu bekerja. Beberapa orang merasa senang dengan ritme yang cepat, sebagian lain lebih nyaman di lingkungan dengan struktur yang jelas. Berapapun hasil akhirnya, pengalaman ini memberikan gambaran yang jauh lebih jujur daripada sekadar membaca ulasan tentang industri ini.`
	},
	{
		id: 8,
		judul: 'Menulis Esai Ilmiah untuk Lomba: Panduan Lengkap',
		deskripsi: 'Langkah-langkah menyusun esai ilmiah yang memenangkan lomba.',
		kategori: 'Tips Belajar',
		author: 'Ayu L.',
		updatedAt: '25 Jun 2026',
		dibaca: 1340,
		badgeWarna: 'bg-amber-50 text-amber-700 border-amber-200',
		isBookmark: false,
		topics: ['esai', 'lomba', 'penulisan'],
		konten: `Kunci esai ilmiah untuk lomba bukan pada panjangnya, melainkan pada ketajaman rumusan masalah dan penyampaian yang runtut. Juri menilai sejauh mana kamu memahami topik, mampu menyusun argumen berdasarkan data, dan menyampaikannya dengan bahasa yang jelas. Sebelum menulis, baca tema lomba dengan cermat lalu tentukan satu sudut pandang yang bisa dibahas secara mendalam.

Mulailah dengan kerangka. Tulis latar belakang singkat, rumusan masalah, lalu rencana pembahasan yang memuat tinjauan pustaka, analisis, dan rekomendasi. Dengan kerangka, kamu tidak mudah kehilangan arah saat menulis panjang. Setiap bagian harus saling mendukung menuju satu kesimpulan yang menjawab rumusan masalah sejak awal.

Bahasa adalah bagian yang sering diremehkan. Hindari kalimat bertele-tele dan istilah asing yang tidak dijelaskan. Kutip sumber dengan jujur dan beri nomor rujukan yang benar, karena karya asli yang rapi tetap bisa tertolak jika pengutipannya ceroboh. Setelah selesai, endapkan tulisan satu-dua hari lalu baca ulang dengan pikiran segar untuk menemukan bagian yang tidak masuk akal atau melemah.

Merawat kesempatan berkompetisi juga berarti mengikuti aturan lomba dengan cermat, mulai dari format berkas, jumlah halaman, sampai tenggat pengumpulan. Kesalahan administrasi membuat tulisan sehebat apapun tidak sempat dinilai. Terakhir, anggap lomba sebagai latihan menulis yang berharga, bukan satu-satunya ukuran kemampuan, karena keterampilan yang kamu asah akan berguna di tugas akhir dan dunia kerja kelak.`
	}
];
