import { getPracticePackage } from '$lib/services/practice';
import { getQuestionsByContentId } from '$lib/services/questions';

export async function load({ params }) {
	const [{ data: pkg, error: packageError }, { data: questionList, error: questionsError }] =
		await Promise.all([getPracticePackage(params.id), getQuestionsByContentId(params.id)]);

	return {
		pkg,
		packageError,
		questionList,
		questionsError
	};
}
