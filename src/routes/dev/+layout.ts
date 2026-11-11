import { dev } from '$app/env';
import { error } from '@sveltejs/kit';

// Dev harnesses (auth/RLS/storage probes) never render in production builds.
export function load() {
	if (!dev) {
		throw error(404, 'Not found');
	}
}
