import React from "react";
import { Activity } from "@/types/activity";
import { cn } from "@/lib/utils";

interface MultipleChoiceAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	isCorrect: boolean;
	showFeedback: boolean;
	onAnswer: (answer: string) => void;
}

const MultipleChoiceAnswer: React.FC<MultipleChoiceAnswerProps> = ({
	activity,
	selectedAnswer,
	isCorrect,
	showFeedback,
	onAnswer,
}) => {
	// Add safety check for options
	if (!activity || !activity.options || !Array.isArray(activity.options)) {
		console.error("Invalid activity options:", activity);
		return <div className="space-y-2 mt-4">Loading answer options...</div>;
	}

	// Check if this is a multi-select question
	const isMultiSelect = activity.correct_answer?.includes(",") || false;
	const selectedAnswers = selectedAnswer ? selectedAnswer.split(",") : [];
	const correctAnswersCount =
		isMultiSelect && activity.correct_answer ? activity.correct_answer.split(",").length : 1;

	const handleSelectAnswer = (answer: string) => {
		if (!showFeedback) {
			if (isMultiSelect) {
				// Handle multi-select logic
				let newSelectedAnswers: string[];

				if (selectedAnswers.includes(answer)) {
					// Remove the answer if already selected
					newSelectedAnswers = selectedAnswers.filter((a) => a !== answer);
				} else {
					// Add the answer if not selected and haven't reached the limit
					if (selectedAnswers.length < correctAnswersCount) {
						newSelectedAnswers = [...selectedAnswers, answer];
					} else {
						// Already at limit, don't add more
						return;
					}
				}

				const newSelectedAnswer = newSelectedAnswers.join(",");
				onAnswer(newSelectedAnswer);
			} else {
				// Single select - trigger immediately
				onAnswer(answer);
			}
		}
	};

	return (
		<div className="space-y-2 mt-4">
			{/* Only show helper text if more than 1 answer is required */}
			{correctAnswersCount > 1 && (
				<p className="text-sm italic text-amber-600/90 mb-2">
					Pick {correctAnswersCount} answers
				</p>
			)}

			{activity.options.map((option, index) => {
				const optionValue = typeof option === "string" ? option : String(option);
				const isSelected = isMultiSelect
					? selectedAnswers.includes(optionValue)
					: selectedAnswer === optionValue;

				const correctAnswers = activity.correct_answer?.split(",") || [];
				const isCorrectOption = correctAnswers.includes(optionValue);

				const optionClasses = cn(
					"p-3 border rounded-md transition-all duration-300 flex items-start",
					{
						// Not showing feedback yet
						"cursor-pointer border-input hover:bg-accent/50": !showFeedback,

						// Selected answer - before showing feedback
						"border-primary bg-primary/10": isSelected && !showFeedback,

						// When showing feedback - correct answer
						"border-green-500 bg-green-600/20 text-green-600":
							showFeedback && isCorrectOption,

						// When selected but incorrect
						"border-red-500 bg-red-600/20 text-red-600":
							showFeedback && isSelected && !isCorrect,
					}
				);

				return (
					<div
						key={index}
						className={optionClasses}
						onClick={() => handleSelectAnswer(optionValue)}
					>
						<span className="mr-2 h-5 w-5 flex items-center justify-center rounded-full border border-current">
							{index + 1}
						</span>
						<span>{optionValue}</span>
					</div>
				);
			})}
		</div>
	);
};

export default MultipleChoiceAnswer;
