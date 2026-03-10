import React from "react";
import ActivityRenderer from "@/components/test/ActivityRenderer";
import LevelTestActions from "./LevelTestActions";
import LevelTestHeader from "./LevelTestHeader";
import CountdownTimer from "@/components/test/CountdownTimer";
import { Activity } from "@/types/activity";

interface LevelTestContentProps {
	testId: string; // Unique identifier for the test
	activities: Activity[]; // Activities for the test (fetched by parent)
	currentActivityIndex: number; // Current position in the test (0-based)
	selectedAnswer: string; // User's currently selected answer
	showFeedback: boolean; // Whether to show correct/incorrect feedback
	isCorrect: boolean | null; // Whether the selected answer is correct (null if not answered)
	timeRemaining: number; // Time remaining in seconds for the current activity
	onAnswer: (answer: string) => void; // Callback when user selects an answer
	onAdvance: () => void; // Callback when user moves to next activity
	onTimeout: () => void; // Callback when countdown timer expires
}

/**
 * This component orchestrates the level test experience by:
 * 1. Displaying test activities
 * 2. Managing the current activity state
 * 3. Coordinating between different UI components (header, timer, activity, actions)
 * 4. Handling navigation between activities
 */
const LevelTestContent: React.FC<LevelTestContentProps> = ({
	testId,
	activities,
	currentActivityIndex,
	selectedAnswer,
	showFeedback,
	isCorrect,
	timeRemaining,
	onAnswer,
	onAdvance,
	onTimeout,
}) => {
	// Handle case where no activities are found for this test
	if (!activities || activities.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-muted-foreground">No activities found for this test.</p>
			</div>
		);
	}

	// Extract current activity and calculate test metadata
	const currentActivity = activities[currentActivityIndex];
	const totalActivities = activities.length;
	const isLastActivity = currentActivityIndex === totalActivities - 1;

	// Handle case where current activity doesn't exist (shouldn't happen in normal flow)
	if (!currentActivity) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-muted-foreground">Activity not found.</p>
			</div>
		);
	}

	/**
	 * The component follows a top-down layout:
	 * - Header: Shows progress and test info
	 * - Timer: Countdown for current activity
	 * - Activity: The actual question/answer interface
	 * - Actions: Submit/Next/Complete buttons
	 */
	return (
		<div className="w-full max-w-2xl mx-auto space-y-6">
			{/* Header showing progress (e.g., "Question 3 of 10") */}
			<LevelTestHeader
				currentIndex={currentActivityIndex}
				totalActivities={totalActivities}
			/>

			{/* Countdown timer for the current activity */}
			<CountdownTimer
				timeRemaining={timeRemaining}
				onTimeout={onTimeout}
				isActive={!showFeedback} // The timer should start when the user hasn't answered yet (so feedback has not been shown yet)
			/>

			{/* Main activity interface - handles question display, answer selection, and feedback */}
			<ActivityRenderer
				activity={currentActivity}
				currentIndex={currentActivityIndex}
				totalActivities={totalActivities}
				selectedAnswer={selectedAnswer}
				onAnswer={onAnswer}
				showFeedback={showFeedback}
				isCorrect={isCorrect ?? false}
				onAdvance={onAdvance}
				onSkip={onAdvance} // For level tests, skip and next are the same action
				isLevelTest={true} // Enable level test specific behavior
			/>

			{/* Action buttons - Submit (for last activity), Next, or Complete */}
			<LevelTestActions
				selectedAnswer={selectedAnswer}
				showFeedback={showFeedback}
				isLastActivity={isLastActivity}
				onAdvance={onAdvance}
			/>
		</div>
	);
};

export default LevelTestContent;
