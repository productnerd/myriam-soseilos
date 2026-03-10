import React, { useState } from "react";
import { Activity } from "@/types/activity";
import { Card } from "@/components/ui/layout/Card";
import { cn } from "@/lib/utils";

interface PairMatchingAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	isCorrect: boolean;
	showFeedback: boolean;
	onAnswer: (answer: string) => void;
}

interface MatchPair {
	left: string;
	right: string;
}

const PairMatchingAnswer: React.FC<PairMatchingAnswerProps> = ({
	activity,
	selectedAnswer,
	isCorrect,
	showFeedback,
	onAnswer,
}) => {
	// Parse options - expecting format: "left1,right1|left2,right2|..."
	const pairs: MatchPair[] =
		activity.options
			?.map((option) => {
				const [left, right] = option.split(",");
				return { left: left?.trim() || "", right: right?.trim() || "" };
			})
			.filter((pair) => pair.left && pair.right) || [];

	// Separate left and right items - keep original order, no shuffling
	const leftItems = pairs.map((pair) => pair.left);
	const rightItems = pairs.map((pair) => pair.right);

	const [matches, setMatches] = useState<Record<string, string>>({});
	const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
	const [selectedRight, setSelectedRight] = useState<string | null>(null);

	const handleLeftClick = (item: string) => {
		if (showFeedback) return;

		if (selectedRight) {
			// If right item is selected, create match
			const newMatches = { ...matches };

			// Remove any existing match for this left item
			delete newMatches[item];

			// Remove any existing match for the selected right item
			Object.keys(newMatches).forEach((key) => {
				if (newMatches[key] === selectedRight) {
					delete newMatches[key];
				}
			});

			// Add new match
			newMatches[item] = selectedRight;
			setMatches(newMatches);
			setSelectedRight(null);

			// Check if all pairs are matched
			if (Object.keys(newMatches).length === pairs.length) {
				const answerString = Object.entries(newMatches)
					.sort(([a], [b]) => leftItems.indexOf(a) - leftItems.indexOf(b))
					.map(([left, right]) => `${left},${right}`)
					.join("|");
				onAnswer(answerString);
			}
		} else {
			// Toggle selection of left item
			setSelectedLeft(selectedLeft === item ? null : item);
			setSelectedRight(null);
		}
	};

	const handleRightClick = (item: string) => {
		if (showFeedback) return;

		if (selectedLeft) {
			// If left item is selected, create match
			const newMatches = { ...matches };

			// Remove any existing match for the selected left item
			delete newMatches[selectedLeft];

			// Remove any existing match for this right item
			Object.keys(newMatches).forEach((key) => {
				if (newMatches[key] === item) {
					delete newMatches[key];
				}
			});

			// Add new match
			newMatches[selectedLeft] = item;
			setMatches(newMatches);
			setSelectedLeft(null);

			// Check if all pairs are matched
			if (Object.keys(newMatches).length === pairs.length) {
				const answerString = Object.entries(newMatches)
					.sort(([a], [b]) => leftItems.indexOf(a) - leftItems.indexOf(b))
					.map(([left, right]) => `${left},${right}`)
					.join("|");
				onAnswer(answerString);
			}
		} else {
			// Toggle selection of right item
			setSelectedRight(selectedRight === item ? null : item);
			setSelectedLeft(null);
		}
	};

	const getItemState = (item: string, side: "left" | "right") => {
		if (!showFeedback) {
			if (side === "left") {
				if (selectedLeft === item) return "selected";
				if (matches[item]) return "matched";
				return "default";
			} else {
				if (selectedRight === item) return "selected";
				if (Object.values(matches).includes(item)) return "matched";
				return "default";
			}
		}

		// Show feedback
		if (side === "left") {
			const correctRight = pairs.find((pair) => pair.left === item)?.right;
			const userRight = matches[item];
			return userRight === correctRight ? "correct" : "incorrect";
		} else {
			const correctLeft = pairs.find((pair) => pair.right === item)?.left;
			const userLeft = Object.keys(matches).find((left) => matches[left] === item);
			return userLeft === correctLeft ? "correct" : "incorrect";
		}
	};

	const getItemStyles = (state: string) => {
		const baseStyles =
			"p-3 border rounded-md transition-all duration-300 cursor-pointer min-h-[60px] flex items-center gap-2 text-left";

		switch (state) {
			case "selected":
				return cn(baseStyles, "border-primary bg-primary/10 text-primary");
			case "matched":
				return cn(
					baseStyles,
					"border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
				);
			case "correct":
				return cn(
					baseStyles,
					"border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
				);
			case "incorrect":
				return cn(
					baseStyles,
					"border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
				);
			default:
				return cn(baseStyles, "border-input hover:bg-accent/50 text-foreground");
		}
	};

	return (
		<Card className="p-6">
			<div className="mb-4 text-center text-sm text-muted-foreground">
				{showFeedback ? "Results" : "Tap items to match pairs"}
			</div>

			<div className="grid grid-cols-2 gap-6">
				{/* Left column */}
				<div className="space-y-3">
					{leftItems.map((item, index) => (
						<div
							key={`left-${index}`}
							className={getItemStyles(getItemState(item, "left"))}
							onClick={() => handleLeftClick(item)}
						>
							<span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border border-current text-sm font-medium">
								{index + 1}
							</span>
							<span className="flex-1">{item}</span>
						</div>
					))}
				</div>

				{/* Right column */}
				<div className="space-y-3">
					{rightItems.map((item, index) => (
						<div
							key={`right-${index}`}
							className={getItemStyles(getItemState(item, "right"))}
							onClick={() => handleRightClick(item)}
						>
							<span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border border-current text-sm font-medium">
								{String.fromCharCode(65 + index)}
							</span>
							<span className="flex-1">{item}</span>
						</div>
					))}
				</div>
			</div>

			{showFeedback && (
				<div className="mt-4 text-center">
					<div
						className={`text-sm font-medium ${
							isCorrect ? "text-green-600" : "text-red-600"
						}`}
					>
						{isCorrect
							? "Perfect! All pairs matched correctly."
							: "Some pairs were incorrect."}
					</div>
				</div>
			)}
		</Card>
	);
};

export default PairMatchingAnswer;
