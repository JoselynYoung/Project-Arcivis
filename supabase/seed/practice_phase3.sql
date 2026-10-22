-- Stage 6 Phase 3 smoke test seed
-- 1 practice package (diverifikasi) + 4 questions with valid string[] options.
-- Requires supabase/seed/public_data.sql (subjects) and content_phase2.sql (profile + tags) applied first.

do $$
declare
  seed_author uuid;
begin
  select id into seed_author from public.profiles order by id limit 1;

  if seed_author is null then
    raise exception 'Create a profile before applying practice_phase3.sql.';
  end if;

  insert into public.content (id, type, title, description, status, author_id, subject_id, body)
  values
    (
      '3a1c9f02-77b4-4e58-9d0a-1f6e8c5b2a10',
      'practice',
      'Paket Latihan Fungsi Kuadrat',
      'Empat soal pilihan ganda untuk menguji pemahaman fungsi kuadrat: akar-akar, titik puncak, dan diskriminan.',
      'diverifikasi',
      seed_author,
      '10000000-0000-0000-0000-000000000001',
      null
    )
  on conflict (id) do update set
    type = excluded.type,
    title = excluded.title,
    description = excluded.description,
    status = excluded.status,
    author_id = excluded.author_id,
    subject_id = excluded.subject_id,
    body = excluded.body;

  insert into public.questions (id, content_id, text, options, correct_index, explanation, difficulty, topic)
  values
    (
      '4b2d0e13-88c5-4a69-b1e2-2a7d9f6c3b21',
      '3a1c9f02-77b4-4e58-9d0a-1f6e8c5b2a10',
      'Akar-akar persamaan x² - 5x + 6 = 0 adalah ...',
      '["x = 2 atau x = 3", "x = -2 atau x = -3", "x = 1 atau x = 6", "x = -1 atau x = -6"]'::jsonb,
      0,
      'Faktorkan: (x - 2)(x - 3) = 0, sehingga x = 2 atau x = 3.',
      'Mudah',
      'Fungsi Kuadrat'
    ),
    (
      '5c3e1f24-99d6-4b7a-82f3-3b8e0a7d4c32',
      '3a1c9f02-77b4-4e58-9d0a-1f6e8c5b2a10',
      'Titik puncak grafik f(x) = x² - 4x + 1 adalah ...',
      '["(2, -3)", "(2, 3)", "(-2, -3)", "(4, 1)"]'::jsonb,
      0,
      'x = -b/2a = 2, y = f(2) = 4 - 8 + 1 = -3. Puncak (2, -3).',
      'Sedang',
      'Fungsi Kuadrat'
    ),
    (
      '6d4f2a35-aad7-4c8b-93a4-4c9f1b8e5d43',
      '3a1c9f02-77b4-4e58-9d0a-1f6e8c5b2a10',
      'Persamaan x² + 2x + 5 = 0 memiliki diskriminan D = ...',
      '["-16", "16", "-4", "24"]'::jsonb,
      0,
      'D = b² - 4ac = 4 - 20 = -16. Karena D < 0, akar bersifat imajiner.',
      'Sedang',
      'Fungsi Kuadrat'
    ),
    (
      '7e5a3b46-bbe8-4d9c-a4b5-5d0a2c9f6e54',
      '3a1c9f02-77b4-4e58-9d0a-1f6e8c5b2a10',
      'Jika f(x) = x² + px + 4 menyinggung sumbu x, maka nilai p yang memenuhi adalah ...',
      '["p = ±4", "p = 4 saja", "p = ±2", "p = -4 saja"]'::jsonb,
      0,
      'Menyinggung sumbu x berarti D = 0: p² - 16 = 0, sehingga p = ±4.',
      'Sulit',
      'Fungsi Kuadrat'
    )
  on conflict (id) do update set
    content_id = excluded.content_id,
    text = excluded.text,
    options = excluded.options,
    correct_index = excluded.correct_index,
    explanation = excluded.explanation,
    difficulty = excluded.difficulty,
    topic = excluded.topic;

  insert into public.content_tags (content_id, tag_id)
  select c.id, t.id
  from public.content c
  join public.tags t on t.slug = 'fungsi-kuadrat'
  where c.id = '3a1c9f02-77b4-4e58-9d0a-1f6e8c5b2a10'
  on conflict (content_id, tag_id) do nothing;
end;
$$;
