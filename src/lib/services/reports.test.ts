import { describe, it, expect } from 'vitest';
import { mapOwnReport } from './reports';

describe('mapOwnReport', () => {
	it('maps a row with content title', () => {
		expect(
			mapOwnReport({
				id: 'r1',
				reason: 'Spam atau promosi',
				created_at: '2026-10-28T00:00:00.000Z',
				content_id: 'k1',
				content: { title: 'Paket X' }
			})
		).toEqual({
			id: 'r1',
			reason: 'Spam atau promosi',
			createdAt: '2026-10-28T00:00:00.000Z',
			contentId: 'k1',
			contentTitle: 'Paket X'
		});
	});

	it('falls back without content', () => {
		expect(
			mapOwnReport({
				id: 'r2',
				reason: 'Lainnya',
				created_at: '2026-10-28T00:00:00.000Z',
				content_id: 'k2',
				content: null
			}).contentTitle
		).toBe('Konten');
	});
});
