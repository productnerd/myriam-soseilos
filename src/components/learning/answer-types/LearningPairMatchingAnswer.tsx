import React, { useState } from "react";
import { getCorrectPairs } from "@/utils/learning/correctPairsParser";
import {
	createMatch,
	generateAnswerString,
	isAllPairsMatched,
} from "@/utils/learning/matchingLogic";
import PairMatchingItem from "./PairMatchingItem";
import { Activity } from "@/types/activity";

interface LearningPairMatchingAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect?: boolean;
	onAnswer: (answer: string) => void;
}

const LearningPairMatchingAnswer: React.FC<LearningPairMatchingAnswerProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
}) => {
	const correctPairs = getCorrectPairs(activity.correct_answer);

	// Extract left and right items from correct pairs
	const leftItems = correctPairs.map((pair) => pair.left);
	const rightItems = correctPairs.map((pair) => pair.right);

	const [matches, setMatches] = useState<Record<string, string>>({});
	const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
	const [selectedRight, setSelectedRight] = useState<string | null>(null);

	const handleLeftClick = (item: string) => {
		if (showFeedback) return;

		if (selectedRight) {
			// If right item is selected, create match
			const newMatches = createMatch(matches, item, selectedRight);
			setMatches(newMatches);
			setSelectedRight(null);

			// Check if all pairs are matched
			if (isAllPairsMatched(newMatches, correctPairs)) {
				const answerString = generateAnswerString(newMatches, leftItems);
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
			const newMatches = createMatch(matches, selectedLeft, item);
			setMatches(newMatches);
			setSelectedLeft(null);

			// Check if all pairs are matched
			if (isAllPairsMatched(newMatches, correctPairs)) {
				const answerString = generateAnswerString(newMatches, leftItems);
				onAnswer(answerString);
			}
		} else {
			// Toggle selection of right item
			setSelectedRight(selectedRight === item ? null : item);
			setSelectedLeft(null);
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto px-4">
			<div className="grid grid-cols-2 gap-8">
				{/* Left column */}
				<div className="space-y-3">
					{leftItems.map((item, index) => (
						<PairMatchingItem
							key={`left-${index}`}
							item={item}
							index={index}
							side="left"
							showFeedback={showFeedback}
							selectedLeft={selectedLeft}
							selectedRight={selectedRight}
							matches={matches}
							correctPairs={correctPairs}
							onClick={handleLeftClick}
						/>
					))}
				</div>

				{/* Right column */}
				<div className="space-y-3">
					{rightItems.map((item, index) => (
						<PairMatchingItem
							key={`right-${index}`}
							item={item}
							index={index}
							side="right"
							showFeedback={showFeedback}
							selectedLeft={selectedLeft}
							selectedRight={selectedRight}
							matches={matches}
							correctPairs={correctPairs}
							onClick={handleRightClick}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default LearningPairMatchingAnswer;
