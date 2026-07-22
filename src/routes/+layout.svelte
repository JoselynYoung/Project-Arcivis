<script lang="ts">
    import './layout.css';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import favicon from '$lib/assets/favicon.svg';
    import { Home, BookOpen, Layers, Newspaper, Settings, Users, Trophy, BarChart3, User, ChevronUp,} from '@lucide/svelte';

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

    <nav class="hidden md:flex flex-col bg-white/40 backdrop-blur-md text-slate-700 h-screen py-4 rounded-r-2xl border-r border-primary-100/60 shadow-sm z-20 transition-all duration-300 {sideBar ? 'w-64 px-4' : 'w-20 px-3'}">

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
        <div class="md:hidden fixed bottom-24 left-4 right-4 bg-white/90 backdrop-blur-lg border border-primary-100/60 rounded-3xl p-6 shadow-xl z-40 flex flex-col gap-4 text-slate-600 transition-all">
            <span class="flex items-center gap-4 cursor-pointer p-1 hover:text-primary-600 font-medium">
                <Users size={20} class="text-primary-600" /> Sosial
            </span>
            <span class="flex items-center gap-4 cursor-pointer p-1 hover:text-primary-600 font-medium">
                <Trophy size={20} class="text-primary-600" /> Leaderboard
            </span>
            <span class="flex items-center gap-4 cursor-pointer p-1 hover:text-primary-600 font-medium">
                <BarChart3 size={20} class="text-primary-600" /> Statistik
            </span>
            <hr class="border-primary-100/40 my-1" />
            <span class="flex items-center gap-4 cursor-pointer p-1 hover:text-primary-600 font-medium">
                <Settings size={20} class="text-primary-600" /> Pengaturan
            </span>
            <span class="flex items-center gap-4 cursor-pointer p-1 hover:text-primary-600 font-medium">
                <User size={20} class="text-primary-600" /> Akun
            </span>
        </div>
    {/if}

    <div class="md:hidden fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md border border-primary-100/60 h-16 rounded-full shadow-lg z-50 flex items-center justify-around px-2">
        <button type="button" class="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-700">
            <Home size={22} />
        </button>
        <button type="button" class="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary-600">
            <BookOpen size={22} />
        </button>
        <button type="button" class="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary-600">
            <Layers size={22} />
        </button>
        <button type="button" class="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary-600">
            <Newspaper size={22} />
        </button>
        <button onclick={toggleMobileMenu} type="button" class="w-12 h-12 flex items-center justify-center text-slate-600 transition-transform duration-200 {isMobileMenuOpen ? 'rotate-180 text-primary-600' : ''}">
            <ChevronUp size={24} />
        </button>
    </div>

</div>