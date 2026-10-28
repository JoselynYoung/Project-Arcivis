import { describe, it, expect } from 'vitest';
import { buildCuratedAttempt, buildGeneratorAttempt } from './attempts';

describe('buildCuratedAttempt', () => {
	it('builds the insert payload with the user id and content id', () => {
		const record = buildCuratedAttempt('user-1', { contentId: 'content-1', score: 75 });

		expect(record).toMatchObject({
			user_id: 'user-1',
			content_id: 'content-1',
			generator_config: null,
			score: 75
		});
		expect(typeof record.completed_at).toBe('string');
	});
});

describe('buildGeneratorAttempt', () => {
	it('builds the insert payload with generator config and null content', () => {
		const config = {
			subject: 'Matematika',
			topic: 'Fungsi Kuadrat',
			difficulty: 'Sedang',
			mode: 'latihan',
			questionCount: 10
		};
		const record = buildGeneratorAttempt('user-2', { config, score: 80 });

		expect(record).toMatchObject({
			user_id: 'user-2',
			content_id: null,
			generator_config: config,
			score: 80
		});
		expect(typeof record.completed_at).toBe('string');
	});
});
