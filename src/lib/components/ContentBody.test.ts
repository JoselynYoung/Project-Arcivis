import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ContentBody from './ContentBody.svelte';

describe('ContentBody', () => {
	it('renders v1 structure, lists, marks, and math text', () => {
		render(ContentBody, {
			props: {
				body: {
					type: 'doc',
					content: [
						{ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Judul' }] },
						{
							type: 'paragraph',
							content: [
								{ type: 'text', text: 'Tebal', marks: [{ type: 'bold' }] },
								{ type: 'text', text: ' dan miring', marks: [{ type: 'italic' }] }
							]
						},
						{
							type: 'orderedList',
							content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }]
						},
						{ type: 'math', attrs: { latex: 'x^2' } }
					]
				}
			}
		});

		expect(screen.getByRole('heading', { name: 'Judul', level: 2 })).toBeDefined();
		expect(screen.getByText('Tebal').className).toContain('font-bold');
		expect(screen.getByText('dan miring').className).toContain('italic');
		expect(screen.getByRole('list', { name: '' })).toBeDefined();
		expect(screen.getByText('x^2')).toBeDefined();
	});

	it('does not render an unsupported schema version', () => {
		render(ContentBody, {
			props: {
				editorSchemaVersion: 2,
				body: {
					type: 'doc',
					content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Nope' }] }]
				}
			}
		});

		expect(screen.queryByText('Nope')).toBeNull();
	});

	it('skips malformed and unknown nodes safely', () => {
		render(ContentBody, {
			props: {
				body: {
					type: 'doc',
					content: [{ type: 'unknown' }, null, { type: 'paragraph', content: 'invalid' }]
				}
			}
		});

		expect(document.body).toBeTruthy();
	});
});
