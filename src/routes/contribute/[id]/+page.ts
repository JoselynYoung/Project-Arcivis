import type { PageLoad } from './$types';
import { getOwnContent } from '$lib/services/revisions';

export const load: PageLoad = async ({ params }) => {
	const { data, error } = await getOwnContent(params.id);

	return {
		content: data,
		contentError: error
	};
};
