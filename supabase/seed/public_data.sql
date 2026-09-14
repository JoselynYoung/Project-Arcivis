insert into public.subjects (id, name, icon_name)
values
	('10000000-0000-0000-0000-000000000001', 'Matematika', 'Calculator'),
	('10000000-0000-0000-0000-000000000002', 'Fisika', 'Atom'),
	('10000000-0000-0000-0000-000000000003', 'Kimia', 'FlaskConical'),
	('10000000-0000-0000-0000-000000000004', 'Biologi', 'Leaf'),
	('10000000-0000-0000-0000-000000000005', 'B.Indonesia', 'BookOpen'),
	('10000000-0000-0000-0000-000000000006', 'B.Inggris', 'Languages'),
	('10000000-0000-0000-0000-000000000007', 'Penalaran', 'Brain')
on conflict (id) do update
set name = excluded.name, icon_name = excluded.icon_name;

insert into public.schedules (id, title, event_date)
values
	('20000000-0000-0000-0000-000000000001', 'Pendaftaran SNBT dibuka', '2026-07-25'),
	('20000000-0000-0000-0000-000000000002', 'Simulasi UTBK nasional', '2026-07-12'),
	('20000000-0000-0000-0000-000000000003', 'Batas akhir isi PDSS', '2026-07-30')
on conflict (id) do update
set title = excluded.title, event_date = excluded.event_date;
