import { supabase } from './supabaseClient';

export async function getBookmarkIds(): Promise<{ data: Set<string>; error: string | null }> {
	const { data, error } = await supabase.from('bookmarks').select('content_id');

	if (error) {
		return { data: new Set(), error: error.message };
	}

	return { data: new Set((data ?? []).map((row) => row.content_id)), error: null };
}

export async function toggleBookmark(contentId: string): Promise<{
	saved: boolean;
	signedIn: boolean;
	error: string | null;
}> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { saved: false, signedIn: false, error: 'Not signed in' };

	const { data: row, error: readError } = await supabase
		.from('bookmarks')
		.select('content_id')
		.eq('content_id', contentId)
		.maybeSingle();

	if (readError) {
		return { saved: false, signedIn: true, error: readError.message };
	}

	if (row) {
		const { error } = await supabase.from('bookmarks').delete().eq('content_id', contentId);
		return { saved: false, signedIn: true, error: error?.message ?? null };
	}

	const { error } = await supabase
		.from('bookmarks')
		.insert({ user_id: user.id, content_id: contentId });
	return { saved: true, signedIn: true, error: error?.message ?? null };
}
