
import React from "react";
import { cn } from "@/lib/utils";

interface MultipleChoiceUIProps {
	options: string[];
	selectedAnswers: string[];
	onOptionSelect: (option: string) => void;
	showFeedback: boolean;
	correctAnswers: string[];
	disabled?: boolean;
	isMultiSelect?: boolean;
	maxSelections?: number;
}

export const MultipleChoiceUI: React.FC<MultipleChoiceUIProps> = ({
	options,
	selectedAnswers,
	onOptionSelect,
	showFeedback,
	correctAnswers,
	disabled = false,
	isMultiSelect = false,
	maxSelections = 1,
}) => {
	const handleOptionClick = (option: string) => {
		if (disabled || showFeedback) return;
		onOptionSelect(option);
	};

	return (
		<div className="space-y-2 mt-4">
			{isMultiSelect && maxSelections > 1 && (
				<p className="text-sm italic text-amber-600/90 mb-2">
					Pick {maxSelections} answers
				</p>
			)}

			{options.map((option, index) => {
				const isSelected = selectedAnswers.includes(option);
				const isCorrectOption = correctAnswers.includes(option);

				const optionClasses = cn(
					"p-3 border rounded-md transition-all duration-300 flex items-start cursor-pointer",
					{
						// Not showing feedback yet
						"border-input hover:bg-accent/50": !showFeedback && !disabled,

						// Selected answer - before showing feedback
						"border-primary bg-primary/10": isSelected && !showFeedback,

						// When showing feedback - correct answer
						"border-green-500 bg-green-600/20 text-green-600": showFeedback && isCorrectOption,

						// When selected but incorrect
						"border-red-500 bg-red-600/20 text-red-600": 
							showFeedback && isSelected && !isCorrectOption,

						// Disabled state
						"opacity-50 cursor-not-allowed": disabled,
					}
				);

				return (
					<div
						key={index}
						className={optionClasses}
						onClick={() => handleOptionClick(option)}
					>
						<span className="mr-2 h-5 w-5 flex items-center justify-center rounded-full border border-current">
							{index + 1}
						</span>
						<span>{option}</span>
					</div>
				);
			})}
		</div>
	);
};
