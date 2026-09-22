import { getLearningMaterial } from '$lib/services/learning';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { data, error } = await getLearningMaterial(params.id);

	return { material: data, learningError: error };
};
