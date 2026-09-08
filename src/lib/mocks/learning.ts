export interface LearningMaterial {
	id: number;
	judul: string;
	deskripsi: string;
	mapel: string;
	tanggal: string;
	updatedAt: string;
	author: string;
	dibaca: number;
	badgeWarna: string;
	isBookmark?: boolean;
	topics?: string[];
	content: string;
}

export const learningMaterials: LearningMaterial[] = [
	{
		id: 1,
		judul: 'Fungsi Kuadrat Lanjutan & Modifikasi Grafik',
		deskripsi:
			'Memahami pergeseran grafik, titik puncak, serta analisis diskriminan pada soal-soal tingkat lanjut UTBK SNBT.',
		mapel: 'Matematika',
		tanggal: '2026-07-20',
		updatedAt: '20 Juli 2026',
		author: 'Tim Matematika Acivis',
		dibaca: 1420,
		badgeWarna: 'bg-primary-50 text-primary-700 border-primary-200',
		isBookmark: false,
		topics: ['Fungsi Kuadrat', 'Diskriminan', 'Titik Puncak', 'Transformasi Grafik'],
		content: `
			<h2>1. Pendahuluan Bentuk Umum Fungsi Kuadrat</h2>
			<p>Fungsi kuadrat merupakan salah satu topik yang hampir selalu muncul dalam Pengetahuan Kuantitatif dan Penalaran Matematika UTBK SNBT. Bentuk umum fungsi kuadrat adalah:</p>
			<div class="bg-slate-50 border-l-4 border-primary-600 p-4 my-4 font-mono text-sm rounded-r-xl">
				f(x) = ax² + bx + c, &nbsp; dengan a ≠ 0
			</div>
			
			<h2>2. Titik Puncak dan Sumbu Simetri</h2>
			<p>Untuk menentukan koordinat titik puncak <strong>(h, k)</strong> dari grafik parabola:</p>
			<ul>
				<li><strong>Sumbu Simetri (h):</strong> x = -b / (2a)</li>
				<li><strong>Nilai Ekstrem (k):</strong> y = -D / (4a) di mana D = b² - 4ac</li>
			</ul>

			<h2>3. Sifat Diskriminan (D)</h2>
			<p>Diskriminan memegang peranan penting dalam menentukan pemotongan grafik terhadap sumbu X:</p>
			<ul>
				<li><strong>D &gt; 0:</strong> Grafik memotong sumbu X di dua titik berbeda.</li>
				<li><strong>D = 0:</strong> Grafik menyinggung sumbu X di satu titik.</li>
				<li><strong>D &lt; 0:</strong> Grafik tidak memotong sumbu X (definit positif jika a &gt; 0, definit negatif jika a &lt; 0).</li>
			</ul>

			<h2>4. Pergeseran & Modifikasi Grafik (Transformasi)</h2>
			<p>Bentuk puncak <em>f(x) = a(x - h)² + k</em> mempermudah analisis pergeseran:</p>
			<p>Pergeseran sejauh <strong>p</strong> satuan ke kanan mengubah fungsi menjadi <em>f(x - p)</em>, sedangkan pergeseran ke atas sejauh <strong>q</strong> satuan mengubah fungsi menjadi <em>f(x) + q</em>.</p>
		`
	},
	{
		id: 2,
		judul: 'Gerak Parabola & Hukum Kinematika 2D',
		deskripsi:
			'Penurunan rumus cepat sudut elevasi, tinggi maksimum, dan jangkauan terjauh dalam analisis gerak dua dimensi.',
		mapel: 'Fisika',
		tanggal: '2026-07-18',
		updatedAt: '18 Juli 2026',
		author: 'Drs. Supriyanto, M.Si.',
		dibaca: 980,
		badgeWarna: 'bg-cyan-50 text-cyan-700 border-cyan-200',
		isBookmark: true,
		topics: ['Kinematika 2D', 'Sudut Elevasi', 'Tinggi Maksimum', 'Jangkauan Terjauh'],
		content: `
			<h2>1. Pengertian Gerak Parabola</h2>
			<p>Gerak parabola merupakan perpaduan antara Gerak Lurus Beraturan (GLB) pada sumbu horizontal (X) dan Gerak Lurus Berubah Beraturan (GLBB) pada sumbu vertikal (Y).</p>
			
			<h2>2. Komponen Kecepatan Awal</h2>
			<p>Jika benda dilemparkan dengan kecepatan awal <em>v₀</em> dan sudut elevasi <em>α</em>:</p>
			<ul>
				<li><em>v₀x = v₀ · cos(α)</em> (Konstan selama bergerak)</li>
				<li><em>v₀y = v₀ · sin(α)</em> (Dipengaruhi percepatan gravitasi g)</li>
			</ul>

			<h2>3. Rumus Penting</h2>
			<div class="bg-slate-50 border-l-4 border-cyan-600 p-4 my-4 font-mono text-sm rounded-r-xl space-y-2">
				<p><strong>Waktu puncak (t_hmax):</strong> (v₀ · sin α) / g</p>
				<p><strong>Tinggi Maksimum (H_max):</strong> (v₀² · sin² α) / (2g)</p>
				<p><strong>Jangkauan Maksimum (X_max):</strong> (v₀² · sin 2α) / g</p>
			</div>
		`
	},
	{
		id: 3,
		judul: 'Struktur Atom & Sistem Periodik Unsur',
		deskripsi:
			'Trik menghafal konfigurasi elektron, jari-jari atom, energi ionisasi, serta sifat keperiodikan unsur.',
		mapel: 'Kimia',
		tanggal: '2026-07-15',
		updatedAt: '15 Juli 2026',
		author: 'Dr. Anita Rahmawati',
		dibaca: 2150,
		badgeWarna: 'bg-emerald-50 text-emerald-700 border-emerald-200',
		isBookmark: false,
		topics: ['Konfigurasi Elektron', 'Bilangan Kuantum', 'Sistem Periodik', 'Jari-Jari Atom'],
		content: `
			<h2>1. Perkembangan Teori Atom</h2>
			<p>Dari model atom Dalton, Thomson, Rutherford, Bohr, hingga Teori Kuantum Modern (Mekanika Gelombang).</p>
			
			<h2>2. Aturan Konfigurasi Elektron</h2>
			<ul>
				<li><strong>Prinsip Aufbau:</strong> Pengisian orbital dimulai dari tingkat energi terendah ke tertinggi.</li>
				<li><strong>Larangan Pauli:</strong> Tidak ada dua elektron dalam satu atom yang memiliki 4 bilangan kuantum sama.</li>
				<li><strong>Kaidah Hund:</strong> Pengisian orbital se tingkat dilakukan secara sejajar terlebih dahulu sebelum berpasangan.</li>
			</ul>

			<h2>3. Sifat Periodik Unsur</h2>
			<p>Jari-jari atom membesar dari atas ke bawah dalam satu golongan dan mengecil dari kiri ke kanan dalam satu periode.</p>
		`
	},
	{
		id: 4,
		judul: 'Metabolisme Sel: Respirasi Aerob & Anaerob',
		deskripsi:
			'Tahapan glikolisis, dekarboksilasi oksidatif, siklus krebs, hingga transpor elektron dengan penjelasan komprehensif.',
		mapel: 'Biologi',
		tanggal: '2026-07-10',
		updatedAt: '10 Juli 2026',
		author: 'Tim Biologi Acivis',
		dibaca: 1890,
		badgeWarna: 'bg-amber-50 text-amber-700 border-amber-200',
		isBookmark: false,
		topics: ['Respirasi Aerob', 'Glikolisis', 'Siklus Krebs', 'Transpor Elektron'],
		content: `
			<h2>1. Tahapan Respirasi Aerob</h2>
			<p>Respirasi aerob terjadi dalam 4 tahap utama yang menghasilkan energi dalam bentuk ATP:</p>
			<ol>
				<li><strong>Glikolisis:</strong> Berlangsung di sitosol, mengubah 1 glukosa menjadi 2 asam piruvat + 2 NADH + 2 ATP.</li>
				<li><strong>Dekarboksilasi Oksidatif:</strong> Berlangsung di matriks mitokondria.</li>
				<li><strong>Siklus Krebs:</strong> Mengolah Asetil-KoA menjadi NADH, FADH2, dan ATP.</li>
				<li><strong>Transpor Elektron:</strong> Tahap akhir pembentukan ATP terbesar di membran dalam mitokondria.</li>
			</ol>
		`
	},
	{
		id: 5,
		judul: 'Literasi Bacaan & Identifikasi Ide Pokok',
		deskripsi:
			'Teknik skimming & scanning untuk menemukan kalimat utama dan simpulan dalam paragraf bacaan panjang.',
		mapel: 'B.Indonesia',
		tanggal: '2026-07-22',
		updatedAt: '22 Juli 2026',
		author: 'Nabila Putri, M.Pd.',
		dibaca: 3100,
		badgeWarna: 'bg-rose-50 text-rose-700 border-rose-200',
		isBookmark: true,
		topics: ['Literasi', 'Ide Pokok', 'Skimming', 'Scanning'],
		content: `
			<h2>1. Cara Menemukan Gagasan Utama</h2>
			<p>Gagasan utama atau ide pokok biasanya terletak pada awal paragraf (deduktif), akhir paragraf (induktif), atau campuran keduanya.</p>
			
			<h2>2. Metode Skimming & Scanning</h2>
			<p>Gunakan skimming untuk menangkap gambaran umum teks dan scanning untuk mencari fakta spesifik tanpa membaca kata demi kata.</p>
		`
	},
	{
		id: 6,
		judul: 'Reading Comprehension & Inference Questions',
		deskripsi:
			'Strategi menjawab soal inferensi dan vocabulary in context pada subtes Bahasa Inggris SNBT.',
		mapel: 'B.Inggris',
		tanggal: '2026-07-12',
		updatedAt: '12 Juli 2026',
		author: 'Sarah Johnson, M.A.',
		dibaca: 1250,
		badgeWarna: 'bg-indigo-50 text-indigo-700 border-indigo-200',
		isBookmark: false,
		topics: ['Inference', 'Vocabulary in Context', 'Main Idea', 'Author Perspective'],
		content: `
			<h2>1. Tackling Inference Questions</h2>
			<p>Inference questions ask you to draw logical conclusions based on explicit facts provided in the passage.</p>
			
			<h2>2. Key Signal Words</h2>
			<p>Look out for phrases like <em>"It can be inferred that..."</em>, <em>"The author implies..."</em>, or <em>"Which of the following is supported by the text?"</em></p>
		`
	},
	{
		id: 7,
		judul: 'Penalaran Analitis & Silogisme Logika',
		deskripsi:
			'Langkah taktis memecahkan soal urutan tempat duduk, susunan jadwal, dan bentuk implikasi logika kuantifier.',
		mapel: 'Penalaran',
		tanggal: '2026-07-21',
		updatedAt: '21 Juli 2026',
		author: 'Tim Penalaran Acivis',
		dibaca: 4500,
		badgeWarna: 'bg-purple-50 text-purple-700 border-purple-200',
		isBookmark: true,
		topics: ['Silogisme', 'Modus Ponens', 'Modus Tollens', 'Penalaran Analitis'],
		content: `
			<h2>1. Aturan Penarikan Kesimpulan</h2>
			<ul>
				<li><strong>Modus Ponens:</strong> p → q, p ⊢ q</li>
				<li><strong>Modus Tollens:</strong> p → q, ~q ⊢ ~p</li>
				<li><strong>Silogisme:</strong> p → q, q → r ⊢ p → r</li>
			</ul>
			<h2>2. Penalaran Posisi & Jadwal</h2>
			<p>Gunakan tabel silang atau garis posisi untuk mencatat syarat mutlak sebelum menjawab pertanyaannya.</p>
		`
	},
	{
		id: 8,
		judul: 'Turunan & Aplikasi Nilai Maksimum Minima',
		deskripsi:
			'Konsep dasar diferensial untuk menghitung titik belok, laju perubahan, dan masalah optimasi nilai maksimum/minimum.',
		mapel: 'Matematika',
		tanggal: '2026-07-05',
		updatedAt: '05 Juli 2026',
		author: 'Tim Matematika Acivis',
		dibaca: 870,
		badgeWarna: 'bg-primary-50 text-primary-700 border-primary-200',
		isBookmark: false,
		topics: ['Turunan', 'Optimasi', 'Maksimum Minima', 'Diferensial'],
		content: `
			<h2>1. Aturan Turunan Pertama</h2>
			<p>Suatu fungsi mencapai titik stasioner ketika turunan pertamanya sama dengan nol: <em>f'(x) = 0</em>.</p>
			<h2>2. Uji Turunan Kedua untuk Ekstremum</h2>
			<p>Jika <em>f''(x) &lt; 0</em> maka titik tersebut adalah maksimum relatif. Jika <em>f''(x) &gt; 0</em> maka minimum relatif.</p>
		`
	}
];
