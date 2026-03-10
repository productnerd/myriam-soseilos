import React from "react";
import { QuestSubmission } from "@/types/quests";
import { Card } from "@/components/ui/layout/Card";
import SubmissionCardHeader from "./SubmissionCardHeader";
import SubmissionCardContent from "./SubmissionCardContent";
import SubmissionCardActions from "./SubmissionCardActions";

interface SubmissionCardProps {
	submission: QuestSubmission;
	onApprove: (submission: QuestSubmission) => void;
	onReject: (submission: QuestSubmission, reason: string) => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, onApprove, onReject }) => {
	return (
		<Card className="w-full">
			<SubmissionCardHeader submission={submission} />
			<SubmissionCardContent submission={submission} />
			<SubmissionCardActions
				submission={submission}
				onApprove={onApprove}
				onReject={onReject}
			/>
		</Card>
	);
};

export default SubmissionCard;
