import { describe, it, expect } from 'vitest';
import { mapRevisionRow, docToPlainText } from './revisions';

describe('mapRevisionRow', () => {
	it('maps a revision row', () => {
		expect(
			mapRevisionRow({
				id: 'r1',
				title: 'Judul Lama',
				status: 'draft',
				created_at: '2026-10-28T00:00:00.000Z',
				editor: { name: 'Akun Uji A' }
			})
		).toEqual({
			id: 'r1',
			title: 'Judul Lama',
			status: 'draft',
			createdAt: '2026-10-28T00:00:00.000Z',
			editorName: 'Akun Uji A'
		});
	});

	it('falls back without an editor', () => {
		expect(
			mapRevisionRow({
				id: 'r2',
				title: 'T',
				status: 'draft',
				created_at: '2026-10-28T00:00:00.000Z',
				editor: null
			}).editorName
		).toBe('Pengunjung');
	});
});

describe('docToPlainText', () => {
	it('joins paragraphs with blank lines', () => {
		expect(
			docToPlainText({
				type: 'doc',
				content: [
					{ type: 'paragraph', content: [{ type: 'text', text: 'Satu.' }] },
					{ type: 'paragraph', content: [{ type: 'text', text: 'Dua.' }] }
				]
			})
		).toBe('Satu.\n\nDua.');
	});

	it('returns empty string for non-documents', () => {
		expect(docToPlainText(null)).toBe('');
		expect(docToPlainText({ type: 'doc' })).toBe('');
	});
});
