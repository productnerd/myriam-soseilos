
import React from "react";
import { UserSidequest } from "@/types/user";
import QuestCardDetails from "../QuestCardDetails";
import QuestSubmissionForm from "../QuestSubmissionForm";

interface QuestCardExpandedViewProps {
	quest: UserSidequest;
	isCompleted: boolean;
	isExpired: boolean;
	isPending: boolean;
	currentTab: "active" | "hidden" | "completed" | "expired" | "inReview";
	onSubmitQuest: (
		quest: UserSidequest,
		imageFile: File | null,
		comment: string,
		description: string
	) => void;
}

const QuestCardExpandedView: React.FC<QuestCardExpandedViewProps> = ({
	quest,
	isCompleted,
	isExpired,
	isPending,
	currentTab,
	onSubmitQuest,
}) => {
	const requiresSubmission =
		quest.sidequest?.require_image || quest.sidequest?.require_description;
	const isLocked = quest.state === "LOCKED";

	const handleSubmissionSuccess = () => {
		// Handle submission success - could trigger a refetch or callback
	};

	return (
		<div className="flex-grow max-h-[70vh] overflow-y-auto">
			{/* Quest details */}
			<QuestCardDetails
				quest={quest}
				isCompleted={isCompleted}
				isExpired={isExpired}
				isPending={isPending}
				isRejected={false}
				rejectionReason=""
				isInReviewTab={currentTab === "inReview"}
			/>

			{/* Submission form for active quests that require submission - only show if not in review */}
			{!isCompleted && !isExpired && !isPending && requiresSubmission && !isLocked && (
				<div className="mt-6 px-6">
					<QuestSubmissionForm
						questId={quest.sidequest?.id || ""}
						userQuestId={quest.id}
						onSubmissionSuccess={handleSubmissionSuccess}
						requireImage={quest.sidequest?.require_image}
						requireDescription={quest.sidequest?.require_description}
					/>
				</div>
			)}
		</div>
	);
};

export default QuestCardExpandedView;
