<script lang="ts">
	import './layout.css';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import { Home, LayoutGrid, X } from '@lucide/svelte';
	import {
		desktopMainNav,
		desktopFooterNav,
		mobileBottomNav,
		mobileDrawerNav
	} from '$lib/constants/navigation';

let { children } = $props();

// Active Route Check
	function isRouteActive(path: string): boolean {
		const current = page.url.pathname;
		return path === '/' ? current === '/' : current.startsWith(path);
	}

	// Sidebar State
	let sideBar = $state(true);
	let isMobileMenuOpen = $state(false);

	function toggleSidebar() {
		sideBar = !sideBar;
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen w-full max-w-full">

	<!-- Desktop Sidebar -->
	<nav
		class="hidden md:flex flex-col sticky top-0 bg-white/40 backdrop-blur-md text-slate-700 h-screen py-4 rounded-r-2xl border-r border-primary-100/60 shadow-sm z-20 transition-all duration-300 {sideBar ? 'w-64 px-4' : 'w-20 px-3'}"
		aria-label="Navigasi utama"
	>
		<!-- Logo & Toggle Button -->
		<button
			onclick={toggleSidebar}
			type="button"
			class="flex items-center gap-2 h-16 mb-8 w-full {sideBar ? 'justify-start' : 'justify-center'}"
			aria-label={sideBar ? 'Perkecil sidebar' : 'Perbesar sidebar'}
		>
			<Home size={24} class="text-primary-600 shrink-0" />
			{#if sideBar}
				<span class="font-bold text-xl text-primary-600 animate-fade-in">Arcivis</span>
			{/if}
		</button>

		<!-- Primary Nav -->
		<div class="flex flex-col gap-2 flex-1">
			{#each desktopMainNav as item (item.href)}
				{@const active = isRouteActive(item.href)}
				<a
					href={resolve(item.href)}
					class="flex items-center gap-3 rounded-xl cursor-pointer font-medium transition-all {sideBar ? 'w-full justify-start p-2.5' : 'w-12 h-12 justify-center mx-auto'} {active ? 'bg-linear-to-br from-primary-800 to-primary-700 text-white shadow-xs' : 'text-slate-500 hover:bg-primary-50 hover:text-primary-700'}"
					aria-current={active ? 'page' : undefined}
				>
					<item.icon size={20} class="shrink-0" />
					{#if sideBar}<span>{item.label}</span>{/if}
				</a>
			{/each}
		</div>

		<!-- Secondary Nav -->
		<div class="flex flex-col gap-2 mt-auto border-t border-primary-100/40 pt-4">
			{#each desktopFooterNav as item (item.href)}
				{@const active = isRouteActive(item.href)}
				<a
					href={resolve(item.href)}
					class="flex items-center gap-3 rounded-xl cursor-pointer font-medium transition-all {sideBar ? 'w-full justify-start p-2.5' : 'w-12 h-12 justify-center mx-auto'} {active ? 'bg-linear-to-br from-primary-800 to-primary-700 text-white shadow-xs' : 'text-slate-500 hover:bg-primary-50 hover:text-primary-700'}"
					aria-current={active ? 'page' : undefined}
				>
					<item.icon size={20} class="shrink-0" />
					{#if sideBar}<span>{item.label}</span>{/if}
				</a>
			{/each}
		</div>
	</nav>

	<!-- Main Content -->
	<main class="flex-1 min-w-0 bg-white bg-[radial-gradient(var(--color-primary-200)_1px,transparent_1px)] bg-size-[24px_24px] relative pb-24 md:pb-8">
		<div class="absolute inset-0 bg-linear-to-r from-primary-50/60 to-transparent"></div>
		<div class="relative z-10 p-4 sm:p-6 md:p-8">
			{@render children()}
		</div>
	</main>

	<!-- Mobile Drawer Menu -->
	{#if isMobileMenuOpen}
		<div
			class="md:hidden fixed bottom-24 left-4 right-4 bg-white/90 backdrop-blur-lg border border-primary-100/60 rounded-3xl p-6 shadow-xl z-40"
			aria-label="Menu tambahan"
		>
			<div class="grid grid-cols-3 gap-4">
				{#each mobileDrawerNav as item (item.href)}
					<a href={resolve(item.href)} class="flex flex-col items-center gap-2">
						<span class="h-14 w-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-700">
							<item.icon size={22} />
						</span>
						<span class="text-xs text-slate-600 text-center">{item.label}</span>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Mobile Bottom Nav -->
	<div
		class="md:hidden fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md border border-primary-100/60 h-16 rounded-full shadow-lg z-50 flex items-center justify-around px-2"
		aria-label="Navigasi mobile"
		role="navigation"
	>
		{#each mobileBottomNav as item (item.href)}
			{@const active = isRouteActive(item.href)}
			<a
				href={resolve(item.href)}
				class="w-12 h-12 rounded-full flex items-center justify-center transition-colors {active ? 'bg-primary-50 text-primary-700' : 'text-slate-400 hover:text-primary-600'}"
				aria-label={item.label}
				aria-current={active ? 'page' : undefined}
			>
				<item.icon size={22} />
			</a>
		{/each}

		<!-- Drawer Toggle -->
		<button
			onclick={toggleMobileMenu}
			type="button"
			class="w-12 h-12 rounded-full flex items-center justify-center transition-colors text-slate-400 hover:text-primary-600"
			aria-label={isMobileMenuOpen ? 'Tutup menu tambahan' : 'Buka menu tambahan'}
			aria-expanded={isMobileMenuOpen}
		>
			{#if isMobileMenuOpen}
				<X size={22} class="text-primary-600" />
			{:else}
				<LayoutGrid size={22} />
			{/if}
		</button>
	</div>

</div>