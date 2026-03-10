import React from "react";
import { Activity } from "@/types/activity";

interface LearningHeaderProps {
	activity: Activity;
	currentActivityIndex?: number;
	totalActivities?: number;
	hideCounter?: boolean;
}

const LearningHeader: React.FC<LearningHeaderProps> = ({
	activity,
	currentActivityIndex,
	totalActivities,
	hideCounter = true, // Default to hiding counter since we're using progress bar
}) => {
	// Set safe HTML for the question
	const questionHtml = { __html: activity.main_text };

	return (
		<div className="space-y-4">
			{/* Only show counter if explicitly requested and not hidden */}
			{!hideCounter && currentActivityIndex !== undefined && totalActivities && (
				<div className="text-sm text-muted-foreground">
					Activity {currentActivityIndex + 1} of {totalActivities}
				</div>
			)}

			<div className="text-lg font-medium" dangerouslySetInnerHTML={questionHtml} />
		</div>
	);
};

export default LearningHeader;
