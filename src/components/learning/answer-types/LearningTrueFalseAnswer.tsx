import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningTrueFalseAnswerProps {
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect?: boolean;
	correctAnswer: string;
	onAnswer: (answer: string) => void;
}

const LearningTrueFalseAnswer: React.FC<LearningTrueFalseAnswerProps> = ({
	selectedAnswer,
	showFeedback,
	isCorrect,
	correctAnswer,
	onAnswer,
}) => {
	// Ensure correctAnswer is always a string
	const safeCorrectAnswer = correctAnswer?.toLowerCase() || "";

	return (
		<div className="space-y-3 mt-4">
			{["true", "false"].map((option) => {
				const isSelected = selectedAnswer.toLowerCase() === option;
				const isCorrectOption = option.toLowerCase() === safeCorrectAnswer;
				const isWrongOption = isSelected && !isCorrect;

				const buttonClasses = cn(
					"relative w-full justify-start text-left h-auto py-3 px-4 transition-all duration-200",
					{
						// Selected state before feedback
						"ring-2 ring-primary/70": isSelected && !showFeedback,

						// Feedback states
						"bg-green-600/20 border-green-500 text-green-600":
							showFeedback &&
							((isSelected && isCorrect) || (!isSelected && isCorrectOption)),
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
		</div>
	);
};

export default LearningTrueFalseAnswer;
