import React from "react";
import { QuestSubmission } from "@/types/quests";
import EmptyStateMessage from "./EmptyStateMessage";
import SubmissionList from "./SubmissionList";

interface SubmissionDetailsProps {
	selectedSidequest: string | null;
	submissions: QuestSubmission[];
	onApprove: (submissionId: string, adminComment: string) => void;
	onReject: (submissionId: string, adminComment: string) => void;
}

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
	selectedSidequest,
	submissions,
	onApprove,
	onReject,
}) => {
	// Show empty state if no sidequest selected
	if (!selectedSidequest) {
		return <EmptyStateMessage selectedSidequest={selectedSidequest} />;
	}

	// Show empty state if no submissions
	if (submissions.length === 0) {
		return <EmptyStateMessage selectedSidequest={selectedSidequest} />;
	}

	// Render the submissions list
	return <SubmissionList submissions={submissions} onApprove={onApprove} onReject={onReject} />;
};

export default SubmissionDetails;
