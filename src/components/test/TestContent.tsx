import React from "react";
import { Activity } from "@/types/activity";
import LoadingState from "../loading/LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import ActivityRenderer from "./ActivityRenderer";
import TestCompletionView from "./completion/TestCompletionView";
import LearningProgressBar from "@/components/learning/flow/LearningProgressBar";

interface TestContentProps {
	testActivities: Activity[] | undefined;
	isLoading: boolean;
	error: unknown;
	currentActivityIndex: number;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect: boolean;
	testCompleted: boolean;
	finalScore: number;
	handleAnswerSelect: (answer: string) => void;
	handleNextActivity: () => void;
	handleSkipTest: () => void;
	handleContinue: () => void;
	onClose: () => void;
	testId: string;
	isLevelTest?: boolean;
	hideQuestionCounter?: boolean;
	autoAdvanceDelay?: number;
	handleTimeout?: () => void;
	onRetryTest?: () => void;
}

const TestContent: React.FC<TestContentProps> = ({
	testActivities,
	isLoading,
	error,
	currentActivityIndex,
	selectedAnswer,
	showFeedback,
	isCorrect,
	testCompleted,
	finalScore,
	handleAnswerSelect,
	handleNextActivity,
	handleSkipTest,
	handleContinue,
	onClose,
	testId,
	isLevelTest = false,
	hideQuestionCounter = true,
	autoAdvanceDelay = 3000,
	handleTimeout,
	onRetryTest,
}) => {
	// Handle screen-wide click to advance
	const handleScreenClick = (e: React.MouseEvent) => {
		if (showFeedback) {
			e.stopPropagation(); // Prevent bubbling
			handleNextActivity();
		}
	};

	if (isLoading) {
		return <LoadingState message="Preparing your test..." />;
	}

	if (error) {
		console.error("Error in TestContent:", error);
		return <ErrorState onClose={onClose} />;
	}

	if (!testActivities || testActivities.length === 0) {
		console.log("No test activities found");
		// Don't allow skipping level tests
		return (
			<EmptyState
				onSkip={isLevelTest ? handleContinue : handleSkipTest}
				message="No activities found for this test"
				buttonText={isLevelTest ? "Return to Course" : "Start Course"}
				hideSkipButton={isLevelTest}
			/>
		);
	}

	if (testCompleted) {
		return (
			<TestCompletionView
				finalScore={finalScore}
				handleContinue={handleContinue}
				testId={testId}
				isLevelTest={isLevelTest}
				passed={isLevelTest ? finalScore >= 80 : true} // Pass if score is 80% or higher for level tests
				onRetry={onRetryTest}
			/>
		);
	}

	const activity = testActivities[currentActivityIndex];

	if (!activity) {
		console.error("Activity not found for index:", currentActivityIndex);
		return <ErrorState onClose={onClose} />;
	}

	return (
		<div className="relative">
			{/* Progress bar at the very top */}
			{testActivities && testActivities.length > 0 && (
				<div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
					<LearningProgressBar
						currentIndex={currentActivityIndex}
						totalCount={testActivities.length}
						showFeedback={showFeedback}
						className="px-4 py-2"
					/>
				</div>
			)}

			{/* Content with top padding to account for fixed progress bar */}
			<div
				className="relative min-h-[calc(100vh-8rem)] pt-12"
				onClick={handleScreenClick}
				style={{ cursor: showFeedback ? "pointer" : "default" }}
			>
				<ActivityRenderer
					activity={activity}
					currentIndex={currentActivityIndex}
					totalActivities={testActivities.length}
					selectedAnswer={selectedAnswer}
					showFeedback={showFeedback}
					isCorrect={isCorrect}
					onAnswer={handleAnswerSelect}
					onNext={handleNextActivity}
					onSkip={handleSkipTest}
					isLevelTest={isLevelTest}
					hideQuestionCounter={hideQuestionCounter}
					countdownDuration={isLevelTest ? 5 : 0}
					onTimeout={handleTimeout || (() => {})}
					autoAdvanceDelay={autoAdvanceDelay}
				/>

				<div className="mt-8" style={{ minHeight: "100px" }}></div>
			</div>
		</div>
	);
};

export default TestContent;
