import React from "react";

interface ProgressBarProps {
	currentIndex: number;
	totalCount: number;
	showFeedback?: boolean; // Add this prop to increment progress as soon as user answers
}

const ProgressBar: React.FC<ProgressBarProps> = ({
	currentIndex,
	totalCount,
	showFeedback = false,
}) => {
	// If showing feedback, add 1 to currentIndex to immediately show progress
	const displayIndex = showFeedback ? currentIndex + 1 : currentIndex;
	const progressPercent = totalCount > 0 ? (displayIndex / totalCount) * 100 : 0;

	return (
		<div className="w-full">
			<div className="h-2 w-full bg-muted overflow-hidden rounded-full">
				<div
					className="h-full bg-primary transition-all duration-300 ease-in-out"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
