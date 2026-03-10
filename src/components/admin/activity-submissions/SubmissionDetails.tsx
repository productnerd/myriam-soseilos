import React, { useState } from "react";
import { ActivitySubmission } from "@/types/activity";
import { toast } from "sonner";
import { SubmissionHeader } from "./components/SubmissionHeader";
import { RejectionForm } from "./components/RejectionForm";
import { DarkPointsDialog } from "./components/DarkPointsDialog";
import { SubmissionForm } from "./components/SubmissionForm";
import { SubmissionActions } from "./components/SubmissionActions";
import { validateSubmission } from "./utils/submissionValidation";

interface SubmissionDetailsProps {
	submission: ActivitySubmission;
	onSubmissionChange: (updated: ActivitySubmission) => void;
	onApprove: (submission: ActivitySubmission, darkPoints?: number) => void;
	onReject: (submission: ActivitySubmission) => void;
	isApproving: boolean;
	isRejecting: boolean;
}

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
	submission,
	onSubmissionChange,
	onApprove,
	onReject,
	isApproving,
	isRejecting,
}) => {
	const [rejectReason, setRejectReason] = useState("");
	const [showRejectForm, setShowRejectForm] = useState(false);
	const [showDarkPointsDialog, setShowDarkPointsDialog] = useState(false);

	const handleApprove = () => {
		const validationErrors = validateSubmission(submission);

		if (validationErrors.length > 0) {
			toast.error(
				<div>
					<p className="font-bold mb-1">Please fix the following errors:</p>
					<ul className="list-disc pl-4">
						{validationErrors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>
			);
			return;
		}

		setShowDarkPointsDialog(true);
	};

	const handleReject = () => {
		if (showRejectForm) {
			const submissionWithComment = {
				...submission,
				admin_comment: rejectReason,
			};
			onReject(submissionWithComment);
			setShowRejectForm(false);
		} else {
			setShowRejectForm(true);
		}
	};

	const handleDarkPointsConfirm = (darkPoints: number) => {
		onApprove(submission, darkPoints);
		setShowDarkPointsDialog(false);
	};

	return (
		<div className="border rounded-md p-6 space-y-6">
			<SubmissionHeader submission={submission} />

			<SubmissionForm submission={submission} onSubmissionChange={onSubmissionChange} />

			{showRejectForm && <RejectionForm reason={rejectReason} onChange={setRejectReason} />}

			<SubmissionActions
				onApprove={handleApprove}
				onReject={handleReject}
				showRejectForm={showRejectForm}
				onCancelReject={() => setShowRejectForm(false)}
				isApproving={isApproving}
				isRejecting={isRejecting}
			/>

			<DarkPointsDialog
				isOpen={showDarkPointsDialog}
				onClose={() => setShowDarkPointsDialog(false)}
				onConfirm={handleDarkPointsConfirm}
			/>
		</div>
	);
};

export default SubmissionDetails;
