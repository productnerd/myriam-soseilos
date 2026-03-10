import React from "react";
import { Activity } from "@/types/activity";
import { Button } from "@/components/ui/interactive/Button";
import ActivityContent from "../content/ActivityContent";

interface ActivityContainerProps {
	activity: Activity;
	currentActivityIndex: number;
	totalActivities: number;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect?: boolean; // Allow 'undefined' for non-gradable activities (polls, surveys etc.)
	onAnswer: (
		answer: string,
		// TODO: What is AI validation result? Is the plan to use it to integrate in future iterations?
		// TODO: Also, it is also passed as a separate prop. Are both needed? They seem redundant.
		aiValidationResult?: {
			isCorrect: boolean;
			confidence: number;
			reasoning?: string;
		}
	) => void;
	onAdvance: () => void;
	explanation: string | Record<string, string>;
	flowType: "topic" | "review" | "initial" | "level";
	aiValidationResult?: {
		isCorrect: boolean;
		confidence: number;
		reasoning?: string;
	} | null;
	onSkip?: () => void; // For skipping review flow
}

/**
 * This is a container component that handles the display of an activity.
 * It can render in two modes:
 * - Topic flow (flowType="topic"): Normal learning experience
 * - Review flow (flowType="review"): Spaced repetition review experience
 *
 * The component handles:
 * - Activity header with progress information
 * - Answer selection interface
 * - Feedback display
 * - Explanation rendering
 * - Review-specific UI (skip button)
 * - 'Click anywhere to continue' (for both review and learning flows)
 *
 * All logic is preserved from the original LearningContainer and ReviewContent.
 */
const ActivityContainer: React.FC<ActivityContainerProps> = ({
	activity,
	currentActivityIndex,
	totalActivities,
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
	onAdvance,
	onSkip,
	explanation,
	flowType,
	aiValidationResult,
}) => {
	// Handle moving to the next activity when the user clicks anywhere on the screen (for both review and learning flows)
	const handleScreenClick = (e: React.MouseEvent) => {
		if (showFeedback) {
			e.preventDefault();
			e.stopPropagation();
			onAdvance();
		}
	};

	return (
		<div onClick={handleScreenClick} style={{ cursor: showFeedback ? "pointer" : "default" }}>
			{/* Skip Review Button - only shown for review flow */}
			{flowType === "review" && (
				<div className="flex justify-end mb-4">
					<Button
						variant="ghost"
						onClick={onSkip}
						className="text-muted-foreground hover:text-foreground"
					>
						Skip Review
					</Button>
				</div>
			)}

			{/* The actual activity display container */}
			<ActivityContent
				activity={activity}
				currentActivityIndex={currentActivityIndex}
				totalActivities={totalActivities}
				selectedAnswer={selectedAnswer}
				showFeedback={showFeedback}
				isCorrect={isCorrect}
				onAnswer={onAnswer}
				onAdvance={onAdvance}
				explanation={explanation}
				aiValidationResult={aiValidationResult}
			/>

			{/* 'Click anywhere to continue' message - shown when feedback is displayed */}
			{showFeedback && (
				<div className="text-center text-sm text-muted-foreground mt-4">
					Click anywhere to continue
				</div>
			)}
		</div>
	);
};

export default ActivityContainer;
