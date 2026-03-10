import React from "react";
import { ActivitySubmission } from "@/types/activity";
import { Badge } from "@/components/ui/data/Badge";
import { formatDistanceToNow } from "date-fns";
import { Trophy, Award } from "lucide-react";

interface SubmissionsListProps {
	submissions: ActivitySubmission[];
	selectedSubmission: ActivitySubmission | null;
	onSelectSubmission: (submission: ActivitySubmission) => void;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({
	submissions,
	selectedSubmission,
	onSelectSubmission,
}) => {
	if (submissions.length === 0) {
		return (
			<div className="text-center p-8 text-muted-foreground">
				<p className="text-lg font-medium mb-2">All caught up!</p>
				<p>No pending submissions to review</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{submissions.map((submission) => (
				<div
					key={submission.id}
					className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
						selectedSubmission?.id === submission.id ? "bg-muted border-primary" : ""
					}`}
					onClick={() => onSelectSubmission(submission)}
				>
					<div className="flex items-center gap-2">
						<span className="font-medium">{submission.user?.name || "Unknown"}</span>
						{submission.user?.flag && <span>{submission.user.flag}</span>}
						{submission.user?.tags &&
							submission.user.tags
								.filter((tag) => tag !== "CONTRIBUTOR")
								.map((tag) => (
									<Badge key={tag} variant="outline" className="text-xs">
										{tag}
									</Badge>
								))}
					</div>
					<div className="flex justify-between items-center mt-1">
						<span className="text-xs text-muted-foreground">
							{formatDistanceToNow(new Date(submission.created_at), {
								addSuffix: true,
							})}
						</span>
						<div className="flex items-center gap-3 text-xs">
							<div className="flex items-center gap-1" title="Grey Points">
								<Trophy className="h-3 w-3 text-amber-400" />
								<span>{submission.user?.grey_points || 0}</span>
							</div>
							<div className="flex items-center gap-1" title="Dark Points">
								<Award className="h-3 w-3 text-purple-400" />
								<span>{submission.user?.dark_points || 0}</span>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default SubmissionsList;
