import { getArticle } from '$lib/services/articles';

export async function load({ params }) {
	const { data, error } = await getArticle(params.id);

	return { article: data, articlesError: error };
}
