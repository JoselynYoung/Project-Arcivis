import { describe, it, expect } from 'vitest';
import { mapCommentRow } from './comments';

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
