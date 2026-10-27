import { supabase } from './supabaseClient';

export type ContributionStatus = 'draft' | 'direview' | 'diverifikasi';

export interface ContributionItem {
	id: string;
	judul: string;
	tag: string;
	status: ContributionStatus;
}

export interface ProfilData {
	nama: string;
	role: string;
	bio: string;
	createdAt: string;
	bacaan: ContributionItem[];
	latihan: ContributionItem[];
	materi: ContributionItem[];
}

interface ContributionRow {
	id: string;
	title: string;
	type: string;
	status: string;
	subject: { name: string } | null;
}

export async function getProfil(): Promise<{ data: ProfilData | null; error: string | null }> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { data: null, error: null };

	const [{ data: profile, error: profileError }, { data: rows, error: contentError }] =
		await Promise.all([
			supabase
				.from('profiles')
				.select('name, role, bio, created_at')
				.eq('id', user.id)
				.maybeSingle(),
			supabase
				.from('content')
				.select(`id, title, type, status, subject:subjects(name)`)
				.eq('author_id', user.id)
				.order('updated_at', { ascending: false })
		]);

	if (profileError) return { data: null, error: profileError.message };
	if (contentError) return { data: null, error: contentError.message };

	const toItem = (row: ContributionRow): ContributionItem => ({
		id: row.id,
		judul: row.title,
		tag: row.subject?.name ?? 'Umum',
		status:
			row.status === 'diverifikasi' || row.status === 'direview'
				? (row.status as ContributionStatus)
				: 'draft'
	});

	const byType: Record<'bacaan' | 'latihan' | 'materi', ContributionItem[]> = {
		bacaan: [],
		latihan: [],
		materi: []
	};
	for (const row of (rows ?? []) as ContributionRow[]) {
		const key = row.type === 'article' ? 'bacaan' : row.type === 'practice' ? 'latihan' : 'materi';
		byType[key].push(toItem(row));
	}

	return {
		data: {
			nama: profile?.name ?? 'Pengunjung',
			role: profile?.role ?? 'member',
			bio: profile?.bio ?? '',
			createdAt: profile?.created_at ?? '',
			bacaan: byType.bacaan,
			latihan: byType.latihan,
			materi: byType.materi
		},
		error: null
	};
}
