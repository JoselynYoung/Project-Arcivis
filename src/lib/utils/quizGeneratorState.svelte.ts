import type { QuizGeneratorConfig } from '$lib/types/practice';

export const quizGeneratorConfig = $state<QuizGeneratorConfig>({
	subject: 'Matematika',
	topic: 'Aljabar',
	difficulty: 'Sedang',
	mode: 'latihan',
	questionCount: 10
});

export function setQuizGeneratorConfig(config: QuizGeneratorConfig) {
	quizGeneratorConfig.subject = config.subject;
	quizGeneratorConfig.topic = config.topic;
	quizGeneratorConfig.difficulty = config.difficulty;
	quizGeneratorConfig.mode = config.mode;
	quizGeneratorConfig.questionCount = config.questionCount;
}
