import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Activity } from "@/types/activity";
import ActivityQuestion from "./ActivityQuestion";
import ActivityAnswers from "./ActivityAnswers";
import CountdownTimer from "./CountdownTimer";
import ActivityFeedback from "./ActivityFeedback";
import { calculateActivityTime } from "@/utils/date/readingTimeUtils";

interface ActivityRendererProps {
	activity: Activity; // The activity data (question, options, etc.)
	currentIndex: number; // Current position in the activity sequence (0-based)
	totalActivities: number; // Total number of activities in the sequence
	selectedAnswer: string; // User's currently selected answer
	showFeedback: boolean; // Whether to show correct/incorrect feedback
	isCorrect: boolean; // Whether the selected answer is correct
	onAnswer: (answer: string) => void; // Callback when user selects an answer
	onAdvance: () => void; // Callback when user moves to next activity
	onSkip: () => void; // Callback when user skips the current activity
	isLevelTest?: boolean; // Whether this is part of a level test (affects behavior)
	hideQuestionCounter?: boolean; // Whether to hide the question counter
	autoAdvanceDelay?: number; // Delay in ms before auto-advancing (for level tests)
	countdownDuration?: number; // Duration for countdown timer (0 = no timer)
	onTimeout?: () => void; // Callback when countdown timer expires
}

/**
 * This component renders activities and handles both initial tests and level tests:
 *
 * INITIAL TEST MODE (isLevelTest = false):
 * - No countdown timer
 * - Has "Continue" button and "Skip Test" button
 * - Supports 'click-anywhere-to-continue' behavior
 * - Full feedback UI with colored backgrounds and icons
 *
 * LEVEL TEST MODE (isLevelTest = true):
 * - Countdown timer (strict timing)
 * - No 'skip' & 'continue' buttons
 * - Auto-advance only (no click-to-continue)
 * - Simplified feedback UI without colored backgrounds
 */
