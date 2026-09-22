-- Stage 6 Phase 2 seed data
-- Requires at least one existing profile because content.author_id references profiles.id.

do $$
declare
  seed_author uuid;
begin
  select id into seed_author from public.profiles order by id limit 1;

  if seed_author is null then
    raise exception 'Create a profile before applying content_phase2.sql.';
  end if;

  insert into public.tags (name)
  values
    ('Fungsi Kuadrat'),
    ('Literasi Digital'),
    ('Tips Belajar'),
    ('Opini'),
    ('Materi'),
    ('Panduan')
  on conflict (slug) do update set name = excluded.name;

  insert into public.content (
    id, type, title, description, status, author_id, subject_id, body
  )
  values
    (
      '1517476c-8dd8-4684-ad34-2a4a00b0d1bd',
      'learning',
      'Fungsi Kuadrat Lanjutan & Modifikasi Grafik',
      'Memahami pergeseran grafik, titik puncak, serta analisis diskriminan pada soal-soal tingkat lanjut UTBK SNBT.',
      'diverifikasi',
      seed_author,
      '10000000-0000-0000-0000-000000000001',
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Pendahuluan Fungsi Kuadrat"}]},{"type":"paragraph","content":[{"type":"text","text":"Fungsi kuadrat merupakan topik penting dalam Penalaran Matematika."}]}]}'::jsonb
    ),
    (
      'c9326e19-61ad-4429-82af-669680e78500',
      'learning',
      'Literasi Bacaan & Identifikasi Ide Pokok',
      'Teknik skimming dan scanning untuk menemukan gagasan utama dalam bacaan panjang.',
      'diverifikasi',
      seed_author,
      '10000000-0000-0000-0000-000000000005',
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Gagasan utama dapat ditemukan dengan membaca struktur paragraf secara cermat."}]}]}'::jsonb
    ),
    (
      'a5708238-c781-4f66-8589-45a75aea853f',
      'article',
      'Mengapa Kita Sulit Fokus Belajar di Era Distraksi Digital',
      'Ulasan singkat soal dopamin, notifikasi, dan cara otak memproses gangguan saat belajar.',
      'diverifikasi',
      seed_author,
      null,
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Fokus bukan hanya soal kemauan, tetapi juga tentang mengatur gangguan di sekitar kita."}]}]}'::jsonb
    ),
    (
      '9cc71d91-b157-4c2b-9f06-b7134c8f5e73',
      'article',
      'Tips Ampuh Menghadapi UTBK 2026',
      'Kumpulan strategi belajar efektif dari para pejuang PTN.',
      'diverifikasi',
      seed_author,
      null,
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Persiapan yang konsisten lebih berguna daripada belajar mendadak menjelang ujian."}]}]}'::jsonb
    )
  on conflict (id) do update set
    type = excluded.type,
    title = excluded.title,
    description = excluded.description,
    status = excluded.status,
    author_id = excluded.author_id,
    subject_id = excluded.subject_id,
    body = excluded.body;

  insert into public.content_tags (content_id, tag_id)
  select c.id, t.id
  from (values
    ('1517476c-8dd8-4684-ad34-2a4a00b0d1bd'::uuid, 'fungsi-kuadrat'),
    ('1517476c-8dd8-4684-ad34-2a4a00b0d1bd'::uuid, 'materi'),
    ('c9326e19-61ad-4429-82af-669680e78500'::uuid, 'literasi-digital'),
    ('c9326e19-61ad-4429-82af-669680e78500'::uuid, 'materi'),
    ('a5708238-c781-4f66-8589-45a75aea853f'::uuid, 'opini'),
    ('9cc71d91-b157-4c2b-9f06-b7134c8f5e73'::uuid, 'tips-belajar'),
    ('9cc71d91-b157-4c2b-9f06-b7134c8f5e73'::uuid, 'panduan')
  ) as seed(content_id, tag_slug)
  join public.content c on c.id = seed.content_id
  join public.tags t on t.slug = seed.tag_slug
  on conflict (content_id, tag_id) do nothing;
end;
$$;
