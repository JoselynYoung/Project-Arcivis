import { describe, it, expect } from 'vitest';
import { mapReviewRow } from './review';

describe('mapReviewRow', () => {
	it('maps a queue row', () => {
		expect(
			mapReviewRow(
				{
					id: '11111111-1111-4111-8111-111111111111',
					title: 'Draft Bagus',
					type: 'article',
					updated_at: '2026-10-28T00:00:00.000Z',
					author_id: 'a1'
				},
				'Akun Uji A'
			)
		).toEqual({
			id: '11111111-1111-4111-8111-111111111111',
			title: 'Draft Bagus',
			type: 'article',
			authorName: 'Akun Uji A',
			updatedAt: '2026-10-28T00:00:00.000Z'
		});
	});

	it('falls back without an author', () => {
		expect(
			mapReviewRow(
				{
					id: 'x',
					title: 'T',
					type: 'learning',
					updated_at: '2026-10-28T00:00:00.000Z',
					author_id: null
				},
				null
			).authorName
		).toBe('Penulis anonim');
	});
});
