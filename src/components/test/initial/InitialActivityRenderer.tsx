import React, { useEffect } from "react";
import { Activity } from "@/types/activity";
import { Button } from "@/components/ui/interactive/Button";
import ActivityQuestion from "../ActivityQuestion";
import ActivityAnswers from "../ActivityAnswers";
import InitialActivityFeedback from "./InitialActivityFeedback";

interface InitialActivityRendererProps {
	activity: Activity;
	currentIndex: number;
	totalActivities: number;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect: boolean;
	onAnswer: (answer: string) => void;
	onNext: () => void;
	onSkip: () => void;
	hideQuestionCounter?: boolean;
	autoAdvanceDelay?: number;
	onTimeout?: () => void;
}

const InitialActivityRenderer: React.FC<InitialActivityRendererProps> = ({
	activity,
	currentIndex,
	totalActivities,
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
	onNext,
	onSkip,
	hideQuestionCounter = true,
	autoAdvanceDelay = 3000,
	onTimeout,
}) => {
	// Auto-advance after feedback is shown
	useEffect(() => {
		if (showFeedback) {
			const timer = setTimeout(() => {
				onNext();
			}, autoAdvanceDelay);

			return () => clearTimeout(timer);
		}
	}, [showFeedback, onNext, autoAdvanceDelay]);

	// Handle container click to advance
	const handleContainerClick = () => {
		// Only progress if feedback is showing
		if (showFeedback) {
			onNext();
		}
	};

	if (!activity) {
		console.error("Activity is undefined in InitialActivityRenderer");
		return <div>Error: Activity not found</div>;
	}

	return (
		<div
			className="space-y-6 pb-8"
			onClick={handleContainerClick}
			style={{ cursor: showFeedback ? "pointer" : "default" }}
		>
			<ActivityQuestion
				activity={activity}
				currentIndex={currentIndex}
				totalCount={totalActivities}
				hideCounter={hideQuestionCounter}
			/>

			<ActivityAnswers
				activity={activity}
				selectedAnswer={selectedAnswer}
				showFeedback={showFeedback}
				isCorrect={isCorrect}
				onAnswer={onAnswer}
			/>

			{/* Display feedback when an answer is selected */}
			{showFeedback && (
				<InitialActivityFeedback
					isCorrect={isCorrect}
					activity={activity}
					isLastActivity={currentIndex === totalActivities - 1}
					onNext={onNext}
					autoAdvanceDelay={autoAdvanceDelay}
					selectedAnswer={selectedAnswer}
				/>
			)}

			{/* Skip button only shows when feedback is not showing */}
			{!showFeedback && (
				<div className="mt-6 text-right">
					<Button
						variant="ghost"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							onSkip();
						}}
						className="text-muted-foreground"
					>
						Skip Question
					</Button>
				</div>
			)}
		</div>
	);
};

export default InitialActivityRenderer;
