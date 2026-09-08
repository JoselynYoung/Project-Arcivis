import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import FilterBar from './FilterBar.svelte';

describe('FilterBar', () => {
	const sortOptions = [
		{ id: 'terbaru', label: 'Terbaru' },
		{ id: 'az', label: 'Abjad A-Z' }
	];

	it('renders search input with placeholder', () => {
		render(FilterBar, {
			props: {
				searchPlaceholder: 'Cari materi...',
				sortOptions,
				selectedSort: 'terbaru'
			}
		});

		const input = screen.getByPlaceholderText('Cari materi...');
		expect(input).toBeDefined();
	});

	it('renders filter pills when options provided', () => {
		render(FilterBar, {
			props: {
				filterOptions: ['Semua', 'Matematika', 'Fisika'],
				selectedFilter: 'Semua',
				sortOptions,
				selectedSort: 'terbaru'
			}
		});

		expect(screen.getByRole('button', { name: 'Semua' })).toBeDefined();
		expect(screen.getByRole('button', { name: 'Matematika' })).toBeDefined();
		expect(screen.getByRole('button', { name: 'Fisika' })).toBeDefined();
	});

	it('renders sort dropdown button', () => {
		render(FilterBar, {
			props: {
				sortOptions,
				selectedSort: 'terbaru'
			}
		});

		expect(screen.getByText('Terbaru')).toBeDefined();
	});

	it('renders active filter bar when has active filters', () => {
		render(FilterBar, {
			props: {
				searchQuery: 'test',
				filterOptions: ['Semua'],
				selectedFilter: 'Semua',
				sortOptions,
				selectedSort: 'terbaru',
				onReset: () => {}
			}
		});

		expect(screen.getByText('Filter Aktif:')).toBeDefined();
		expect(screen.getByText('Reset Semua')).toBeDefined();
	});

	it('has accessible search input', () => {
		render(FilterBar, {
			props: {
				searchPlaceholder: 'Search articles...',
				sortOptions,
				selectedSort: 'terbaru'
			}
		});

		const input = screen.getByRole('textbox');
		expect(input.getAttribute('aria-label')).toBe('Search articles...');
	});
});
