import React from "react";
import { Activity } from "@/types/activity";
import { cn } from "@/lib/utils";

interface OnboardingMythOrRealityProps {
	activity: Activity;
	selectedAnswer: string;
	onAnswer: (answer: string) => void;
	showFeedback?: boolean;
	isCorrect?: boolean;
}

const OnboardingMythOrReality: React.FC<OnboardingMythOrRealityProps> = ({
	activity,
	selectedAnswer,
	onAnswer,
	showFeedback = false,
	isCorrect = false,
}) => {
	// The options for this activity type - use "Truth" if the type is myth_not
	const useRealityLabel = activity.type.toUpperCase() === "MYTH_OR_REALITY";
	const truthValue = useRealityLabel ? "Reality" : "Truth";

	const options = ["Myth", truthValue];

	return (
		<div className="space-y-2 mt-4">
			{options.map((option, index) => {
				const isSelected = selectedAnswer === option;
				const isCorrectOption = option === activity.correct_answer;
				const isWrongOption = isSelected && !isCorrect;
				const shouldHighlightCorrect = showFeedback && !isSelected && isCorrectOption;

				const optionClasses = cn(
					"p-3 border rounded-md transition-all duration-300 flex items-start cursor-pointer",
					{
						// Selected state before feedback (orange)
						"border-orange-500 bg-orange-500/10 text-orange-600":
							isSelected && !showFeedback,

						// Feedback states (red/green)
						"border-green-500 bg-green-500/10 text-green-600":
							showFeedback && ((isSelected && isCorrect) || shouldHighlightCorrect),
						"border-red-500 bg-red-500/10 text-red-600": showFeedback && isWrongOption,

						// Default state
						"border-white/20 hover:bg-white/10 text-white":
							!isSelected && !showFeedback && !shouldHighlightCorrect,
					}
				);

				return (
					<div
						key={option}
						className={optionClasses}
						onClick={() => !showFeedback && onAnswer(option)}
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

export default OnboardingMythOrReality;
