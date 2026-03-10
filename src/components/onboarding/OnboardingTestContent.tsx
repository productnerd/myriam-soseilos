import React, { useState } from "react";
import { Activity } from "@/types/activity";
import OnboardingActivityAnswers from "./OnboardingActivityAnswers";
import { Button } from "@/components/ui/interactive/Button";
import { Progress } from "@/components/ui/data/Progress";
import ScoreDistributionChart from "../test/completion/ScoreDistributionChart";

interface OnboardingTestContentProps {
	testActivities: Activity[] | undefined;
	isLoading: boolean;
	error: unknown;
	currentActivityIndex: number;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect: boolean;
	testCompleted: boolean;
	finalScore: number;
	handleAnswerActivity: (answer: string) => void;
	handleAdvanceActivity: () => void;
	handleContinue: () => void;
	handleSkipTest?: () => void;
	onMentorUpdate: (show: boolean, message: string, hideMessage?: boolean) => void;
}

const OnboardingTestContent: React.FC<OnboardingTestContentProps> = ({
	testActivities,
	isLoading,
	error,
	currentActivityIndex,
	selectedAnswer,
	showFeedback,
	isCorrect,
	testCompleted,
	finalScore,
	handleAnswerActivity,
	handleAdvanceActivity,
	handleContinue,
	onMentorUpdate,
}) => {
	// Show mentor popup IMMEDIATELY when test is completed (when showing score)
	React.useEffect(() => {
		if (testCompleted) {
			console.log("Test completed, showing mentor popup");
			onMentorUpdate(true, "Not bad. I would like to push you to become even better");
		}
	}, [testCompleted, onMentorUpdate]);

	// Skip to skill selection if no activities found
	React.useEffect(() => {
		if (!isLoading && !error && (!testActivities || testActivities.length === 0)) {
			handleContinue();
		}
	}, [isLoading, error, testActivities, handleContinue]);

	const handleContinueWithoutHidingMentor = () => {
		// Don't hide mentor, just continue to next step
		handleContinue();
	};

	if (isLoading) {
		return (
			<div className="text-center space-y-6">
				<div className="animate-pulse text-white">
					<p>Preparing your assessment...</p>
				</div>
			</div>
		);
	}

	if (error) {
		console.error("Error in OnboardingTestContent:", error);
		return (
			<div className="text-center space-y-6">
				<div className="text-white">
					<p>Something went wrong. Let's continue...</p>
				</div>
				<Button
					onClick={handleContinue}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
				>
					Continue
				</Button>
			</div>
		);
	}

	if (!testActivities || testActivities.length === 0) {
		// This will be handled by the useEffect above, but just in case
		return null;
	}

	if (testCompleted) {
		return (
			<div className="text-center space-y-6">
				<div className="text-white space-y-4">
					<h3 className="text-lg font-medium">Assessment Complete!</h3>
					<div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-white/20 bg-white/10 mx-auto">
						<span className="text-4xl font-bold text-white">{finalScore}%</span>
					</div>

					{/* Add score distribution chart */}
					<div className="w-full mt-6">
						<ScoreDistributionChart
							testId="onboarding-assessment"
							finalScore={finalScore}
							animated={false}
						/>
					</div>
				</div>
				<Button
					onClick={handleContinueWithoutHidingMentor}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
				>
					Continue
				</Button>
			</div>
		);
	}

	const activity = testActivities[currentActivityIndex];
	if (!activity) {
		console.error("Activity not found for index:", currentActivityIndex);
		return (
			<div className="text-center space-y-6">
				<div className="text-white">
					<p>Something went wrong. Let's continue...</p>
				</div>
				<Button
					onClick={handleContinue}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
				>
					Continue
				</Button>
			</div>
		);
	}

	// Calculate progress based on answers given, not current question
	const answersGiven = selectedAnswer ? currentActivityIndex + 1 : currentActivityIndex;
	const progressPercent = (answersGiven / testActivities.length) * 100;

	return (
		<div className="relative space-y-6">
			{/* Progress bar */}
			<div className="space-y-2">
				<Progress
					value={progressPercent}
					className="w-full h-2 bg-white/20"
					indicatorClassName="bg-white transition-all duration-300"
				/>
			</div>

			{/* Question */}
			<div className="text-center space-y-4">
				<h3 className="text-lg font-medium text-white">{activity.main_text}</h3>
			</div>

			{/* Answers */}
			<div className="space-y-3">
				<OnboardingActivityAnswers
					activity={activity}
					selectedAnswer={selectedAnswer}
					onAnswer={handleAnswerActivity}
					showFeedback={showFeedback}
					isCorrect={isCorrect}
				/>
			</div>
		</div>
	);
};

export default OnboardingTestContent;
