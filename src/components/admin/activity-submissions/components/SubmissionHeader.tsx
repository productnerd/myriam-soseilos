import React from "react";
import { Trophy, Award } from "lucide-react";
import { ActivitySubmission } from "@/types/activity";

interface SubmissionHeaderProps {
	submission: ActivitySubmission;
}

export const SubmissionHeader: React.FC<SubmissionHeaderProps> = ({ submission }) => {
	return (
		<div className="flex justify-between items-start">
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Course:</span>
					<span>{submission.topic?.level?.course?.title || "Unknown Course"}</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Topic:</span>
					<span>{submission.topic?.title || "Unknown Topic"}</span>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1" title="Grey Points">
					<Trophy className="h-4 w-4 text-amber-400" />
					<span>{submission.user?.grey_points || 0}</span>
				</div>
				<div className="flex items-center gap-1" title="Dark Points">
					<Award className="h-4 w-4 text-purple-500" />
					<span>{submission.user?.dark_points || 0}</span>
				</div>
			</div>
		</div>
	);
};
