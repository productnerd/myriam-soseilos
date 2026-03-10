import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Activity } from "@/types/activity";
import { XCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningMythOrRealityProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect?: boolean;
	onAnswer: (answer: string) => void;
}

const LearningMythOrReality: React.FC<LearningMythOrRealityProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
}) => {
	// The options for this activity type - use "Truth" if the type is myth_not
	const useRealityLabel = activity.type.toUpperCase() === "MYTH_OR_REALITY";
	const truthValue = useRealityLabel ? "Reality" : "Truth";

	const options = [
		{ value: "Myth", icon: XCircle },
		{ value: truthValue, icon: CheckCircle2 },
	];

	return (
		<div className="flex flex-col gap-3 mt-4">
			{options.map(({ value, icon: Icon }) => {
				const isSelected = selectedAnswer === value;
				const isCorrectOption = value === activity.correct_answer;
				const isWrongOption = isSelected && !isCorrect;
				const shouldHighlightCorrect = showFeedback && !isSelected && isCorrectOption;

				const buttonClasses = cn(
					"relative w-full justify-start text-left h-auto py-3 px-4 transition-all duration-200",
					{
						// Selected state before feedback
						"ring-2 ring-primary/70": isSelected && !showFeedback,

						// Feedback states
						"bg-green-600/20 border-green-500 text-green-600":
							showFeedback && ((isSelected && isCorrect) || shouldHighlightCorrect),
						"bg-red-600/20 border-red-500 text-red-600": showFeedback && isWrongOption,
					}
				);

				return (
					<Button
						key={value}
						className={buttonClasses}
						variant="outline"
						onClick={() => !showFeedback && onAnswer(value)}
						disabled={showFeedback}
					>
						<Icon className="h-5 w-5 mr-2" />
						{value}
					</Button>
				);
			})}
		</div>
	);
};

export default LearningMythOrReality;
