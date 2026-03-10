import React from "react";
import { Activity } from "@/types/activity";
import { Button } from "@/components/ui/interactive/Button";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/contexts/UserContext";

interface LearningPollAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	onAnswer: (answer: string) => void;
}

const LearningPollAnswer: React.FC<LearningPollAnswerProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	onAnswer,
}) => {
	const { user } = useUserContext();
	const pollSharingEnabled = user!.poll_sharing ?? true;

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

			{/* Updated Poll sharing information message */}
			<div className="text-center mt-6">
				<p className="text-xs text-muted-foreground italic">
					{pollSharingEnabled
						? "Your answer is revealed to your friends once they also answer this poll. You can toggle this off from your profile. We store your answer in order to personalise your learning. Your data is securely stored and will not be shared with any third party."
						: "Your answer is not revealed to your friends. You can toggle this on from your profile. We store your answer in order to personalise your learning. Your data is securely stored and will not be shared with any third party."}
				</p>
			</div>
		</div>
	);
};

export default LearningPollAnswer;
