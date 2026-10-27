import { describe, it, expect } from 'vitest';
import { mapBankRow } from './bank';

function row(overrides = {}) {
	return {
		id: 'b1',
		text: '2 + 2?',
		options: ['3', '4'],
		difficulty: 'Mudah',
		topic: 'Aritmetika',
		subject: { name: 'Matematika' },
		author: { name: 'Akun Uji A' },
		status: 'diverifikasi',
		created_at: '2026-10-28T00:00:00.000Z',
		...overrides
	};
}

describe('mapBankRow', () => {
	it('maps a valid row', () => {
		expect(mapBankRow(row())).toEqual({
			id: 'b1',
			text: '2 + 2?',
			options: ['3', '4'],
			difficulty: 'Mudah',
			topic: 'Aritmetika',
			subject: 'Matematika',
			authorName: 'Akun Uji A',
			status: 'diverifikasi',
			createdAt: '2026-10-28T00:00:00.000Z'
		});
	});

	it('throws on non-string options', () => {
		expect(() => mapBankRow(row({ options: ['a', 1] }))).toThrow('BLOCKER');
	});

	it('falls back on missing subject and author', () => {
		const mapped = mapBankRow(row({ subject: null, author: null }));
		expect(mapped.subject).toBe('Umum');
		expect(mapped.authorName).toBe('Pengunjung');
	});
});
