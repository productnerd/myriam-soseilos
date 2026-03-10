import React from "react";
import { Button } from "@/components/ui/interactive/Button";

interface LevelTestActionsProps {
	selectedAnswer: string;
	showFeedback: boolean;
	isLastActivity: boolean;
	onAdvance: () => void;
}

const LevelTestActions: React.FC<LevelTestActionsProps> = ({
	selectedAnswer,
	showFeedback,
	isLastActivity,
	onAdvance,
}) => {
	if (!showFeedback) {
		return (
			<Button onClick={onAdvance} disabled={!selectedAnswer} className="w-full mt-4">
				Submit Answer
			</Button>
		);
	}

	return (
		<Button onClick={onAdvance} className="w-full mt-4">
			{isLastActivity ? "Complete Test" : "Next Question"}
		</Button>
	);
};

export default LevelTestActions;
