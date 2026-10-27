import { describe, it, expect } from 'vitest';
import { deriveDifficulty, mapPracticeRow } from './practice';

type PracticeRow = Parameters<typeof mapPracticeRow>[0];

describe('deriveDifficulty', () => {
	it('returns empty string when no valid difficulties', () => {
		expect(deriveDifficulty([])).toBe('');
		expect(deriveDifficulty([null, null])).toBe('');
		expect(deriveDifficulty(['', null])).toBe('');
	});

	it('returns the only difficulty when one exists', () => {
		expect(deriveDifficulty(['Mudah'])).toBe('Mudah');
		expect(deriveDifficulty(['Sedang', null])).toBe('Sedang');
	});

	it('returns most frequent difficulty', () => {
		expect(deriveDifficulty(['Mudah', 'Mudah', 'Sedang'])).toBe('Mudah');
		expect(deriveDifficulty(['Sulit', 'Sedang', 'Sulit', 'Sulit'])).toBe('Sulit');
	});

	it('returns harder difficulty on tie', () => {
		expect(deriveDifficulty(['Mudah', 'Sedang'])).toBe('Sedang');
		expect(deriveDifficulty(['Mudah', 'Sulit'])).toBe('Sulit');
		expect(deriveDifficulty(['Sedang', 'Sulit'])).toBe('Sulit');
		expect(deriveDifficulty(['Mudah', 'Mudah', 'Sedang', 'Sedang'])).toBe('Sedang');
		expect(deriveDifficulty(['Mudah', 'Sedang', 'Sulit'])).toBe('Sulit');
	});

	it('ignores null and empty difficulties in frequency calculation', () => {
		expect(deriveDifficulty(['Mudah', null, '', 'Mudah', 'Sedang'])).toBe('Mudah');
		expect(deriveDifficulty([null, 'Sedang', '', 'Sulit', null])).toBe('Sulit');
	});

	it('keeps package when author relation is unavailable', () => {
		const row = {
			id: '11111111-1111-4111-8111-111111111111',
			title: 'Paket Practice',
			description: null,
			status: 'diverifikasi',
			created_at: '2026-09-26T00:00:00.000Z',
			author: null,
			subject: { name: 'Matematika' },
			content_tags: [],
			questions: [{ difficulty: 'Sedang' }]
		} as unknown as PracticeRow;

		const packageData = mapPracticeRow(row, 1);

		expect(packageData).toBeDefined();
		expect(packageData.author).toBe('');
		expect(packageData.title).toBe('Paket Practice');
	});
});
