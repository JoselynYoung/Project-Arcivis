import { describe, it, expect } from 'vitest';
import { buildDraftBody, mapMyContributionRow } from './contributions';

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

describe('buildDraftBody rich blocks', () => {
	it('builds headings with capped levels', () => {
		const doc = buildDraftBody('### Dalam') as unknown as {
			content: { type: string; attrs: { level: number } }[];
		};
		expect(doc.content[0]).toMatchObject({ type: 'heading', attrs: { level: 3 } });
	});

	it('merges quote lines into one blockquote', () => {
		const doc = buildDraftBody('> Baris satu\n> Baris dua') as unknown as {
			content: { type: string; content: unknown[] }[];
		};
		expect(doc.content).toHaveLength(1);
		expect(doc.content[0].type).toBe('blockquote');
		expect(doc.content[0].content).toHaveLength(2);
	});

	it('builds lists and images', () => {
		const doc = buildDraftBody('- a\n- b\n\n![foto](c1/x.png)') as unknown as {
			content: { type: string }[];
		};
		expect(doc.content.map((node) => node.type)).toEqual(['bulletList', 'paragraph']);
	});

	it('parses bold and italic marks', () => {
		const doc = buildDraftBody('**tebal** dan *miring*') as unknown as {
			content: { content: { text: string; marks?: { type: string }[] }[] }[];
		};
		const leaves = doc.content[0].content;
		expect(leaves[0]).toMatchObject({ text: 'tebal', marks: [{ type: 'bold' }] });
		expect(leaves[2]).toMatchObject({ text: 'miring', marks: [{ type: 'italic' }] });
	});
});

describe('mapMyContributionRow', () => {
	it('normalizes type, status, and tags with fallbacks', () => {
		expect(
			mapMyContributionRow({
				id: 'c1',
				title: 'Judul',
				type: 'learning',
				status: 'direview',
				updated_at: '2026-11-01T00:00:00.000Z',
				subject: null,
				content_tags: [{ tags: { name: 'Tips' } }, { tags: null }]
			})
		).toEqual({
			id: 'c1',
			title: 'Judul',
			type: 'learning',
			status: 'direview',
			subject: 'Umum',
			tags: ['Tips'],
			updatedAt: '2026-11-01T00:00:00.000Z'
		});
	});

	it('falls back to article and draft', () => {
		expect(
			mapMyContributionRow({
				id: 'c2',
				title: 'Lain',
				type: 'unknown',
				status: 'rejected',
				updated_at: '2026-11-02T00:00:00.000Z',
				subject: { name: 'Fisika' },
				content_tags: []
			})
		).toEqual({
			id: 'c2',
			title: 'Lain',
			type: 'article',
			status: 'draft',
			subject: 'Fisika',
			tags: [],
			updatedAt: '2026-11-02T00:00:00.000Z'
		});
	});
});
