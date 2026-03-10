import React from "react";
import { Button } from "@/components/ui/interactive/Button";

interface SubmissionActionsProps {
	onApprove: () => void;
	onReject: () => void;
	showRejectForm: boolean;
	onCancelReject: () => void;
	isApproving: boolean;
	isRejecting: boolean;
}

export const SubmissionActions: React.FC<SubmissionActionsProps> = ({
	onApprove,
	onReject,
	showRejectForm,
	onCancelReject,
	isApproving,
	isRejecting,
}) => {
	return (
		<div className="flex justify-end gap-2 pt-4">
			<Button onClick={onReject} disabled={isRejecting || isApproving} variant="destructive">
				{showRejectForm ? "Confirm Rejection" : "Reject"}
			</Button>
			<Button
				onClick={onApprove}
				disabled={isApproving || isRejecting || showRejectForm}
				variant="default"
				className="bg-green-600 hover:bg-green-700"
			>
				Approve
			</Button>
			{showRejectForm && (
				<Button onClick={onCancelReject} variant="outline">
					Cancel
				</Button>
			)}
		</div>
	);
};
