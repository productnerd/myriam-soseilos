import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrueFalseAnswerProps {
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect: boolean;
	onAnswer: (answer: string) => void;
	correctAnswer?: string; // Make this prop optional
}

const TrueFalseAnswer: React.FC<TrueFalseAnswerProps> = ({
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
	correctAnswer,
}) => {
	const options = ["true", "false"];

	return (
		<div className="space-y-3 mt-4">
			{options.map((option) => {
				const isSelected = selectedAnswer === option;
				const isCorrectOption = isSelected && isCorrect;
				const isWrongOption = isSelected && !isCorrect;
				const shouldShowCorrect = showFeedback && !isSelected && option === correctAnswer;

				// Determine button styling based on state
				const buttonClasses = cn(
					"relative w-full justify-start text-left h-auto py-3 px-4 transition-all duration-200",
					{
						// Selected state before feedback
						"ring-2 ring-primary/70": isSelected && !showFeedback,

						// Feedback states
						"bg-green-600/20 border-green-500 text-green-600":
							showFeedback && (isCorrectOption || shouldShowCorrect),
						"bg-red-600/20 border-red-500 text-red-600": showFeedback && isWrongOption,
					}
				);

				return (
					<Button
						key={option}
						className={buttonClasses}
						variant="outline"
						onClick={() => !showFeedback && onAnswer(option)}
						disabled={showFeedback}
					>
						{option === "true" ? (
							<Check className="h-5 w-5 mr-2" />
						) : (
							<X className="h-5 w-5 mr-2" />
						)}
						<span className="capitalize">{option}</span>
					</Button>
				);
			})}

			{/* Show correct answer when feedback is shown and the user got it wrong */}
			{showFeedback && !isCorrect && correctAnswer && (
				<div className="mt-2 text-sm text-green-600">Correct answer: {correctAnswer}</div>
			)}
		</div>
	);
};

export default TrueFalseAnswer;
