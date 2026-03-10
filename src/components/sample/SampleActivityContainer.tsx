import React, { useState } from "react";
import { Activity } from "@/types/activity";
import { Card } from "@/components/ui/layout/Card";
import { getExplanationForAnswer } from "@/utils/activities/activityOperations";

interface SampleActivityContainerProps {
	activity: Activity;
	onAnswer: (isCorrect: boolean) => void;
}

const SampleActivityContainer: React.FC<SampleActivityContainerProps> = ({
	activity,
	onAnswer,
}) => {
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [showingFeedback, setShowingFeedback] = useState(false);
	const isCorrect = selectedAnswer === activity.correct_answer;
	const currentActivity = activity;

	const handleAnswerSelect = (answer: string) => {
		setSelectedAnswer(answer);
		setShowingFeedback(true);
	};

	const handleContinue = () => {
		onAnswer(isCorrect);
	};

	// Render the explanation
	const renderExplanation = () => {
		if (!showingFeedback) return null;

		// Get the explanation text using our utility
		const explanationText = getExplanationForAnswer(
			currentActivity.explanation,
			selectedAnswer || undefined
		);

		return (
			<div
				className={`p-4 rounded-md ${
					isCorrect
						? "bg-green-50 border border-green-200"
						: "bg-red-50 border border-red-200"
				}`}
			>
				<p className="font-medium mb-1">{isCorrect ? "Correct!" : "Incorrect"}</p>
				<p className="text-sm text-muted-foreground">
					<span className="font-medium">Explanation:</span> {explanationText}
				</p>
			</div>
		);
	};

	return (
		<Card className="w-full">
			<Card className="p-4">
				<p className="text-lg font-semibold mb-2">{currentActivity.main_text}</p>
				<div className="space-y-2">
					{currentActivity.options?.map((option, index) => (
						<button
							key={index}
							className={`w-full p-3 rounded-md text-left ${
								selectedAnswer === option
									? isCorrect
										? "bg-green-100 border border-green-500"
										: "bg-red-100 border border-red-500"
									: "bg-gray-50 hover:bg-gray-100 border border-gray-200"
							}`}
							onClick={() => handleAnswerSelect(option)}
							disabled={showingFeedback}
						>
							{option}
						</button>
					))}
				</div>
			</Card>

			{renderExplanation()}

			{showingFeedback && (
				<div className="p-4">
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={handleContinue}
					>
						Continue
					</button>
				</div>
			)}
		</Card>
	);
};

export default SampleActivityContainer;
