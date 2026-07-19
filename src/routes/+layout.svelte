<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen">

    <nav class="flex flex-col bg-white/40 backdrop-blur-md text-slate-700 h-screen p-4 rounded-r-2xl w-64 border-r border-primary-100/60 shadow-sm z-20">
        
        <div class="flex items-center justify-start h-16 mb-8 px-2">
            <span class="font-bold text-xl text-primary-600">edu.utbk</span>
        </div>

        <div class="flex flex-col gap-2 flex-1 px-2">
            <span class="p-2.5 bg-linear-to-br from-primary-800 to-primary-700 text-white font-medium rounded-xl cursor-pointer shadow-xs">Beranda</span>
            <span class="p-2.5 hover:bg-white/60 rounded-xl cursor-pointer text-slate-500 transition-colors">Latihan</span>    
			<span class="p-2.5 hover:bg-white/60 rounded-xl cursor-pointer text-slate-500 transition-colors">Materi</span>
			<span class="p-2.5 hover:bg-white/60 rounded-xl cursor-pointer text-slate-500 transition-colors">Bacaan</span>
			<span class="p-2.5 hover:bg-white/60 rounded-xl cursor-pointer text-slate-500 transition-colors">Statistik</span>
        </div>

        <div class="flex flex-col gap-2 mt-auto border-t border-primary-100/40 pt-4 px-2">
			<span class="p-2.5 hover:bg-white/60 rounded-xl cursor-pointer text-slate-500 transition-colors">Pengaturan</span>
            <span class="p-2.5 hover:bg-white/60 rounded-xl cursor-pointer text-slate-500 transition-colors">Akun</span>
        </div>

    </nav>

    <main class="flex-1 bg-white bg-[radial-gradient(var(--color-primary-200)_1px,transparent_1px)] bg-[size:24px_24px] relative">
    	<div class="absolute inset-0 bg-linear-to-r from-primary-50/60 to-transparent"></div>
    	<div class="relative z-10 p-8">
        	{@render children()}
    	</div>
	</main>
</div>