const ActivityRenderer: React.FC<ActivityRendererProps> = ({
	activity,
	currentIndex,
	totalActivities,
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
	onAdvance,
	onSkip,
	isLevelTest = false,
	hideQuestionCounter = true, // Default to true since we have progress bar
	autoAdvanceDelay = 3000, // Default 3 second auto-advance
	countdownDuration = 0,
	onTimeout = () => {},
}) => {
	const [timerKey, setTimerKey] = useState(0); // Timer key for forcing CountdownTimer component re-render

	// TODO: Shouldn't this be inside a hook?
	/**
	 * Calculate the appropriate countdown duration for this activity
	 *
	 * For level tests:
	 * - If countdownDuration is provided (> 0), use it directly
	 * - If not provided (0), calculate based on content complexity using reading time
	 *
	 * For initial tests:
	 * - Always use the provided countdownDuration (usually 0 = no timer)
	 */
	const calculatedDuration = isLevelTest
		? countdownDuration > 0
			? countdownDuration
			: calculateActivityTime(
					{
						main_text: activity.main_text,
						options: activity.options,
					},
					15 // Base reading speed in words per minute
			  )
		: countdownDuration;

	/**
	 * Reset timer key when activity changes or when feedback is shown
	 *
	 * This ensures the CountdownTimer component gets a fresh start:
	 * - When switching to a new activity (activity.id changes)
	 * - When transitioning from question mode to feedback mode (showFeedback changes)
	 *
	 * React uses the 'key' prop to determine when to unmount/remount components.
	 * The timerKey is used as the 'key' prop for CountdownTimer, so incrementing it
	 * forces React to unmount the old timer (CountdownTimer) and mount a new one with fresh state.
	 */
	useEffect(() => {
		setTimerKey((prev) => prev + 1);
	}, [activity.id, showFeedback]);

	// Handle case where activity data is missing
	if (!activity) {
		console.error("Activity is undefined in ActivityRenderer");
		return <div>Error: Activity not found</div>;
	}

	/**
	 * Handle "click anywhere to continue" behavior for initial tests
	 *
	 * This function enables the user to click anywhere (on the container) to advance
	 * to the next activity, after feedback is shown.
	 */
	const handleAdvanceActivity = () => {
		if (!isLevelTest && showFeedback) {
			onAdvance();
		}
	};

	/**
	 * Determine if the countdown timer should be active
	 *
	 * Timer is active when:
	 * - This is a level test (level tests have strict timing)
	 * - A duration is calculated (> 0)
	 * - We're in question mode (not showing feedback yet)
	 *
	 * Once feedback is shown, the timer stops and auto-advance takes over.
	 */
	const isTimerActive = isLevelTest && calculatedDuration > 0 && !showFeedback;

	// FEEDBACK MODE (user answered): Show question and answer + feedback
	if (showFeedback) {
		return (
			<div
				className="space-y-6"
				onClick={handleAdvanceActivity}
				style={{ cursor: !isLevelTest ? "pointer" : "default" }}
			>
				{/* Question display with progress counter */}
				<ActivityQuestion
					activity={activity}
					currentIndex={currentIndex}
					totalCount={totalActivities}
					hideCounter={hideQuestionCounter}
				/>

				{/* Answer options with selection and feedback */}
				<ActivityAnswers
					activity={activity}
					selectedAnswer={selectedAnswer}
					showFeedback={showFeedback}
					isCorrect={isCorrect}
					onAnswer={onAnswer}
					isLevelTest={isLevelTest}
				/>

				{/* Post-answer feedback */}
				<ActivityFeedback
					isCorrect={isCorrect}
					activity={activity}
					isLastActivity={currentIndex === totalActivities - 1}
					onAdvance={onAdvance}
					isLevelTest={isLevelTest}
					hideExplanation={false}
					autoAdvanceDelay={autoAdvanceDelay}
					selectedAnswer={selectedAnswer}
				/>

				{/* Continue button and instructions - only for initial tests */}
				{!isLevelTest && (
					<div className="mt-8 flex justify-center flex-col items-center space-y-2">
						<Button
							onClick={(e) => {
								e.stopPropagation(); // Prevent event from bubbling to parent
								onAdvance();
							}}
							className="w-full max-w-xs"
						>
							Continue
						</Button>
						<p className="text-sm text-muted-foreground animate-pulse">
							Click anywhere to continue
						</p>
					</div>
				)}
			</div>
		);
	}

	// QUESTION MODE (user hasn't answered yet): Show question and answer options
	return (
		<div className={`space-y-4 ${!isLevelTest ? "pb-10" : ""}`}>
			{/* Countdown timer - only shown for level tests */}
			{isLevelTest && calculatedDuration > 0 && (
				<div className="mb-6">
					<CountdownTimer
						key={timerKey}
						timeRemaining={calculatedDuration}
						onTimeout={onTimeout}
						isActive={isTimerActive}
					/>
				</div>
			)}

			{/* Question display with progress counter */}
			<ActivityQuestion
				activity={activity}
				currentIndex={currentIndex}
				totalCount={totalActivities}
				hideCounter={hideQuestionCounter}
			/>

			{/* Answer options for selection */}
			<ActivityAnswers
				activity={activity}
				selectedAnswer={selectedAnswer}
				showFeedback={showFeedback}
				isCorrect={isCorrect}
				onAnswer={onAnswer}
				isLevelTest={isLevelTest}
			/>

			{/* Skip button - only for initial tests */}
			{!isLevelTest && (
				<div className="mt-6 text-right">
					<Button
						variant="ghost"
						size="sm"
						onClick={(e) => {
							e.stopPropagation(); // Prevent event from bubbling to parent
							onSkip();
						}}
						className="text-muted-foreground"
					>
						Skip Test
					</Button>
				</div>
			)}
		</div>
	);
};

export default ActivityRenderer;
