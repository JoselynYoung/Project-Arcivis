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
      '30000000-0000-0000-0000-000000000001',
      'learning',
      'Fungsi Kuadrat Lanjutan & Modifikasi Grafik',
      'Memahami pergeseran grafik, titik puncak, serta analisis diskriminan pada soal-soal tingkat lanjut UTBK SNBT.',
      'diverifikasi',
      seed_author,
      '10000000-0000-0000-0000-000000000001',
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Pendahuluan Fungsi Kuadrat"}]},{"type":"paragraph","content":[{"type":"text","text":"Fungsi kuadrat merupakan topik penting dalam Penalaran Matematika."}]}]}'::jsonb
    ),
    (
      '30000000-0000-0000-0000-000000000002',
      'learning',
      'Literasi Bacaan & Identifikasi Ide Pokok',
      'Teknik skimming dan scanning untuk menemukan gagasan utama dalam bacaan panjang.',
      'diverifikasi',
      seed_author,
      '10000000-0000-0000-0000-000000000005',
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Gagasan utama dapat ditemukan dengan membaca struktur paragraf secara cermat."}]}]}'::jsonb
    ),
    (
      '30000000-0000-0000-0000-000000000003',
      'article',
      'Mengapa Kita Sulit Fokus Belajar di Era Distraksi Digital',
      'Ulasan singkat soal dopamin, notifikasi, dan cara otak memproses gangguan saat belajar.',
      'diverifikasi',
      seed_author,
      null,
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Fokus bukan hanya soal kemauan, tetapi juga tentang mengatur gangguan di sekitar kita."}]}]}'::jsonb
    ),
    (
      '30000000-0000-0000-0000-000000000004',
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
    ('30000000-0000-0000-0000-000000000001'::uuid, 'fungsi-kuadrat'),
    ('30000000-0000-0000-0000-000000000001'::uuid, 'materi'),
    ('30000000-0000-0000-0000-000000000002'::uuid, 'literasi-digital'),
    ('30000000-0000-0000-0000-000000000002'::uuid, 'materi'),
    ('30000000-0000-0000-0000-000000000003'::uuid, 'opini'),
    ('30000000-0000-0000-0000-000000000004'::uuid, 'tips-belajar'),
    ('30000000-0000-0000-0000-000000000004'::uuid, 'panduan')
  ) as seed(content_id, tag_slug)
  join public.content c on c.id = seed.content_id
  join public.tags t on t.slug = seed.tag_slug
  on conflict (content_id, tag_id) do nothing;
end;
$$;
