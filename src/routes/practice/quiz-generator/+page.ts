import { SUBJECT_COLORS, SUBJECT_COLOR_FALLBACK } from '$lib/constants/publicData';
import { getPublicSubjects } from '$lib/services/subjects';
import { getPracticeTopics } from '$lib/services/questions';

export async function load() {
	const { data, error } = await getPublicSubjects();
	const { data: topicRows, error: topicError } = await getPracticeTopics();

	const topicsBySubject: Record<string, string[]> = {};
	for (const row of topicRows) {
		const subject = data.find((item) => item.id === row.subjectId);
		if (!subject) continue;
		(topicsBySubject[subject.name] ??= []).push(row.topic);
	}
	for (const topics of Object.values(topicsBySubject)) topics.sort();

	return {
		subjects: data.map((subject) => ({
			id: subject.id,
			name: subject.name,
			iconName: subject.icon_name ?? '',
			color: SUBJECT_COLORS[subject.name] ?? SUBJECT_COLOR_FALLBACK
		})),
		topicsBySubject,
		subjectError: error ?? topicError
	};
}
