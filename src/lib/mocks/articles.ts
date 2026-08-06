export interface Article {
  id: number;
  judul: string;
  deskripsi: string;
  kategori: string;          // e.g. "Opini", "Tips Belajar", "Berita Kampus"
  author: string;
  updatedAt: string;
  dibaca: number;
  badgeWarna: string;
  isBookmark?: boolean;
  topics?: string[];
  konten: string;            // full article content (plain text with \n paragraphs)
}

export const articles: Article[] = [
  {
    id: 1,
    judul: 'Mengapa Kita Sulit Fokus Belajar di Era Distraksi Digital',
    deskripsi: 'Ulasan singkat soal dopamin, notifikasi, dan cara otak kita memproses gangguan saat belajar.',
    kategori: 'Opini',
    author: 'Rahmat W.',
    updatedAt: '15 Jul 2026',
    dibaca: 1420,
    badgeWarna: 'bg-primary-50 text-primary-700 border-primary-200',
    isBookmark: true,
    topics: ['fokus', 'distraksi digital', 'dopamin'],
    konten: `Paragraf pertama... \n\nParagraf kedua... \n\nKesimpulan...`
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
    konten: `...`
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
    konten: `...`
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
    konten: `...`
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
    konten: `...`
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
    konten: `...`
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
    konten: `...`
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
    konten: `...`
  }
];