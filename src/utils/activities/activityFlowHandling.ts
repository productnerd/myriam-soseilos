import { LearningActivity } from "@/types/activity";
import { shouldActivityCountForStreakAndFocus } from "@/utils/activities/activityScoring";
import { useCallback } from "react";

/**
 * These utilities provide centralized logic for handling activity flows (learning and review).
 * They eliminate code duplication between different hooks and ensure consistent behavior.
 *
 * USAGE:
 * - createAnswerHandler: Handles user answer selection, feedback display, and correctness checking
 * - createAdvanceHandler: Handles advancing to the next activity and completion detection
 *
 * Each hook (useLearningFlow, useReviewFlow) provides its own state management functions
 * and wraps these utilities with flow-specific logic (progress saving, focus points, etc.).
 */

// TODO: This is not used anywhere
export interface ActivityFlowState {
	currentActivityIndex: number;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect: boolean;
}

// TODO: This is not used anywhere
export interface ActivityFlowActions {
	handleAnswerActivity: (answer: string) => void;
	handleAdvanceActivity: () => void;
	resetState: () => void;
}

/**
 * Creates a standardized answer handler for activity flows
 *
 * This function handles the core logic of:
 * 1. Preventing multiple answers (if feedback is already shown)
 * 2. Validating the current activity exists
 * 3. Checking answer correctness
 * 4. Updating state (selected answer, feedback, correctness)
 * 5. Calling the provided callback for flow-specific logic
 *
 * @param activities - Array of activities in the current flow
 * @param currentActivityIndex - Index of the current activity
 * @param showFeedback - Whether feedback is currently being shown
 * @param updateState - Function to update the hook's state
 * @param onAnswer - Callback for flow-specific logic (sound, focus points, streaks, etc.)
 * @returns Function that can be called with a user's answer
 */
export function createAnswerHandler(
	activities: LearningActivity[],
	currentActivityIndex: number,
	showFeedback: boolean,
	updateState: (updates: {
		selectedAnswer: string;
		showFeedback: boolean;
		isCorrect?: boolean;
	}) => void,
	onAnswer: (isCorrect: boolean, activity: LearningActivity) => void | Promise<void>
) {
	return useCallback(
		(answer: string) => {
			// Prevent multiple answers if feedback is already shown
			if (showFeedback) return;

			// Validate that we have activities and the current index is valid
			if (!activities || activities.length === 0) return;

			const currentActivity = activities[currentActivityIndex];

			// Determine if the current activity should count for scoring (focus points, review system, etc.)
			const shouldCountForScoring = shouldActivityCountForStreakAndFocus(currentActivity);

			let correct: boolean | undefined = undefined;
			let feedback: boolean = false;

			// If it should count for scoring, we check if the answer is correct and set feedback accordingly
			if (shouldCountForScoring) {
				correct = answer.toLowerCase() === currentActivity.correct_answer!.toLowerCase();
				feedback = true;
			} else {
				correct = undefined;
				feedback = false;
			}

			// Update the state with the answer and feedback
			updateState({
				selectedAnswer: answer,
				showFeedback: feedback,
				isCorrect: correct,
			});

			// Call the flow-specific callback for additional processing (only for scoring activities)
			// This allows each hook to handle its own logic (sound, focus points, streaks, etc.)
			if (typeof correct === "boolean") {
				onAnswer(correct, currentActivity);
			}
		},
		[activities, currentActivityIndex, showFeedback, updateState, onAnswer]
	);
}

/**
 * Creates a standardized advance handler for activity flows
 *
 * This function handles the core logic of:
 * 1. Resetting state for the next activity (clear answer, hide feedback)
 * 2. Advancing to the next activity or marking as completed
 * 3. Calling the appropriate callback (advance or complete)
 *
 * @param activities - Array of activities in the current flow
 * @param currentActivityIndex - Index of the current activity
 * @param isProcessingAdvance - Whether an advance operation is already in progress (prevents rapid clicks)
 * @param updateState - Function to update the hook's state
 * @param onAdvance - Callback when advancing to the next activity
 * @param onComplete - Callback when the flow is completed
 * @returns Function that can be called to advance to the next activity
 */
export function createAdvanceHandler(
	activities: LearningActivity[],
	currentActivityIndex: number,
	isProcessingAdvance: boolean,
	updateState: (updates: {
		selectedAnswer: string;
		showFeedback: boolean;
		isCorrect?: boolean;
	}) => void,
	onAdvance: (nextIndex: number) => void,
	onComplete: () => void
) {
	return useCallback(() => {
		// Prevent multiple rapid clicks
		if (isProcessingAdvance) return;

		// Reset state for the next activity
		updateState({
			selectedAnswer: "",
			showFeedback: false,
			isCorrect: undefined,
		});

		// Check if we've reached the end of activities
		if (currentActivityIndex < activities.length - 1) {
			// Update the index to point to the next activity
			const nextIndex = currentActivityIndex + 1;
			onAdvance(nextIndex);
		} else {
			// Mark the flow as completed
			onComplete();
		}
	}, [
		activities.length,
		currentActivityIndex,
		isProcessingAdvance,
		updateState,
		onAdvance,
		onComplete,
	]);
}

/**
 * Function to check if an activity has a correct answer (for scoring purposes).
 * Activities like polls and surveys don't have correct answers.
 */
export function hasCorrectAnswer(activity: LearningActivity): boolean {
	return activity.correct_answer !== null;
}

/**
 * Function to safely get the correct answer for an activity.
 * Returns null if the activity doesn't have a correct answer.
 */
export function getCorrectAnswer(activity: LearningActivity): string | null {
	return activity.correct_answer;
}
