import { supabase } from './supabaseClient';

// Public author directory (id + display name only, see 0019). Use this
// instead of embedding the profiles table, which is no longer readable.
export async function getAuthorNames(ids: (string | null)[]): Promise<Map<string, string>> {
	const unique = [...new Set(ids.filter((id): id is string => !!id))];
	if (unique.length === 0) return new Map();

	const { data, error } = await supabase.rpc('get_author_names', { ids: unique });

	if (error) {
		console.error('[authorNames] Lookup failed (non-blocking):', error.message);
		return new Map();
	}

	const rows = Array.isArray(data) ? data.filter(isAuthorRow) : [];
	return new Map(rows.map((row) => [row.id, row.name]));
}

function isAuthorRow(value: unknown): value is { id: string; name: string } {
	if (!value || typeof value !== 'object') return false;
	if (!('id' in value) || !('name' in value)) return false;
	return typeof value.id === 'string' && typeof value.name === 'string';
}
