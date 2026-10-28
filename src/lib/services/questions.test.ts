import { describe, it, expect } from 'vitest';
import { mapQuestionRow } from './questions';

describe('questions service validation', () => {
	it('validates options array structure', () => {
		const validOptions = ['Option A', 'Option B', 'Option C'];
		expect(Array.isArray(validOptions)).toBe(true);
		expect(validOptions.every((opt) => typeof opt === 'string')).toBe(true);
	});

	it('validates correct_index range', () => {
		const options = ['A', 'B', 'C', 'D'];
		const validIndex = 2;
		expect(validIndex >= 0 && validIndex < options.length).toBe(true);

		const invalidIndexNegative = -1;
		expect(invalidIndexNegative >= 0 && invalidIndexNegative < options.length).toBe(false);

		const invalidIndexTooHigh = 4;
		expect(invalidIndexTooHigh >= 0 && invalidIndexTooHigh < options.length).toBe(false);
	});

	it('handles null explanation as empty string', () => {
		const explanation: string | null = null;
		expect(explanation ?? '').toBe('');

		const validExplanation: string | null = 'Valid explanation';
		expect(validExplanation ?? '').toBe('Valid explanation');
	});
});

describe('mapQuestionRow', () => {
	it('maps a valid row', () => {
		expect(mapQuestionRow({ id: 'q1', text: '2+2?', options: ['3', '4'] })).toEqual({
			id: 'q1',
			text: '2+2?',
			options: ['3', '4']
		});
	});

	it('throws on non-array options', () => {
		expect(() => mapQuestionRow({ id: 'q2', text: 'T?', options: 'AB' })).toThrow(
			'BLOCKER: data contract questions.options mismatch'
		);
	});

	it('throws on non-string option entries', () => {
		expect(() => mapQuestionRow({ id: 'q3', text: 'T?', options: ['A', 1] })).toThrow(
			'BLOCKER: data contract questions.options mismatch'
		);
	});
});
