import React, { useEffect } from "react";
import { Check, X } from "lucide-react";
import { Activity } from "@/types/activity";
import { prepareActivityExplanation } from "@/utils/activities/activityOperations";

interface ActivityFeedbackProps {
	isCorrect: boolean;
	activity: Activity;
	isLastActivity: boolean;
	onNext: () => void;
	autoAdvanceDelay?: number;
	selectedAnswer?: string;
}

const InitialActivityFeedback: React.FC<ActivityFeedbackProps> = ({
	isCorrect,
	activity,
	onNext,
	autoAdvanceDelay = 3000,
	selectedAnswer,
}) => {
	// Auto-advance after specified delay
	useEffect(() => {
		console.log("Setting auto-advance timer for", autoAdvanceDelay, "ms");
		const timer = setTimeout(() => {
			console.log("Auto-advance timer triggered, calling onNext()");
			onNext();
		}, autoAdvanceDelay);

		// Click handler for document-level clicks
		const handleClick = (e: MouseEvent) => {
			// Only handle clicks if they're not on buttons or interactive elements
			const target = e.target as HTMLElement;
			const isButton =
				target.tagName === "BUTTON" ||
				target.closest("button") ||
				target.closest('[role="button"]');

			if (!isButton) {
				console.log("Click detected on non-button, clearing timer and calling onNext()");
				clearTimeout(timer);
				onNext();
			}
		};

		document.addEventListener("click", handleClick);

		return () => {
			clearTimeout(timer);
			document.removeEventListener("click", handleClick);
		};
	}, [onNext, autoAdvanceDelay]);

	// Get the explanation text using our utility function
	const explanation = prepareActivityExplanation(activity, selectedAnswer);

	return (
		<div className="mt-8 space-y-4">
			<div
				className={`p-4 rounded-md flex items-center justify-center ${
					isCorrect
						? "bg-green-100 dark:bg-green-900/30"
						: "bg-red-100 dark:bg-red-900/30"
				}`}
			>
				<div className="flex items-center gap-2">
					{isCorrect ? (
						<Check className="h-5 w-5 text-green-600 dark:text-green-400" />
					) : (
						<X className="h-5 w-5 text-red-600 dark:text-red-400" />
					)}
					<p className="font-medium">{isCorrect ? "Correct!" : "Incorrect"}</p>
				</div>
			</div>

			{/* Always show the correct answer when wrong */}
			<div className="p-4 rounded-md bg-muted/20">
				{!isCorrect && (
					<p className="text-sm text-muted-foreground">
						<span className="font-medium">Correct answer:</span>{" "}
						{activity.correct_answer}
					</p>
				)}
				{activity.explanation && (
					<p className="text-sm text-muted-foreground mt-2">
						<span className="font-medium">Explanation:</span> {explanation}
					</p>
				)}
			</div>

			<div className="mt-4 text-center text-muted-foreground text-sm animate-pulse">
				Click anywhere to continue
			</div>
		</div>
	);
};

export default InitialActivityFeedback;
