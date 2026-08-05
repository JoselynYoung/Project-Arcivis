<script lang="ts">
  import {
    Calculator,
    Atom,
    FlaskConical,
    Leaf,
    BookOpen,
    Languages,
    Brain
  } from '@lucide/svelte';
  import { subjects, practicePackages } from '$lib/mocks/practice';
  import { getPracticeDetailRoute } from '$lib/constants/routes';

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
    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600"
  />
</div>

<div class="mb-10">
  <p class="text-sm font-medium text-slate-500 mb-3">Tempat Latihan Soal</p>
  <ul class="grid grid-cols-4 sm:grid-cols-7 gap-3 list-none p-0 m-0">
    {#each subjects as subject (subject.name)}
      <li>
        <button
          type="button"
          class="flex flex-col items-center gap-2 w-full"
          aria-label={`Latihan ${subject.name}`}
        >
          <span class="h-12 w-12 rounded-2xl flex items-center justify-center {subject.color}">
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
          <span class="text-xs text-slate-600 text-center leading-tight">{subject.name}</span>
        </button>
      </li>
    {/each}
  </ul>
</div>

{#each groupedPackages as group (group.name)}
  <div class="mb-8 sm:mb-10">
    <p class="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4">{group.name}</p>

    <ul
      class="flex gap-3 sm:gap-4 overflow-x-auto pb-3 w-full max-w-full scrollbar-thin list-none p-0 m-0"
    >
      {#each group.packages as pkg (pkg.id)}
        <li class="shrink-0 w-40 sm:w-44">
          <a
            href={getPracticeDetailRoute(pkg.id)}
            class="block bg-white rounded-xl shadow-sm p-3 border-2 border-primary-100 hover:border-primary-300 transition-colors"
            aria-label={`${pkg.title}: ${pkg.questionCount} Soal`}
          >
            <div class="bg-primary-50 rounded-lg h-24 mb-3"></div>
            <p class="text-xs text-slate-400 mb-0.5">{pkg.title}</p>
            <p class="text-sm font-medium text-slate-800 leading-snug">
              {pkg.questionCount} Soal
            </p>
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/each}