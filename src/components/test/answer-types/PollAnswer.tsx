import React from "react";
import { Activity } from "@/types/activity";
import { Button } from "@/components/ui/interactive/Button";
import { cn } from "@/lib/utils";

interface PollAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	onAnswer: (answer: string) => void;
}

const PollAnswer: React.FC<PollAnswerProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	onAnswer,
}) => {
	// Add safety check for options
	if (!activity.options || !Array.isArray(activity.options) || activity.options.length === 0) {
		return <div className="text-muted-foreground">No poll options available</div>;
	}

	// Create a statistics object if one doesn't exist
	const statistics = activity.statistics || {};

	// Get total votes - ensure we're working with numbers
	const totalVotes = Object.values(statistics).reduce(
		(acc, count) => acc + (Number(count) || 0),
		0
	);

	const handleOptionClick = (option: string) => {
		if (!showFeedback) {
			onAnswer(option);
		}
	};

	return (
		<div className="space-y-4 mt-4">
			<div className="space-y-3">
				{activity.options.map((option, index) => {
					const optionValue = typeof option === "string" ? option : String(option);
					const votes = Number(statistics[optionValue] || 0);
					const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
					const isSelected = selectedAnswer === optionValue;

					return (
						<div key={index} className="relative">
							<Button
								variant={isSelected && !showFeedback ? "default" : "outline"}
								className={cn("w-full justify-start text-left h-auto py-3", {
									"ring-2 ring-primary/70": isSelected && !showFeedback,
									"cursor-default": showFeedback,
									"bg-primary/20 border-primary/50 text-primary-foreground":
										showFeedback && isSelected,
								})}
								onClick={() => handleOptionClick(optionValue)}
								disabled={showFeedback}
							>
								{optionValue}
							</Button>

							{/* Show results when feedback is visible */}
							{showFeedback && (
								<div className="mt-1 flex items-center text-sm">
									<div
										className="h-2 bg-primary/70 rounded"
										style={{ width: `${percentage}%` }}
									/>
									<span className="ml-2 text-muted-foreground">
										{percentage}% ({votes} {votes === 1 ? "vote" : "votes"})
									</span>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PollAnswer;
