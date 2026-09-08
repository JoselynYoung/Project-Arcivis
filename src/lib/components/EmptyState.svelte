<script lang="ts">
	import type { Component } from 'svelte';

	let {
		icon = undefined,
		title,
		description,
		onReset = undefined,
		resetLabel = 'Reset Filter'
	}: {
		icon?: Component;
		title: string;
		description: string;
		onReset?: () => void;
		resetLabel?: string;
	} = $props();
</script>

<div
	class="mx-auto my-12 max-w-md rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center"
	role="status"
>
	{#if icon}
		<div
			class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"
			aria-hidden="true"
		>
			<icon size={24}></icon>
		</div>
	{/if}
	<h3 class="mb-1.5 text-base font-bold text-slate-800">{title}</h3>
	<p class="mb-5 text-sm text-slate-500">
		{description}
	</p>
	{#if onReset}
		<button
			type="button"
			onclick={onReset}
			class="cursor-pointer rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
		>
			{resetLabel}
		</button>
	{/if}
</div>
