import { supabase } from '$lib/services/supabaseClient';

export interface PublicSchedule {
	id: string;
	title: string;
	event_date: string;
}

export async function getPublicSchedules(): Promise<{
	data: PublicSchedule[];
	error: string | null;
}> {
	const { data, error } = await supabase
		.from('schedules')
		.select('id, title, event_date')
		.order('event_date');

	if (error) {
		return { data: [], error: error.message };
	}

	return { data: data ?? [], error: null };
}
