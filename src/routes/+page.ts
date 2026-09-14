import { getPublicSchedules } from '$lib/services/schedules';
import { SCHEDULE_DOT_COLOR_FALLBACK, SCHEDULE_DOT_COLORS } from '$lib/constants/publicData';

const monthFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long' });
const calendarFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });

export async function load() {
	const { data, error } = await getPublicSchedules();

	return {
		schedules: data.map((schedule) => {
			const eventDate = new Date(`${schedule.event_date}T00:00:00`);

			return {
				tanggal: eventDate.getDate(),
				label: schedule.title,
				warna: SCHEDULE_DOT_COLORS[schedule.title] ?? SCHEDULE_DOT_COLOR_FALLBACK,
				monthLabel: monthFormatter.format(eventDate),
				calendarLabel: calendarFormatter.format(eventDate)
			};
		}),
		scheduleError: error
	};
}
