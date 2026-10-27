import { getPublicSchedules } from '$lib/services/schedules';
import { getLearningMaterials } from '$lib/services/learning';
import { getPracticePackages } from '$lib/services/practice';
import { SCHEDULE_DOT_COLOR_FALLBACK, SCHEDULE_DOT_COLORS } from '$lib/constants/publicData';

const monthFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long' });
const calendarFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });

export async function load() {
	const [{ data: schedulesData, error }, { data: materials }, { data: packages }] =
		await Promise.all([getPublicSchedules(), getLearningMaterials(), getPracticePackages()]);

	return {
		schedules: schedulesData.map((schedule) => {
			const eventDate = new Date(`${schedule.event_date}T00:00:00`);

			return {
				id: schedule.id,
				tanggal: eventDate.getDate(),
				iso: `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`,
				label: schedule.title,
				warna: SCHEDULE_DOT_COLORS[schedule.title] ?? SCHEDULE_DOT_COLOR_FALLBACK,
				monthLabel: monthFormatter.format(eventDate),
				calendarLabel: calendarFormatter.format(eventDate)
			};
		}),
		scheduleError: error,
		recentLearning: materials.slice(0, 3).map((material) => ({
			id: material.id,
			subject: material.mapel,
			title: material.judul
		})),
		recentPractice: packages.slice(0, 3).map((pkg) => ({
			id: pkg.id,
			subject: pkg.subject,
			title: pkg.title
		}))
	};
}
