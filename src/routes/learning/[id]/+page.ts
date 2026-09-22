import { getLearningMaterial } from '$lib/services/learning';

export async function load({ params }) {
	const { data, error } = await getLearningMaterial(params.id);

	return { material: data, learningError: error };
}
