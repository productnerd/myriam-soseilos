import React, { useState } from "react";
import { Activity } from "@/types/activity";
import { calculateActivityTime } from "@/utils/date/readingTimeUtils";
import { verifyScoreCalculation } from "@/utils/test/results/scoreCalculationDebug";
import { getExplanationForAnswer } from "@/utils/activities/activityOperations";
import { Button } from "@/components/ui/interactive/Button";
import CountdownTimer from "@/components/test/CountdownTimer";
import ActivityContainer from "@/components/activities/layout/ActivityContainer";

interface SampleLevelTestFlowProps {
	activity: Activity;
}

const SampleLevelTestFlow: React.FC<SampleLevelTestFlowProps> = ({ activity }) => {
	const [key, setKey] = useState<number>(0);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [showFeedback, setShowFeedback] = useState<boolean>(false);
	const [isCorrect, setIsCorrect] = useState<boolean>(false);
	const [timerKey, setTimerKey] = useState<number>(0); // Key to reset timer
	const [correctAnswers, setCorrectAnswers] = useState<number>(0);
	const [completedActivities, setCompletedActivities] = useState<
		{ isCorrect: boolean; activityId: string }[]
	>([]);
	const [finalScore, setFinalScore] = useState(0);
	const [testCompleted, setTestCompleted] = useState(false);

	// Simulating a level test with a single activity
	const activities = [activity];

	// Calculate dynamic countdown duration
	const countdownDuration = calculateActivityTime(
		{
			main_text: activities[currentIndex].main_text,
			options: activities[currentIndex].options,
		},
		15
	);

	const handleAnswer = (answer: string) => {
		setSelectedAnswer(answer);
		setShowFeedback(true);

		const isAnswerCorrect = answer === activities[currentIndex].correct_answer;
		setIsCorrect(isAnswerCorrect);

		// Track this activity's result
		setCompletedActivities((prev) => [
			...prev,
			{
				activityId: activities[currentIndex].id,
				isCorrect: isAnswerCorrect,
			},
		]);

		// Increment correct answers count if correct
		if (isAnswerCorrect) {
			setCorrectAnswers((prev) => prev + 1);
		}
	};

	const handleAdvance = () => {
		if (currentIndex < activities.length - 1) {
			setCurrentIndex((prev) => prev + 1);
			setSelectedAnswer("");
			setShowFeedback(false);
			setTimerKey((prev) => prev + 1); // Reset timer
		} else {
			// Final score calculation - make sure all answers are counted
			// Use completed activities to ensure all answers are included in the calculation
			const totalActivities = activities.length;
			const totalCorrect = completedActivities.filter((a) => a.isCorrect).length;
			const calculatedScore = Math.round((totalCorrect / totalActivities) * 100);

			// Debug the score calculation
			verifyScoreCalculation(totalCorrect, totalActivities, completedActivities);

			setFinalScore(calculatedScore);
			setTestCompleted(true);
			console.log(
				`Test completed! Final score: ${calculatedScore}% (${totalCorrect}/${totalActivities} correct)`
			);

			// Reset for demo purposes
			setTimeout(() => {
				setCurrentIndex(0);
				setSelectedAnswer("");
				setShowFeedback(false);
				setTimerKey((prev) => prev + 1); // Reset timer
				setCorrectAnswers(0);
				setCompletedActivities([]);
				setTestCompleted(false);
			}, 3000);
		}
	};

	const resetFlow = (e: React.MouseEvent) => {
		// Prevent event from bubbling up to parent containers
		e.stopPropagation();

		setKey((prev) => prev + 1);
		setCurrentIndex(0);
		setSelectedAnswer("");
		setShowFeedback(false);
		setIsCorrect(false);
		setTimerKey((prev) => prev + 1); // Reset timer
		setCorrectAnswers(0);
		setCompletedActivities([]);
		setTestCompleted(false);
	};

	// Handle clicking anywhere on the screen to progress
	const handleScreenClick = (e: React.MouseEvent) => {
		// Only advance if feedback is already showing (means user has answered)
		// And if the click target is the container itself, not a child element
		if (showFeedback && e.target === e.currentTarget) {
			handleAdvance();
		}
	};

	// Timeout handler
	const handleTimeout = () => {
		if (!showFeedback) {
			// Set a blank answer and show feedback as incorrect
			setSelectedAnswer("");
			setShowFeedback(true);
			setIsCorrect(false);

			// Track this timed-out activity as incorrect
			setCompletedActivities((prev) => [
				...prev,
				{
					activityId: activities[currentIndex].id,
					isCorrect: false,
				},
			]);

			// Auto-advance after delay
			setTimeout(() => {
				handleAdvance();
			}, 2000);
		}
	};

	// Ensure we have a valid explanation converted to string
	const explanation = getExplanationForAnswer(
		activities[currentIndex]?.explanation,
		selectedAnswer
	);

	// If test is completed, show a simple completion message
	if (testCompleted) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<h2 className="text-xl font-bold mb-4">Test Completed!</h2>
				<div className="text-4xl font-bold mb-6">{finalScore}%</div>
				<p className="mb-4">
					You answered {correctAnswers} out of {activities.length} questions correctly.
				</p>
				<Button onClick={resetFlow}>Try Again</Button>
			</div>
		);
	}

	return (
		<div className="mb-16">
			<h2 className="text-2xl font-bold mb-4">Level Test Flow</h2>
			<div className="bg-card rounded-lg shadow-md p-6 mb-4">
				<div
					key={key}
					className="relative min-h-[calc(100vh-16rem)]"
					onClick={handleScreenClick}
					style={{ cursor: showFeedback ? "pointer" : "default" }}
				>
					{/* Add countdown timer */}
					{!showFeedback && (
						<div className="mb-6">
							<CountdownTimer
								key={timerKey}
								timeRemaining={countdownDuration}
								onTimeout={handleTimeout}
								isActive={!showFeedback} // The timer should start when the user hasn't answered yet (so feedback has not been shown yet)
							/>
						</div>
					)}

					<ActivityContainer
						activity={activities[currentIndex]}
						currentActivityIndex={currentIndex}
						totalActivities={activities.length}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						onAnswer={handleAnswer}
						onAdvance={handleAdvance}
						explanation={explanation}
						flowType="level"
					/>
				</div>
			</div>
			<Button onClick={resetFlow} variant="outline" className="w-full">
				Restart Level Test Flow
			</Button>
		</div>
	);
};

export default SampleLevelTestFlow;
