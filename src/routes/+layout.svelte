<script lang="ts">
	import './layout.css';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import { Home, BookOpen, Layers, Newspaper, Settings, BarChart3, User, LayoutGrid, X } from '@lucide/svelte';

	let { children } = $props();

	let isBerandaActive = $derived(page.url.pathname === '/');
	let isLatihanActive = $derived(page.url.pathname === '/latihan');

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

<div class="flex min-h-screen">

	<nav class="hidden md:flex flex-col sticky top-0 bg-white/40 backdrop-blur-md text-slate-700 h-screen py-4 rounded-r-2xl border-r border-primary-100/60 shadow-sm z-20 transition-all duration-300 {sideBar ? 'w-64 px-4' : 'w-20 px-3'}">

		<button onclick={toggleSidebar} type="button"
			class="flex items-center gap-2 h-16 mb-8 w-full {sideBar ? 'justify-start' : 'justify-center'}">
			<Home size={24} class="text-primary-600 shrink-0" />
			{#if sideBar}
				<span class="font-bold text-xl text-primary-600 animate-fade-in">Arcivis</span>
			{/if}
		</button>

		<div class="flex flex-col gap-2 flex-1">

			<a href={resolve('/')}
				class="flex items-center gap-3 rounded-xl cursor-pointer font-medium transition-all {sideBar ? 'w-full justify-start p-2.5' : 'w-12 h-12 justify-center mx-auto'} {isBerandaActive ? 'bg-linear-to-br from-primary-800 to-primary-700 text-white shadow-xs' : 'text-slate-500 hover:bg-primary-50 hover:text-primary-700'}">
				<Home size={20} class="shrink-0" />
				{#if sideBar}<span>Beranda</span>{/if}
			</a>

			<a href={resolve('/latihan')}
				class="flex items-center gap-3 rounded-xl cursor-pointer font-medium transition-all {sideBar ? 'w-full justify-start p-2.5' : 'w-12 h-12 justify-center mx-auto'} {isLatihanActive ? 'bg-linear-to-br from-primary-800 to-primary-700 text-white shadow-xs' : 'text-slate-500 hover:bg-primary-50 hover:text-primary-700'}">
				<BookOpen size={20} class="shrink-0" />
				{#if sideBar}<span>Latihan</span>{/if}
			</a>

			<span class="flex items-center gap-3 rounded-xl cursor-pointer text-slate-500 hover:bg-primary-50 hover:text-primary-700 transition-all {sideBar ? 'w-full justify-start p-2.5' : 'w-12 h-12 justify-center mx-auto'}">
				<Layers size={20} class="shrink-0" />
				{#if sideBar}<span>Materi</span>{/if}
			</span>

			<span class="flex items-center gap-3 rounded-xl cursor-pointer text-slate-500 hover:bg-primary-50 hover:text-primary-700 transition-all {sideBar ? 'w-full justify-start p-2.5' : 'w-12 h-12 justify-center mx-auto'}">
				<Newspaper size={20} class="shrink-0" />
				{#if sideBar}<span>Bacaan</span>{/if}
			</span>

			<span class="flex items-center gap-3 rounded-xl cursor-pointer text-slate-500 hover:bg-primary-50 hover:text-primary-700 transition-all {sideBar ? 'w-full justify-start p-2.5' : 'w-12 h-12 justify-center mx-auto'}">
				<BarChart3 size={20} class="shrink-0" />
				{#if sideBar}<span>Statistik</span>{/if}
			</span>

		</div>

		<div class="flex flex-col gap-2 mt-auto border-t border-primary-100/40 pt-4">
			<span class="flex items-center gap-3 rounded-xl cursor-pointer text-slate-500 hover:bg-primary-50 hover:text-primary-700 transition-all {sideBar ? 'w-full justify-start p-2.5' : 'w-12 h-12 justify-center mx-auto'}">
				<Settings size={20} class="shrink-0" />
				{#if sideBar}<span>Pengaturan</span>{/if}
			</span>
			<span class="flex items-center gap-3 rounded-xl cursor-pointer text-slate-500 hover:bg-primary-50 hover:text-primary-700 transition-all {sideBar ? 'w-full justify-start p-2.5' : 'w-12 h-12 justify-center mx-auto'}">
				<User size={20} class="shrink-0" />
				{#if sideBar}<span>Akun</span>{/if}
			</span>
		</div>

	</nav>

	<main class="flex-1 bg-white bg-[radial-gradient(var(--color-primary-200)_1px,transparent_1px)] bg-size-[24px_24px] relative pb-24 md:pb-8">
		<div class="absolute inset-0 bg-linear-to-r from-primary-50/60 to-transparent"></div>
		<div class="relative z-10 p-8">
			{@render children()}
		</div>
	</main>

	{#if isMobileMenuOpen}
		<div class="md:hidden fixed bottom-24 left-4 right-4 bg-white/90 backdrop-blur-lg border border-primary-100/60 rounded-3xl p-6 shadow-xl z-40">
			<div class="grid grid-cols-3 gap-4">

				<button type="button" class="flex flex-col items-center gap-2">
					<span class="h-14 w-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-700">
						<BarChart3 size={22} />
					</span>
					<span class="text-xs text-slate-600 text-center">Statistik</span>
				</button>

				<button type="button" class="flex flex-col items-center gap-2">
					<span class="h-14 w-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-700">
						<Settings size={22} />
					</span>
					<span class="text-xs text-slate-600 text-center">Pengaturan</span>
				</button>

				<button type="button" class="flex flex-col items-center gap-2">
					<span class="h-14 w-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-700">
						<User size={22} />
					</span>
					<span class="text-xs text-slate-600 text-center">Akun</span>
				</button>

			</div>
		</div>
	{/if}

	<div class="md:hidden fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md border border-primary-100/60 h-16 rounded-full shadow-lg z-50 flex items-center justify-around px-2">
		<a href={resolve('/')}
			class="w-12 h-12 rounded-full flex items-center justify-center transition-colors {isBerandaActive ? 'bg-primary-50 text-primary-700' : 'text-slate-400 hover:text-primary-600'}">
			<Home size={22} />
		</a>
		<a href={resolve('/latihan')}
			class="w-12 h-12 rounded-full flex items-center justify-center transition-colors {isLatihanActive ? 'bg-primary-50 text-primary-700' : 'text-slate-400 hover:text-primary-600'}">
			<BookOpen size={22} />
		</a>
        <button onclick={toggleMobileMenu} type="button" class="w-12 h-12 flex items-center justify-center text-slate-600">
			{#if isMobileMenuOpen}
				<X size={22} class="text-primary-600" />
			{:else}
				<LayoutGrid size={22} />
			{/if}
		</button>
		<button type="button" class="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary-600">
			<Layers size={22} />
		</button>
		<button type="button" class="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary-600">
			<Newspaper size={22} />
		</button>
		
	</div>

</div>