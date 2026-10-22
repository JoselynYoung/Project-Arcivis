import { SUBJECT_COLORS, SUBJECT_COLOR_FALLBACK } from '$lib/constants/publicData';
import { getPublicSubjects } from '$lib/services/subjects';
import { getPracticePackage } from '$lib/services/practice';

export async function load({ params }) {
	const [{ data: subjectData, error: subjectError }, { data: pkg, error: packageError }] =
		await Promise.all([getPublicSubjects(), getPracticePackage(params.id)]);

	return {
		subjects: subjectData.map((subject) => ({
			name: subject.name,
			iconName: subject.icon_name ?? '',
			color: SUBJECT_COLORS[subject.name] ?? SUBJECT_COLOR_FALLBACK
		})),
		subjectError,
		pkg,
		packageError
	};
}
