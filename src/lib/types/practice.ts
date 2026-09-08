export interface Subject {
	name: string;
	iconName: string;
	color: string;
}

export interface PracticePackage {
	id: number;
	title: string;
	description: string;
	subject: string;
	difficulty: string;
	questionCount: number;
	author: string;
	topics: string[];
	isVerified: boolean;
	isBookmark?: boolean;
}

export interface Question {
	id: number;
	text: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export interface QuizGeneratorConfig {
	subject: string;
	topic: string;
	difficulty: string;
	mode: string;
	questionCount: number;
}
