import type { PracticePackage, Question, Subject } from '$lib/types/practice';

export const subjects: Subject[] = [
	{ name: 'Matematika', iconName: 'Calculator', color: 'bg-primary-50 text-primary-700' },
	{ name: 'Fisika', iconName: 'Atom', color: 'bg-cyan-50 text-cyan-700' },
	{ name: 'Kimia', iconName: 'FlaskConical', color: 'bg-emerald-50 text-emerald-700' },
	{ name: 'Biologi', iconName: 'Leaf', color: 'bg-amber-50 text-amber-700' },
	{ name: 'B.Indonesia', iconName: 'BookOpen', color: 'bg-rose-50 text-rose-700' },
	{ name: 'B.Inggris', iconName: 'Languages', color: 'bg-indigo-50 text-indigo-700' },
	{ name: 'Penalaran', iconName: 'Brain', color: 'bg-purple-50 text-purple-700' }
];

export const practicePackages: PracticePackage[] = [
	{
		id: 1,
		title: 'Penalaran Umum',
		description: 'Latihan logika dan pola untuk mengasah kemampuan berpikir kritis.',
		subject: 'Penalaran',
		difficulty: 'Sedang',
		questionCount: 20,
		duration: '25 menit',
		group: 'Paket Latihan Soal A',
		author: 'Tim Arcivis',
		topics: ['Pola Bilangan', 'Logika Formal', 'Analisis Korelasi'],
		isVerified: true
	},
	{
		id: 2,
		title: 'Pengetahuan Kuantitatif',
		description: 'Perhitungan dasar dan interpretasi data numerik.',
		subject: 'Matematika',
		difficulty: 'Mudah',
		questionCount: 15,
		duration: '20 menit',
		group: 'Paket Latihan Soal A',
		author: 'Tim Arcivis',
		topics: ['Persen', 'Rata-rata', 'Perbandingan'],
		isVerified: true
	},
	{
		id: 3,
		title: 'Penalaran Matematika',
		description: 'Logika matematika dan penalaran kuantitatif tingkat lanjut.',
		subject: 'Matematika',
		difficulty: 'Sulit',
		questionCount: 20,
		duration: '30 menit',
		group: 'Paket Latihan Soal A',
		author: 'Tim Arcivis',
		topics: ['Aljabar', 'Barisan & Deret', 'Peluang'],
		isVerified: true
	},
	{
		id: 4,
		title: 'Literasi B. Indonesia',
		description: 'Pemahaman teks dan analisis wacana Bahasa Indonesia.',
		subject: 'B.Indonesia',
		difficulty: 'Sedang',
		questionCount: 15,
		duration: '25 menit',
		group: 'Paket Latihan Soal B',
		author: 'Tim Arcivis',
		topics: ['Teks Eksposisi', 'Argumen', 'Kosakala'],
		isVerified: true
	},
	{
		id: 5,
		title: 'Literasi B. Inggris',
		description: 'Reading comprehension dan vocabulary dalam konteks akademik.',
		subject: 'B.Inggris',
		difficulty: 'Sedang',
		questionCount: 15,
		duration: '25 menit',
		group: 'Paket Latihan Soal B',
		author: 'Tim Arcivis',
		topics: ['Reading Comprehension', 'Vocabulary', 'Inference'],
		isVerified: false
	},
	{
		id: 6,
		title: 'Pemahaman Bacaan',
		description: 'Analisis teks tingkat lanjut untuk persiapan UTBK.',
		subject: 'B.Indonesia',
		difficulty: 'Sulit',
		questionCount: 10,
		duration: '20 menit',
		group: 'Paket Latihan Soal B',
		author: 'Kontributor: Budi Santoso',
		topics: ['Teks Ilmiah', 'Reduksi Informasi', 'Sintesis'],
		isVerified: false
	},
	{
		id: 7,
		title: 'Matematika Dasar',
		description: 'Aritmatika, aljabar, dan geometri dasar.',
		subject: 'Matematika',
		difficulty: 'Mudah',
		questionCount: 20,
		duration: '30 menit',
		group: 'Paket Latihan Soal C',
		author: 'Tim Arcivis',
		topics: ['Aritmatika', 'Aljabar Dasar', 'Geometri'],
		isVerified: true
	},
	{
		id: 8,
		title: 'Fisika Terapan',
		description: 'Mekanika dasar dan aplikasi hukum Newton.',
		subject: 'Fisika',
		difficulty: 'Sedang',
		questionCount: 15,
		duration: '25 menit',
		group: 'Paket Latihan Soal C',
		author: 'Tim Arcivis',
		topics: ['Kinematika', 'Hukum Newton', 'Gaya & Gerak'],
		isVerified: true
	},
	{
		id: 9,
		title: 'Kimia Dasar',
		description: 'Stoikiometri dan reaksi kimia.',
		subject: 'Kimia',
		difficulty: 'Sulit',
		questionCount: 15,
		duration: '25 menit',
		group: 'Paket Latihan Soal C',
		author: 'Kontributor: Siti Aminah',
		topics: ['Stoikiometri', 'Ikatan Kimia', 'Termokimia'],
		isVerified: false
	}
];

