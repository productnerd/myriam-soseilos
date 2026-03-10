import React, { useEffect } from "react";
import { Check, X } from "lucide-react";
import { Activity } from "@/types/activity";
import { prepareActivityExplanation } from "@/utils/activities/activityOperations";

interface ActivityFeedbackProps {
	isCorrect: boolean;
	activity: Activity;
	isLastActivity: boolean;
	onAdvance: () => void;
	isLevelTest?: boolean;
	hideExplanation?: boolean;
	autoAdvanceDelay?: number;
	selectedAnswer?: string;
}

/**
 * This component shows feedback after a user answers a question and handles
 * the transition to the next activity. The behavior differs significantly
 * between test types:
 *
 * INITIAL TEST MODE (isLevelTest = false):
 * - Auto-advance timer to move to the next activity (with 'click-to-continue' override)
 * - Full UI with colored backgrounds and icons
 *
 * LEVEL TEST MODE (isLevelTest = true):
 * - Auto-advance timer to move to the next activity (strict timing, no 'click-to-continue')
 * - Simplified UI without colored backgrounds
 */
const ActivityFeedback: React.FC<ActivityFeedbackProps> = ({
	isCorrect,
	activity,
	onAdvance,
	isLevelTest = false,
	hideExplanation = false,
	autoAdvanceDelay = 3000, // Default 3 seconds for auto-advance
	selectedAnswer,
}) => {
	/**
	 * Auto-advance timer and 'click-to-continue' behavior
	 *
	 * For ALL tests:
	 * - Sets a timer to automatically advance after `autoAdvanceDelay` milliseconds
	 * - Cleans up the timer when the component unmounts or dependencies change
	 *
	 * For INITIAL tests:
	 * - Adds a click listener for 'click anywhere to continue' logic (clears timer and advances immediately)
	 *
	 * For LEVEL tests:
	 * - No 'click-to-continue' behavior (strict timing)
	 */
	useEffect(() => {
		console.log("Setting auto-advance timer for", autoAdvanceDelay, "ms");

		// Set up the auto-advance timer
		const timer = setTimeout(() => {
			console.log("Auto-advance timer triggered, calling onAdvance()");
			onAdvance();
		}, autoAdvanceDelay);

		// Click handler for "click anywhere to continue" (only for initial tests)
		const handleAdvanceActivity = (e: MouseEvent) => {
			if (isLevelTest) return; // No 'click-to-continue' for level tests

			// Only handle clicks if they're not on buttons or interactive elements
			// This prevents accidental advancement when users click buttons
			const target = e.target as HTMLElement;
			const isButton =
				target.tagName === "BUTTON" ||
				target.closest("button") ||
				target.closest('[role="button"]');

			if (!isButton) {
				console.log(
					"Click detected on non-button, clearing timer and advancing to next activity"
				);
				clearTimeout(timer);
				onAdvance();
			}
		};

		// Only add click listener for initial tests (not level tests)
		if (!isLevelTest) {
			document.addEventListener("click", handleAdvanceActivity);
		}

		// Cleanup function
		return () => {
			clearTimeout(timer);
			if (!isLevelTest) {
				document.removeEventListener("click", handleAdvanceActivity);
			}
		};
	}, [onAdvance, autoAdvanceDelay, isLevelTest]);

	/**
	 * Get the explanation text using our utility function
	 *
	 * This function handles different activity types and formats the explanation
	 * appropriately based on the selected answer and activity type.
	 */
	const explanation = prepareActivityExplanation(activity, selectedAnswer);

	/**
	 * LEVEL TEST MODE: Simplified UI without colored backgrounds
	 *
	 * Level tests use a more minimal feedback UI:
	 * - No colored background or icons
	 * - Always show correct answer when wrong
	 * - Show explanation if available and not hidden
	 * - Auto-advance only (no 'click-to-continue')
	 */
	if (isLevelTest) {
		return (
			<div className="mt-8 space-y-4">
				{/* Always show the correct answer when wrong */}
				{(!hideExplanation || !isCorrect) && (
					<div className="p-4 rounded-md bg-muted/20">
						{!isCorrect && (
							<p className="text-sm text-muted-foreground">
								<span className="font-medium">Correct answer:</span>{" "}
								{activity.correct_answer}
							</p>
						)}
						{activity.explanation && !hideExplanation && (
							<p className="text-sm text-muted-foreground mt-2">
								<span className="font-medium">Explanation:</span> {explanation}
							</p>
						)}
					</div>
				)}
			</div>
		);
	}

	/**
	 * INITIAL TEST MODE: Full UI with colored backgrounds and icons
	 *
	 * Initial tests use a more engaging feedback UI:
	 * - Colored background (green for correct, red for incorrect)
	 * - Icons (checkmark for correct, X for incorrect)
	 * - Always show correct answer when wrong
	 * - Show explanation if available and not hidden
	 * - Supports click-to-continue behavior
	 */
	return (
		<div className="mt-8 space-y-4">
			{/* Correct/Incorrect indicator with colored background */}
			<div
				className={`p-4 rounded-md flex items-center justify-center ${
					isCorrect
						? "bg-green-100 dark:bg-green-900/30"
						: "bg-red-100 dark:bg-red-900/30"
				}`}
			>
				<div className="flex items-center gap-2">
					{isCorrect ? (
						<Check className="h-5 w-5 text-green-600 dark:text-green-400" />
					) : (
						<X className="h-5 w-5 text-red-600 dark:text-red-400" />
					)}
					<p className="font-medium">{isCorrect ? "Correct!" : "Incorrect"}</p>
				</div>
			</div>

			{/* Answer details and explanation */}
			{(!hideExplanation || !isCorrect) && (
				<div className="p-4 rounded-md bg-muted/20">
					{!isCorrect && (
						<p className="text-sm text-muted-foreground">
							<span className="font-medium">Correct answer:</span>{" "}
							{activity.correct_answer}
						</p>
					)}
					{activity.explanation && !hideExplanation && (
						<p className="text-sm text-muted-foreground mt-2">
							<span className="font-medium">Explanation:</span> {explanation}
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default ActivityFeedback;
