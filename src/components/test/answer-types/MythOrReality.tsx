import React from "react";
import { Activity } from "@/types/activity";
import { Button } from "@/components/ui/interactive/Button";
import { XCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MythOrRealityProps {
	activity: Activity;
	selectedAnswer: string;
	isCorrect: boolean;
	showFeedback: boolean;
	onAnswer: (answer: string) => void;
}

const MythOrReality: React.FC<MythOrRealityProps> = ({
	activity,
	selectedAnswer,
	isCorrect,
	showFeedback,
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

export default MythOrReality;
