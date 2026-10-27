import { describe, it, expect } from 'vitest';
import { mapCommentRow, mapOwnComment } from './comments';

function row(overrides = {}) {
	return {
		id: '11111111-1111-4111-8111-111111111111',
		body: 'Bagus sekali!',
		created_at: '2026-10-28T00:00:00.000Z',
		author: { name: 'Akun Uji A' },
		...overrides
	};
}

describe('mapCommentRow', () => {
	it('maps a valid row', () => {
		expect(mapCommentRow(row())).toEqual({
			id: '11111111-1111-4111-8111-111111111111',
			body: 'Bagus sekali!',
			createdAt: '2026-10-28T00:00:00.000Z',
			authorName: 'Akun Uji A'
		});
	});

	it('falls back to Pengunjung without an author', () => {
		expect(mapCommentRow(row({ author: null })).authorName).toBe('Pengunjung');
	});

	it('throws on non-string body', () => {
		expect(() => mapCommentRow(row({ body: 42 }))).toThrow('BLOCKER');
	});

	it('throws on empty body', () => {
		expect(() => mapCommentRow(row({ body: '' }))).toThrow('BLOCKER');
	});
});

describe('mapOwnComment', () => {
	it('maps a row with content title', () => {
		expect(
			mapOwnComment({
				id: 'c1',
				body: 'Bagus',
				created_at: '2026-10-28T00:00:00.000Z',
				content_id: 'k1',
				content: { title: 'Fungsi Kuadrat' }
			})
		).toEqual({
			id: 'c1',
			body: 'Bagus',
			createdAt: '2026-10-28T00:00:00.000Z',
			contentId: 'k1',
			contentTitle: 'Fungsi Kuadrat'
		});
	});

	it('falls back without content', () => {
		expect(
			mapOwnComment({
				id: 'c2',
				body: 'Ok',
				created_at: '2026-10-28T00:00:00.000Z',
				content_id: 'k2',
				content: null
			}).contentTitle
		).toBe('Konten');
	});
});
