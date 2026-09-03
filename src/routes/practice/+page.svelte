<script lang="ts">
	import { resolve } from '$app/paths';
	import { Calculator, Atom, FlaskConical, Leaf, BookOpen, Languages, Brain } from '@lucide/svelte';
	import { subjects, practicePackages } from '$lib/mocks/practice';

	// Group practice packages by their 'group' field
	const groupedPackages = $derived(
		practicePackages.reduce(
			(groups, pkg) => {
				const group = groups.find((g) => g.name === pkg.group);
				if (group) {
					group.packages.push(pkg);
				} else {
					groups.push({ name: pkg.group, packages: [pkg] });
				}
				return groups;
			},
			[] as { name: string; packages: typeof practicePackages }[]
		)
	);
</script>

<div class="mb-8">
	<label for="search-input" class="sr-only">Cari paket soal atau topik</label>
	<input
		id="search-input"
		type="text"
		placeholder="Cari paket soal atau topik..."
		class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 focus:ring-2 focus:ring-primary-600 focus:outline-none"
	/>
</div>

<div class="mb-10">
	<p class="mb-3 text-sm font-medium text-slate-500">Tempat Latihan Soal</p>
	<ul class="m-0 grid list-none grid-cols-4 gap-3 p-0 sm:grid-cols-7">
		{#each subjects as subject (subject.name)}
			<li>
				<button
					type="button"
					class="flex w-full flex-col items-center gap-2"
					aria-label={`Latihan ${subject.name}`}
				>
					<span class="flex h-12 w-12 items-center justify-center rounded-2xl {subject.color}">
						{#if subject.iconName === 'Calculator'}
							<Calculator size={22} />
						{:else if subject.iconName === 'Atom'}
							<Atom size={22} />
						{:else if subject.iconName === 'FlaskConical'}
							<FlaskConical size={22} />
						{:else if subject.iconName === 'Leaf'}
							<Leaf size={22} />
						{:else if subject.iconName === 'BookOpen'}
							<BookOpen size={22} />
						{:else if subject.iconName === 'Languages'}
							<Languages size={22} />
						{:else if subject.iconName === 'Brain'}
							<Brain size={22} />
						{/if}
					</span>
					<span class="text-center text-xs leading-tight text-slate-600">{subject.name}</span>
				</button>
			</li>
		{/each}
	</ul>
</div>

{#each groupedPackages as group (group.name)}
	<div class="mb-8 sm:mb-10">
		<p class="mb-3 text-base font-bold text-slate-800 sm:mb-4 sm:text-lg">{group.name}</p>

		<ul
			class="m-0 flex w-full max-w-full scrollbar-thin list-none gap-3 overflow-x-auto p-0 pb-3 sm:gap-4"
		>
			{#each group.packages as pkg (pkg.id)}
				<li class="w-40 shrink-0 sm:w-44">
					<a
						href={resolve('/practice/[ID]', { ID: String(pkg.id) })}
						class="hover:border-primary-300 block rounded-xl border-2 border-primary-100 bg-white p-3 shadow-sm transition-colors"
						aria-label={`${pkg.title}: ${pkg.questionCount} Soal`}
					>
						<div class="mb-3 h-24 rounded-lg bg-primary-50"></div>
						<p class="mb-0.5 text-xs text-slate-400">{pkg.title}</p>
						<p class="text-sm leading-snug font-medium text-slate-800">
							{pkg.questionCount} Soal
						</p>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/each}