export const questions: Record<number, Question[]> = {
	1: [
		{
			id: 1,
			text: 'Jika 3x + 5 = 20, maka nilai x adalah...',
			options: ['3', '5', '7', '15'],
			correctIndex: 1,
			explanation: '3x + 5 = 20 → 3x = 15 → x = 5.'
		},
		{
			id: 2,
			text: 'Kata "distraksi" dalam konteks belajar paling dekat maknanya dengan...',
			options: ['Fokus', 'Gangguan', 'Kelelahan', 'Ketekunan'],
			correctIndex: 1,
			explanation: '"Distraksi" berarti sesuatu yang mengganggu perhatian atau konsentrasi.'
		},
		{
			id: 3,
			text: 'Manakah pola yang tepat melanjutkan deret: 2, 6, 12, 20, ...?',
			options: ['28', '30', '32', '24'],
			correctIndex: 1,
			explanation: 'Selisihnya bertambah 2 tiap langkah (4, 6, 8, 10), jadi 20 + 10 = 30.'
		}
	],
	2: [
		{
			id: 4,
			text: 'Berapa hasil dari 15% dari 200?',
			options: ['25', '30', '35', '40'],
			correctIndex: 1,
			explanation: '15% × 200 = 0.15 × 200 = 30.'
		},
		{
			id: 5,
			text: 'Apa sinonim dari kata "konsisten"?',
			options: ['Berubah-ubah', 'Tetap', 'Sesekali', 'Ragu'],
			correctIndex: 1,
			explanation: 'Konsisten berarti tetap atau tidak berubah-ubah.'
		},
		{
			id: 6,
			text: 'Deret: 1, 4, 9, 16, ... angka selanjutnya?',
			options: ['20', '25', '36', '49'],
			correctIndex: 1,
			explanation: 'Pola kuadrat: 1², 2², 3², 4², 5² = 25.'
		}
	],
	3: [
		{
			id: 7,
			text: 'Jika a + b = 10 dan a - b = 4, maka nilai a adalah...',
			options: ['5', '6', '7', '8'],
			correctIndex: 2,
			explanation: 'a + b = 10 dan a - b = 4. dijumlahkan: 2a = 14 → a = 7.'
		},
		{
			id: 8,
			text: 'Nilai dari 2³ + 3² adalah...',
			options: ['13', '15', '17', '19'],
			correctIndex: 2,
			explanation: '2³ = 8, 3² = 9. 8 + 9 = 17.'
		},
		{
			id: 9,
			text: 'Jika f(x) = 2x + 3, maka f(5) = ...',
			options: ['10', '11', '13', '15'],
			correctIndex: 2,
			explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13.'
		}
	],
	4: [
		{
			id: 10,
			text: 'Ide pokok paragraf dapat ditemukan pada...',
			options: ['Kalimat terakhir', 'Kalimat pertama', 'Kalimat utama', 'Kesimpulan'],
			correctIndex: 2,
			explanation: 'Ide pokok terdapat pada kalimat utama yang biasanya ada di awal paragraf.'
		},
		{
			id: 11,
			text: 'Gaya bahasa yang menggunakan perbandingan langsung dengan kata "seperti" disebut...',
			options: ['Metfora', 'Simile', 'Personifikasi', 'Hiperbola'],
			correctIndex: 1,
			explanation: 'Simile adalah majas perbandingan dengan kata "seperti" atau "bagai".'
		},
		{
			id: 12,
			text: 'Struktur teks eksposisi yang berisi pernyataan pendapat disebut...',
			options: ['Tesis', 'Argumentasi', 'Simpulan', 'Data'],
			correctIndex: 0,
			explanation: 'Tesis adalah bagian yang berisi pernyataan pendapat atau opini penulis.'
		}
	],
	5: [
		{
			id: 13,
			text: '"The student decided to postpone the assignment." The word "postpone" is closest in meaning to...',
			options: ['Complete', 'Delay', 'Cancel', 'Begin'],
			correctIndex: 1,
			explanation: '"Postpone" means to delay or reschedule something to a later time.'
		},
		{
			id: 14,
			text: 'Which sentence uses the correct past tense?',
			options: [
				'She go to school yesterday.',
				'She went to school yesterday.',
				'She has went to school yesterday.',
				'She going to school yesterday.'
			],
			correctIndex: 1,
			explanation: '"Went" is the correct simple past tense of "go".'
		},
		{
			id: 15,
			text: '"Although it was raining, they continued playing." The underlined word indicates...',
			options: ['Cause', 'Contrast', 'Sequence', 'Result'],
			correctIndex: 1,
			explanation: '"Although" signals a contrast or concession between two ideas.'
		}
	],
	6: [
		{
			id: 16,
			text: 'Argumen utama teks tersebut adalah...',
			options: [
				'Pendidikan harus gratis',
				'Teknologi mengubah cara belajar',
				'Guru harus diganti dengan AI',
				'Siswa malas membaca'
			],
			correctIndex: 1,
			explanation: 'Teks secara konsisten membahas dampak teknologi terhadap metode pembelajaran.'
		},
		{
			id: 17,
			text: 'Kesimpulan yang paling tepat dari teks tersebut adalah...',
			options: [
				'Teknologi tidak berguna',
				'Pendidikan akan hancur',
				'Teknologi perlu digunakan secara bijak',
				'Semua harus kembali ke metode lama'
			],
			correctIndex: 2,
			explanation: 'Penulis menekankan pentingnya penggunaan teknologi yang bijak dalam pendidikan.'
		}
	],
	7: [
		{
			id: 18,
			text: 'Hasil dari 48 ÷ 6 + 3 × 2 adalah...',
			options: ['10', '14', '18', '20'],
			correctIndex: 1,
			explanation: '48 ÷ 6 = 8, 3 × 2 = 6. 8 + 6 = 14.'
		},
		{
			id: 19,
			text: 'Luas lingkaran dengan jari-jari 7 cm adalah... (π = 22/7)',
			options: ['144 cm²', '154 cm²', '164 cm²', '176 cm²'],
			correctIndex: 1,
			explanation: 'L = πr² = (22/7) × 7² = 22 × 7 = 154 cm².'
		},
		{
			id: 20,
			text: 'Jika x² - 5x + 6 = 0, maka nilai x adalah...',
			options: ['1 dan 6', '2 dan 3', '-2 dan -3', '1 dan 5'],
			correctIndex: 1,
			explanation: 'x² - 5x + 6 = (x-2)(x-3) = 0, sehingga x = 2 atau x = 3.'
		}
	],
	8: [
		{
			id: 21,
			text: 'Sebuah benda dilempar vertikal ke atas dengan kecepatan 20 m/s. Jika g = 10 m/s², ketinggian maksimum adalah...',
			options: ['10 m', '20 m', '30 m', '40 m'],
			correctIndex: 1,
			explanation: 'h = v²/(2g) = 400/20 = 20 m.'
		},
		{
			id: 22,
			text: 'Gaya_resultan dari dua gaya 3 N dan 4 N yang sejajar dan berlawan arah adalah...',
			options: ['1 N', '5 N', '7 N', '12 N'],
			correctIndex: 0,
			explanation: 'Gaya sejajar berlawan: 4 - 3 = 1 N.'
		},
		{
			id: 23,
			text: 'Benda bermassa 5 kg ditarik dengan gaya 20 N. Percepatannya adalah...',
			options: ['2 m/s²', '4 m/s²', '5 m/s²', '100 m/s²'],
			correctIndex: 1,
			explanation: 'F = ma → a = F/m = 20/5 = 4 m/s².'
		}
	],
	9: [
		{
			id: 24,
			text: 'Massa molekul relatif H₂O adalah...',
			options: ['16', '18', '20', '36'],
			correctIndex: 1,
			explanation: 'H₂O = 2(1) + 16 = 18.'
		},
		{
			id: 25,
			text: 'Jumlah mol dari 44 g CO₂ adalah... (Mr CO₂ = 44)',
			options: ['0.5 mol', '1 mol', '2 mol', '44 mol'],
			correctIndex: 1,
			explanation: 'n = massa/Mr = 44/44 = 1 mol.'
		},
		{
			id: 26,
			text: 'Reaksi yang melepaskan panas disebut reaksi...',
			options: ['Endoterm', 'Eksoterm', 'Netral', 'Ionisasi'],
			correctIndex: 1,
			explanation: 'Reaksi eksoterm adalah reaksi yang melepaskan panas ke lingkungan.'
		}
	]
};
