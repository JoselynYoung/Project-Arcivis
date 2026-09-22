import { getLearningMaterials } from '$lib/services/learning';

export async function load() {
	const { data, error } = await getLearningMaterials();

	return { materials: data, learningError: error };
}
