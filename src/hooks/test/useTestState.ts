import { useState } from "react";
import { Activity } from "@/types/activity";

export function useTestState() {
	const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState("");
	const [showFeedback, setShowFeedback] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [score, setScore] = useState(0);
	const [testCompleted, setTestCompleted] = useState(false);
	const [finalScore, setFinalScore] = useState(0);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [processedActivities, setProcessedActivities] = useState<string[]>([]);

	// Reset all state values
	const resetState = () => {
		setCurrentActivityIndex(0);
		setSelectedAnswer("");
		setShowFeedback(false);
		setIsCorrect(false);
		setScore(0);
		setTestCompleted(false);
		setFinalScore(0);
		setCorrectAnswers(0);
		setProcessedActivities([]);
	};

	// Handle selecting an answer
	const handleAnswerSelect = (answer: string, currentActivity: Activity | undefined) => {
		if (!currentActivity || showFeedback || processedActivities.includes(currentActivity.id))
			return;

		setSelectedAnswer(answer);

		// Determine if the answer is correct
		const correct = answer === currentActivity.correct_answer;
		setIsCorrect(correct);

		// Increment score if correct
		if (correct) {
			setCorrectAnswers((prev) => prev + 1);
		}

		// Add activity to processed list
		setProcessedActivities((prev) => [...prev, currentActivity.id]);

		// Show feedback
		setShowFeedback(true);
	};

	// Handle moving to the next activity
	const handleNextActivity = (activities: Activity[] | undefined) => {
		if (!activities) return;

		setSelectedAnswer("");
		setShowFeedback(false);

		const nextIndex = currentActivityIndex + 1;

		if (nextIndex >= activities.length) {
			// Test is complete
			// Calculate final score using correctAnswers and total activities
			const calculatedScore = Math.round((correctAnswers / activities.length) * 100);
			setFinalScore(calculatedScore);
			setTestCompleted(true);
			console.debug("Test completed with score:", calculatedScore);
		} else {
			// Move to next activity
			setCurrentActivityIndex(nextIndex);
		}
	};

	// Handle timeout (when timer expires)
	const handleTimeout = () => {
		// Mark as incorrect
		setIsCorrect(false);
		setShowFeedback(true);

		// Don't increment score since the answer is incorrect
	};

	return {
		currentActivityIndex,
		selectedAnswer,
		showFeedback,
		isCorrect,
		score,
		testCompleted,
		finalScore,
		correctAnswers,
		resetState,
		handleAnswerSelect,
		handleNextActivity,
		handleTimeout,
		setTestCompleted,
		setFinalScore,
	};
}
