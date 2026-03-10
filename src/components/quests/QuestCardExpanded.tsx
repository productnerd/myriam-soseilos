import React from "react";
import { UserSidequest } from "@/types/user";
import { QuestSubmission } from "@/types/quests";
import QuestCardDetails from "./QuestCardDetails";
import QuestSubmissionForm from "./QuestSubmissionForm";

interface QuestCardExpandedProps {
	quest: UserSidequest;
	isInReview: boolean;
	isCompleted: boolean;
	isExpired: boolean;
	isPending: boolean;
	requiresSubmission: boolean;
	requiresNoSubmission: boolean;
	questSubmission: QuestSubmission | null;
	isLoadingSubmission: boolean;
	isSubmittingLocally: boolean;
	isInReviewTab: boolean;
	isSelfExplorationQuiz: boolean;
	onSubmit: (
		quest: UserSidequest,
		imageFile: File | null,
		comment: string,
		description: string
	) => Promise<void>;
}

const QuestCardExpanded: React.FC<QuestCardExpandedProps> = ({
	quest,
	isInReview,
	isCompleted,
	isExpired,
	isPending,
	requiresSubmission,
	requiresNoSubmission,
	questSubmission,
	isLoadingSubmission,
	isSubmittingLocally,
	isInReviewTab,
	isSelfExplorationQuiz,
	onSubmit,
}) => {
	if (isSelfExplorationQuiz) {
		return null;
	}

	const handleSubmissionSuccess = () => {
		// Trigger the submission with the quest data
		// This will be handled by the parent component
	};

	return (
		<div className="transition-all duration-300 max-h-[500px] overflow-auto animate-accordion-down mt-6">
			{/* Display submission details for IN_REVIEW quests */}
			{isInReview && questSubmission && (
				<div className="mb-4">
					<div className="bg-amber-600/10 rounded-md border border-amber-600/20 p-4">
						<h3 className="text-sm font-medium mb-3">Your Submission</h3>

						{questSubmission.image && (
							<div className="mb-3">
								<img
									src={questSubmission.image}
									alt="Submission"
									className="max-h-56 w-full rounded-md object-contain border border-border/20"
								/>
							</div>
						)}

						{questSubmission.user_description && (
							<div className="mb-3">
								<h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">
									Description:
								</h4>
								<p className="text-sm">{questSubmission.user_description}</p>
							</div>
						)}

						{questSubmission.user_comment && (
							<div>
								<h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">
									Comment:
								</h4>
								<p className="text-sm">{questSubmission.user_comment}</p>
							</div>
						)}

						<div className="mt-3 text-xs text-amber-600">
							<p>
								Submitted: {new Date(questSubmission.created_at).toLocaleString()}
							</p>
							<p>
								Status:{" "}
								{questSubmission.status.charAt(0).toUpperCase() +
									questSubmission.status.slice(1)}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Only show quest details with instructions if not in review tab */}
			{!isInReviewTab && (
				<QuestCardDetails
					quest={quest}
					isCompleted={isCompleted}
					isExpired={isExpired}
					isPending={isPending}
					isRejected={questSubmission?.status === "rejected"}
					rejectionReason={questSubmission?.admin_comment || ""}
					isInReviewTab={isInReviewTab}
				/>
			)}

			{isLoadingSubmission && (
				<div className="flex justify-center py-6">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
				</div>
			)}

			{!isCompleted && !isExpired && !isPending && requiresSubmission && (
				<QuestSubmissionForm
					questId={quest.sidequest?.id || ""}
					userQuestId={quest.id}
					onSubmissionSuccess={handleSubmissionSuccess}
					requireImage={quest.sidequest?.require_image}
					requireDescription={quest.sidequest?.require_description}
				/>
			)}

			{!isCompleted && !isExpired && !isPending && requiresNoSubmission && (
				<div className="mt-4"></div>
			)}
		</div>
	);
};

export default QuestCardExpanded;
