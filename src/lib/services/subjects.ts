import { supabase } from '$lib/services/supabaseClient';

export interface PublicSubject {
	id: string;
	name: string;
	icon_name: string | null;
}

export async function getPublicSubjects(): Promise<{
	data: PublicSubject[];
	error: string | null;
}> {
	const { data, error } = await supabase
		.from('subjects')
		.select('id, name, icon_name')
		.order('name');

	if (error) {
		return { data: [], error: error.message };
	}

	return { data: data ?? [], error: null };
}
