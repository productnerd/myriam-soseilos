export interface MatchPair {
	left: string;
	right: string;
}

export interface LearningPairMatchingAnswerProps {
	activity: any;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect: boolean;
	onAnswer: (answer: string) => void;
}

export type ItemState = "selected" | "matched" | "correct" | "incorrect" | "default";
