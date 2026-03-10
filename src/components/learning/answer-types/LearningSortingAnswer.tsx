import React, { useState } from "react";
import { Activity } from "@/types/activity";
import { Button } from "@/components/ui/interactive/Button";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningSortingAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect?: boolean;
	onAnswer: (answer: string) => void;
}

const LearningSortingAnswer: React.FC<LearningSortingAnswerProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
}) => {
	// Parse options from the activity - ensure it's an array of strings
	const options =
		activity.options && Array.isArray(activity.options)
			? activity.options.map((opt) => (typeof opt === "string" ? opt : JSON.stringify(opt)))
			: [];

	// State for tracking the current order of items
	const [items, setItems] = useState<string[]>(options);

	// Parse correct answer - it should be a JSON array now
	const getCorrectOrder = () => {
		try {
			if (typeof activity.correct_answer === "string") {
				return JSON.parse(activity.correct_answer);
			}
			return Array.isArray(activity.correct_answer) ? activity.correct_answer : [];
		} catch {
			return activity.correct_answer?.toString().split(",") || [];
		}
	};

	const correctOrder = getCorrectOrder();

	// Move an item up in the list
	const moveUp = (index: number) => {
		if (index <= 0 || showFeedback) return;
		const newItems = [...items];
		const temp = newItems[index];
		newItems[index] = newItems[index - 1];
		newItems[index - 1] = temp;
		setItems(newItems);
	};

	// Move an item down in the list
	const moveDown = (index: number) => {
		if (index >= items.length - 1 || showFeedback) return;
		const newItems = [...items];
		const temp = newItems[index];
		newItems[index] = newItems[index + 1];
		newItems[index + 1] = temp;
		setItems(newItems);
	};

	// Handle submit - create answer string from current order
	const handleSubmit = () => {
		const answer = items.join(",");
		onAnswer(answer);
	};

	return (
		<div className="space-y-4 mt-4">
			<div className="space-y-2">
				{items.map((item, index) => {
					// Determine if this item is in the correct position when showing feedback
					const isCorrectPosition = showFeedback && correctOrder[index] === item;
					const isWrongPosition = showFeedback && correctOrder[index] !== item;

					return (
						<div
							key={index}
							className={cn(
								"p-3 rounded-md transition-all duration-300 flex items-center",
								{
									"bg-secondary border-border": !showFeedback,
									"bg-green-900/30 border border-green-800 text-green-400":
										showFeedback && isCorrectPosition,
									"bg-red-900/30 border border-red-800 text-red-400":
										showFeedback && isWrongPosition && !isCorrect,
									"bg-muted/70 border-muted text-muted-foreground":
										showFeedback &&
										!isCorrect &&
										!isWrongPosition &&
										!isCorrectPosition,
								}
							)}
						>
							<GripVertical className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
							<div className="flex-1">{item}</div>
							{!showFeedback && (
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => moveUp(index)}
										disabled={index === 0}
										className="h-8 w-8 text-muted-foreground hover:text-foreground"
										title="Move Up"
									>
										<ArrowUp className="h-4 w-4" />
										<span className="sr-only">Move Up</span>
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => moveDown(index)}
										disabled={index === items.length - 1}
										className="h-8 w-8 text-muted-foreground hover:text-foreground"
										title="Move Down"
									>
										<ArrowDown className="h-4 w-4" />
										<span className="sr-only">Move Down</span>
									</Button>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Submit button - only show when not showing feedback */}
			{!showFeedback && (
				<div className="flex justify-center mt-6">
					<Button onClick={handleSubmit} className="w-full max-w-xs" variant="default">
						Check Order
					</Button>
				</div>
			)}
		</div>
	);
};

export default LearningSortingAnswer;
