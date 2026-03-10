import React from "react";
import { ScrollArea } from "@/components/ui/layout/ScrollArea";
import { QuestSubmission } from "@/types/quests";
import SubmissionCard from "../submission-card/SubmissionCard";

interface SubmissionListProps {
	submissions: QuestSubmission[];
	onApprove: (submissionId: string, adminComment: string) => void;
	onReject: (submissionId: string, adminComment: string) => void;
}

const SubmissionList: React.FC<SubmissionListProps> = ({ submissions, onApprove, onReject }) => {
	// Sort submissions: pending first, then by date
	const sortedSubmissions = [...submissions].sort((a, b) => {
		// First sort by status (pending first)
		if (a.status === "pending" && b.status !== "pending") return -1;
		if (a.status !== "pending" && b.status === "pending") return 1;

		// Then by date (newest first)
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	});

	const handleApprove = (submission: QuestSubmission) => {
		onApprove(submission.id, "Approved");
	};

	const handleReject = (submission: QuestSubmission, reason: string) => {
		onReject(submission.id, reason);
	};

	return (
		<ScrollArea className="h-[70vh]">
			<div className="pr-3 space-y-4">
				{sortedSubmissions.map((submission) => (
					<SubmissionCard
						key={submission.id}
						submission={submission}
						onApprove={handleApprove}
						onReject={handleReject}
					/>
				))}
			</div>
		</ScrollArea>
	);
};

export default SubmissionList;
