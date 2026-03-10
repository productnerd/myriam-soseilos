import React from "react";
import { Activity } from "@/types/activity";
import { cn } from "@/lib/utils";
import OnboardingTrueFalseAnswer from "./answer-types/OnboardingTrueFalseAnswer";
import OnboardingMythOrReality from "./answer-types/OnboardingMythOrReality";

interface OnboardingActivityAnswersProps {
	activity: Activity;
	selectedAnswer: string;
	onAnswer: (answer: string) => void;
	showFeedback?: boolean;
	isCorrect?: boolean;
}

const OnboardingActivityAnswers: React.FC<OnboardingActivityAnswersProps> = ({
	activity,
	selectedAnswer,
	onAnswer,
	showFeedback = false,
	isCorrect = false,
}) => {
	// Handle different activity types
	switch (activity.type.toLowerCase()) {
		case "true_false":
			return (
				<OnboardingTrueFalseAnswer
					selectedAnswer={selectedAnswer}
					onAnswer={onAnswer}
					showFeedback={showFeedback}
					isCorrect={isCorrect}
					correctAnswer={activity.correct_answer}
				/>
			);

		case "myth_or_reality":
			return (
				<OnboardingMythOrReality
					activity={activity}
					selectedAnswer={selectedAnswer}
					onAnswer={onAnswer}
					showFeedback={showFeedback}
					isCorrect={isCorrect}
				/>
			);

		case "multiple_choice":
		default:
			// Multiple choice or default case
			if (!activity.options || !Array.isArray(activity.options)) {
				return <div className="space-y-2 mt-4">Loading answer options...</div>;
			}

			return (
				<div className="space-y-2 mt-4">
					{activity.options.map((option, index) => {
						const optionValue = typeof option === "string" ? option : String(option);
						const isSelected = selectedAnswer === optionValue;
						const isCorrectOption = optionValue === activity.correct_answer;
						const isWrongOption = isSelected && !isCorrect;
						const shouldHighlightCorrect =
							showFeedback && !isSelected && isCorrectOption;

						const optionClasses = cn(
							"p-3 border rounded-md transition-all duration-300 flex items-start cursor-pointer",
							{
								// Selected state before feedback (orange)
								"border-orange-500 bg-orange-500/10 text-orange-600":
									isSelected && !showFeedback,

								// Feedback states (red/green)
								"border-green-500 bg-green-500/10 text-green-600":
									showFeedback &&
									((isSelected && isCorrect) || shouldHighlightCorrect),
								"border-red-500 bg-red-500/10 text-red-600":
									showFeedback && isWrongOption,

								// Default state
								"border-white/20 hover:bg-white/10 text-white":
									!isSelected && !showFeedback && !shouldHighlightCorrect,
							}
						);

						return (
							<div
								key={index}
								className={optionClasses}
								onClick={() => !showFeedback && onAnswer(optionValue)}
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
	}
};

export default OnboardingActivityAnswers;
