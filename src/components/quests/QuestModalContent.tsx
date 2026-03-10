
import React from "react";
import { UserSidequest } from "@/types/user";
import QuestCardImage from "./QuestCardImage";
import QuestCardDetails from "./QuestCardDetails";
import QuestSubmissionForm from "./QuestSubmissionForm";
import QuestCardFooter from "./QuestCardFooter";

interface QuestModalContentProps {
	quest: UserSidequest;
	isCompleted: boolean;
	isPending: boolean;
	isExpired: boolean;
	currentTab: "active" | "hidden" | "completed" | "expired" | "inReview";
	onSubmitQuest: (
		quest: UserSidequest,
		imageFile: File | null,
		comment: string,
		description: string
	) => void;
	onToggleHidden: (quest: UserSidequest) => void;
	onClaimRewards?: (quest: UserSidequest) => void;
}

const QuestModalContent: React.FC<QuestModalContentProps> = ({
	quest,
	isCompleted,
	isPending,
	isExpired,
	currentTab,
	onSubmitQuest,
	onToggleHidden,
	onClaimRewards,
}) => {
	const requiresSubmission =
		quest.sidequest?.require_image || quest.sidequest?.require_description;
	const isLocked = quest.state === "LOCKED";
	
	// Determine quest type
	const questType = quest.self_exploration_quest_id ? "self-exploration-quiz" : "real-life-task";

	const handleSubmissionSuccess = () => {
		// Handle submission success - could trigger a refetch or callback
	};

	return (
		<div className="flex flex-col h-full max-h-[80vh]">
			{/* Quest image - only for real-life tasks */}
			{questType === "real-life-task" && (
				<div className="flex-shrink-0">
					<QuestCardImage 
						image={quest.sidequest?.image}
						icon={quest.sidequest?.icon}
						questTitle={quest.sidequest?.title || ''}
						quest={quest}
						currentTab={currentTab}
						onToggleHidden={onToggleHidden}
					/>
				</div>
			)}

			{/* Scrollable content */}
			<div className="flex-grow overflow-y-auto px-6 py-4 min-h-0">
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

				{/* Submission form for active quests that require submission */}
				{!isCompleted && !isExpired && !isPending && requiresSubmission && !isLocked && (
					<div className="mt-6">
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

			{/* Footer with actions */}
			<div className="flex-shrink-0 border-t border-border/20 px-6 py-4">
				<QuestCardFooter
					quest={quest}
					isCompleted={isCompleted}
					isPending={isPending}
					isExpired={isExpired}
					onToggleHidden={onToggleHidden}
					onOpenCard={() => {}}
					onClaimRewards={onClaimRewards}
					requiresSubmission={requiresSubmission}
					isExpanded={true}
					onSubmitQuest={() => {}}
					currentTab={currentTab}
				/>
			</div>
		</div>
	);
};

export default QuestModalContent;
