export const ROUTES = {
	home: '/',
	practice: '/practice',
	learning: '/learning',
	articles: '/articles',
	statistics: '/statistics',
	settings: '/settings',
	profile: '/profile'
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export function getPracticeDetailRoute(id: string | number) {
	return `${ROUTES.practice}/${id}`;
}
