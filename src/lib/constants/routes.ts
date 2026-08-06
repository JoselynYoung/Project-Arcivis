/**
 * ROUTING CONVENTIONS:
 * /{module}              -> Collection Page (grid / list)
 * /{module}/[id]          -> Detail Page (metadata, overview, action buttons)
 * /{module}/[id]/{action}  -> Action Page (dedicated reader / quiz execution flow)
 *
 * Explicit Module Actions:
 * - learning  : action = 'read'  -> /learning/[id]/read
 * - articles  : action = 'read'  -> /articles/[id]/read
 * - practice  : action = 'quiz'  -> /practice/[id]/quiz (locked for Stage 3 migration)
 * - library   : Download/Buy trigger buttons directly on Detail Page (no separate action route)
 */

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
	return `/practice/${id}`;
}

export function getLearningDetailRoute(id: string | number) {
	return `/learning/${id}`;
}

export function getLearningReadRoute(id: string | number) {
	return `/learning/${id}/read`;
}

export function getArticleDetailRoute(id: string | number) {
	return `/articles/${id}`;
}
export function getArticleReadRoute(id: string | number) {
	return `/articles/${id}/read`;
}