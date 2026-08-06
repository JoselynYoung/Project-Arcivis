import type { PracticePackage, Question, Subject } from '$lib/types/practice';

// Practice Module Mock Data

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
	// Group A
	{
		id: 1,
		title: 'Penalaran Umum',
		description: 'Latihan logika dan pola',
		difficulty: 'Sedang',
		questionCount: 20,
		duration: '25 menit',
		group: 'Paket Latihan Soal A'
	},
	{
		id: 2,
		title: 'Pengetahuan Kuantitatif',
		description: 'Perhitungan dasar',
		difficulty: 'Mudah',
		questionCount: 15,
		duration: '20 menit',
		group: 'Paket Latihan Soal A'
	},
	{
		id: 3,
		title: 'Penalaran Matematika',
		description: 'Logika matematika',
		difficulty: 'Sulit',
		questionCount: 20,
		duration: '30 menit',
		group: 'Paket Latihan Soal A'
	},
	// Group B
	{
		id: 4,
		title: 'Literasi B. Indonesia',
		description: 'Pemahaman teks',
		difficulty: 'Sedang',
		questionCount: 15,
		duration: '25 menit',
		group: 'Paket Latihan Soal B'
	},
	{
		id: 5,
		title: 'Literasi B. Inggris',
		description: 'Reading comprehension',
		difficulty: 'Sedang',
		questionCount: 15,
		duration: '25 menit',
		group: 'Paket Latihan Soal B'
	},
	{
		id: 6,
		title: 'Pemahaman Bacaan',
		description: 'Analisis teks',
		difficulty: 'Sulit',
		questionCount: 10,
		duration: '20 menit',
		group: 'Paket Latihan Soal B'
	},
	// Group C
	{
		id: 7,
		title: 'Matematika Dasar',
		description: 'Aritmatika & aljabar',
		difficulty: 'Mudah',
		questionCount: 20,
		duration: '30 menit',
		group: 'Paket Latihan Soal C'
	},
	{
		id: 8,
		title: 'Fisika Terapan',
		description: 'Mekanika dasar',
		difficulty: 'Sedang',
		questionCount: 15,
		duration: '25 menit',
		group: 'Paket Latihan Soal C'
	},
	{
		id: 9,
		title: 'Kimia Dasar',
		description: 'Stoikiometri',
		difficulty: 'Sulit',
		questionCount: 15,
		duration: '25 menit',
		group: 'Paket Latihan Soal C'
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
	]
	// … add similar short question sets for each package ID (3-9) to avoid empty arrays.
	// For demonstration, remaining IDs reuse the same generic set or can be filled with placeholder questions.
};
