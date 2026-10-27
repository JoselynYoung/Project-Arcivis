import { describe, it, expect } from 'vitest';
import { buildDraftBody } from './contributions';

describe('buildDraftBody', () => {
	it('builds a v1 doc from paragraphs', () => {
		expect(buildDraftBody('Satu.\n\nDua.')).toEqual({
			type: 'doc',
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'Satu.' }] },
				{ type: 'paragraph', content: [{ type: 'text', text: 'Dua.' }] }
			]
		});
	});

	it('ignores blank lines and trims', () => {
		const doc = buildDraftBody('\n  Satu.  \n\n\nDua.\n') as {
			content: { content: { text: string }[] }[];
		};
		expect(doc.content.map((p) => p.content[0].text)).toEqual(['Satu.', 'Dua.']);
	});

	it('throws on empty text', () => {
		expect(() => buildDraftBody('   \n  ')).toThrow('BLOCKER');
	});
});
