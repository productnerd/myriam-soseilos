import React from "react";
import { Progress } from "@/components/ui/data/Progress";

interface LearningProgressBarProps {
	currentIndex: number;
	totalCount: number;
	showFeedback: boolean;
	className?: string;
}

const LearningProgressBar: React.FC<LearningProgressBarProps> = ({
	currentIndex,
	totalCount,
	showFeedback,
	className = "",
}) => {
	// Calculate progress - empty at start, fills as activities are completed
	const calculateProgress = () => {
		if (totalCount === 0) return 0;

		// If feedback is showing, the current activity is considered complete
		const completedActivities = showFeedback ? currentIndex + 1 : currentIndex;
		return (completedActivities / totalCount) * 100;
	};

	const progress = calculateProgress();

	return (
		<div className={`w-full ${className}`}>
			<Progress
				value={progress}
				className="h-2 w-full"
				indicatorClassName="bg-primary transition-all duration-300"
			/>
		</div>
	);
};

export default LearningProgressBar;
