import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import EmptyState from './EmptyState.svelte';

describe('EmptyState', () => {
	it('renders title and description', () => {
		render(EmptyState, {
			props: {
				title: 'No Results',
				description: 'Try a different search.'
			}
		});

		expect(screen.getByText('No Results')).toBeDefined();
		expect(screen.getByText('Try a different search.')).toBeDefined();
	});

	it('renders reset button when onReset provided', () => {
		const onReset = vi.fn();
		render(EmptyState, {
			props: {
				title: 'Empty',
				description: 'Nothing here.',
				onReset
			}
		});

		const button = screen.getByRole('button', { name: 'Reset Filter' });
		expect(button).toBeDefined();
	});

	it('does not render reset button without onReset', () => {
		render(EmptyState, {
			props: {
				title: 'Empty',
				description: 'Nothing here.'
			}
		});

		expect(screen.queryByRole('button')).toBeNull();
	});

	it('uses custom reset label', () => {
		render(EmptyState, {
			props: {
				title: 'Empty',
				description: 'Nothing here.',
				onReset: () => {},
				resetLabel: 'Clear All'
			}
		});

		expect(screen.getByRole('button', { name: 'Clear All' })).toBeDefined();
	});
});
