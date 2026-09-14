import { SUBJECT_COLORS, SUBJECT_COLOR_FALLBACK } from '$lib/constants/publicData';
import { getPublicSubjects } from '$lib/services/subjects';

export async function load() {
	const { data, error } = await getPublicSubjects();

	return {
		subjects: data.map((subject) => ({
			name: subject.name,
			iconName: subject.icon_name ?? '',
			color: SUBJECT_COLORS[subject.name] ?? SUBJECT_COLOR_FALLBACK
		})),
		subjectError: error
	};
}
