import React from "react";
import { Activity } from "@/types/activity";
import LoadingState from "../../loading/LoadingState";
import ErrorState from "../ErrorState";
import InitialActivityRenderer from "./InitialActivityRenderer";
import InitialTestCompletionView from "./InitialTestCompletionView";

interface InitialTestContentProps {
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
	hideQuestionCounter?: boolean;
	autoAdvanceDelay?: number;
	handleTimeout?: () => void;
	courseColor?: string;
}

const InitialTestContent: React.FC<InitialTestContentProps> = ({
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
	hideQuestionCounter = true,
	autoAdvanceDelay,
	handleTimeout,
	courseColor,
}) => {
	if (isLoading) {
		return <LoadingState />;
	}

	if (error) {
		return <ErrorState onClose={onClose} />;
	}

	if (!testActivities || testActivities.length === 0) {
		return <ErrorState message="No activities found for this test" onClose={onClose} />;
	}

	if (testCompleted) {
		return (
			<InitialTestCompletionView
				finalScore={finalScore}
				handleContinue={handleContinue}
				testId={testId}
				courseColor={courseColor}
			/>
		);
	}

	const currentActivity = testActivities[currentActivityIndex];

	return (
		<InitialActivityRenderer
			activity={currentActivity}
			currentIndex={currentActivityIndex}
			totalActivities={testActivities.length}
			selectedAnswer={selectedAnswer}
			showFeedback={showFeedback}
			isCorrect={isCorrect}
			onAnswer={handleAnswerSelect}
			onNext={handleNextActivity}
			onSkip={handleSkipTest}
			hideQuestionCounter={hideQuestionCounter}
			autoAdvanceDelay={autoAdvanceDelay}
			onTimeout={handleTimeout}
		/>
	);
};

export default InitialTestContent;
