import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { QuestSubmission } from "@/types/quests";

interface SubmissionCardActionsProps {
	submission: QuestSubmission;
	onApprove: (submission: QuestSubmission) => void;
	onReject: (submission: QuestSubmission, reason: string) => void;
	isProcessing?: boolean;
}

const SubmissionCardActions: React.FC<SubmissionCardActionsProps> = ({
	submission,
	onApprove,
	onReject,
	isProcessing = false,
}) => {
	if (submission.status !== "pending") {
		return null;
	}

	const handleReject = () => {
		const reason = prompt("Please provide a reason for rejection:");
		if (reason) {
			onReject(submission, reason);
		}
	};

	const handleComment = () => {
		const comment = prompt("Add a comment:");
		if (comment) {
			// Handle comment logic here if needed
			console.log("Comment:", comment);
		}
	};

	return (
		<div className="p-4 pt-0 flex flex-wrap gap-2 justify-end">
			<Button
				variant="outline"
				size="sm"
				className="text-muted-foreground"
				onClick={handleComment}
				disabled={isProcessing}
			>
				<MessageSquare className="h-4 w-4 mr-1" />
				Comment
			</Button>
			<Button
				variant="outline"
				size="sm"
				className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
				onClick={handleReject}
				disabled={isProcessing}
			>
				<XCircle className="h-4 w-4 mr-1" />
				Reject
			</Button>
			<Button
				variant="outline"
				size="sm"
				className="text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600"
				onClick={() => onApprove(submission)}
				disabled={isProcessing}
			>
				<CheckCircle className="h-4 w-4 mr-1" />
				Approve
			</Button>
		</div>
	);
};

export default SubmissionCardActions;
