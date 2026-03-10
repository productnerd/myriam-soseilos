
export interface ActivityBehaviorConfig {
	showCorrectAnswer: boolean;
	showExplanation: boolean;
	showTimer: boolean;
	autoAdvance: boolean;
	allowSkip: boolean;
	timerDuration?: number;
	autoAdvanceDelay?: number;
}

export const ACTIVITY_BEHAVIORS: Record<string, ActivityBehaviorConfig> = {
	topic: {
		showCorrectAnswer: true,
		showExplanation: true,
		showTimer: false,
		autoAdvance: false,
		allowSkip: false,
	},
	review: {
		showCorrectAnswer: true,
		showExplanation: true,
		showTimer: false,
		autoAdvance: false,
		allowSkip: false,
	},
	initial: {
		showCorrectAnswer: true,
		showExplanation: true,
		showTimer: true,
		autoAdvance: true,
		allowSkip: true,
		autoAdvanceDelay: 3000,
	},
	level: {
		showCorrectAnswer: false,
		showExplanation: false,
		showTimer: true,
		autoAdvance: true,
		allowSkip: false,
		autoAdvanceDelay: 2000,
	},
};
