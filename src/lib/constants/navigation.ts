import type { RoutePath } from './routes';
import { Home, BookOpen, Layers, Newspaper, BarChart3, Settings, User } from '@lucide/svelte';
import { ROUTES } from './routes';

export const navItems = [
	{ href: ROUTES.home, label: 'Home', icon: Home },
	{ href: ROUTES.practice, label: 'Practice', icon: BookOpen },
	{ href: ROUTES.learning, label: 'Learning', icon: Layers },
	{ href: ROUTES.articles, label: 'Articles', icon: Newspaper },
	{ href: ROUTES.statistics, label: 'Statistics', icon: BarChart3 },
	{ href: ROUTES.settings, label: 'Settings', icon: Settings },
	{ href: ROUTES.profile, label: 'Profile', icon: User }
] as const;

export const desktopFooterHrefs: RoutePath[] = [ROUTES.settings, ROUTES.profile];
export const mobileDrawerHrefs: RoutePath[] = [ROUTES.statistics, ROUTES.settings, ROUTES.profile];

export const desktopMainNav = navItems.filter((item) => !desktopFooterHrefs.some((href) => href === item.href));
export const desktopFooterNav = navItems.filter((item) => desktopFooterHrefs.some((href) => href === item.href));

export const mobileBottomNav = navItems.filter((item) => !mobileDrawerHrefs.some((href) => href === item.href));
export const mobileDrawerNav = navItems.filter((item) => mobileDrawerHrefs.some((href) => href === item.href));
