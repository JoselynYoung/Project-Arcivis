import { SUBJECT_COLORS, SUBJECT_COLOR_FALLBACK } from '$lib/constants/publicData';
import { getPublicSubjects } from '$lib/services/subjects';
import { getPracticePackages } from '$lib/services/practice';

export async function load() {
	const [{ data: subjectData, error: subjectError }, { data: packages, error: packagesError }] =
		await Promise.all([getPublicSubjects(), getPracticePackages()]);

	return {
		subjects: subjectData.map((subject) => ({
			name: subject.name,
			iconName: subject.icon_name ?? '',
			color: SUBJECT_COLORS[subject.name] ?? SUBJECT_COLOR_FALLBACK
		})),
		subjectError,
		packages,
		packagesError
	};
}
