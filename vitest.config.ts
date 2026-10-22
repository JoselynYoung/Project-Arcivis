import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	plugins: [tailwindcss(), svelte({ compilerOptions: { runes: true } }), svelteTesting()],
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			'$env/static/public': path.resolve('./vitest-env.ts')
		}
	},
	ssr: {
		noExternal: ['@lucide/svelte']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.ts']
	}
});
