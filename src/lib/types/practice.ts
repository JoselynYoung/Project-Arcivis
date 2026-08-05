export interface Subject {
	name: string;
	iconName: string;
	color: string;
}

export interface PracticePackage {
	id: number;
	title: string;
	description: string;
	difficulty: string;
	questionCount: number;
	duration: string;
	group: string;
}

export interface Question {
	id: number;
	text: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export type QuestionsByPackage = Record<number, Question[]>;

export interface PracticePackageGroup {
	name: string;
	packages: PracticePackage[];
}
