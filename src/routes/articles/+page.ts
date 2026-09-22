import { getArticles } from '$lib/services/articles';

export async function load() {
	const { data, error } = await getArticles();

	return { articles: data, articlesError: error };
}
