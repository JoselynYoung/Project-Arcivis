/**
 * Routing Conventions:
 * /{module}                -> Collection Page
 * /{module}/[id]           -> Detail Page
 * /{module}/[id]/{action}  -> Action Page
 *
 * Explicit Module Actions:
 * - learning  : action = 'read'
 * - articles  : action = 'read'
 * - practice  : action = 'quiz'
 */

export const ROUTES = {
	home: '/',
	practice: '/practice',
	practiceQuizGenerator: '/practice/quiz-generator',
	learning: '/learning',
	articles: '/articles',
	statistics: '/statistics',
	settings: '/settings',
	profile: '/profile'
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
