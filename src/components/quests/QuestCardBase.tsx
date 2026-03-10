
import React, { useState, useCallback } from "react";
import { UserSidequest } from "@/types/user";
import QuestCardContainer from "./QuestCardContainer";
import QuestCardImage from "./QuestCardImage";
import QuestCardContent from "./QuestCardContent";
import QuestCardFooter from "./QuestCardFooter";
import QuestModalContent from "./QuestModalContent";

interface QuestCardBaseProps {
	quest: UserSidequest;
	onToggleHidden: (quest: UserSidequest) => void;
	onSubmitQuest: (
		quest: UserSidequest,
		imageFile: File | null,
		comment: string,
		description: string
	) => void;
	onClaimRewards?: (quest: UserSidequest) => void;
	currentTab?: "active" | "hidden" | "inReview" | "completed" | "expired";
	onCardClick?: () => void;
}

const QuestCardBase: React.FC<QuestCardBaseProps> = ({
	quest,
	onToggleHidden,
	onSubmitQuest,
	onClaimRewards,
	currentTab = "active",
	onCardClick,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSubmittingLocally, setIsSubmittingLocally] = useState(false);

	const isCompleted = quest.state === "COMPLETED";
	const isPending = quest.state === "IN_REVIEW";
	const isExpired = quest.state === "EXPIRED";
	const isDisabled = quest.state === "LOCKED";

	const requiresSubmission =
		quest.sidequest?.require_image || quest.sidequest?.require_description;
	const hasProgress = quest.progress !== undefined && quest.progress > 0;

	// Determine quest type
	const questType = quest.self_exploration_quest_id ? "self-exploration-quiz" : "real-life-task";

	const handleToggleExpand = useCallback(() => {
		if (onCardClick) {
			onCardClick();
		}
		setIsExpanded(!isExpanded);
	}, [isExpanded, onCardClick]);

	const handleSubmitQuest = useCallback(
		(quest: UserSidequest, imageFile: File | null, comment: string, description: string) => {
			setIsSubmittingLocally(true);
			onSubmitQuest(quest, imageFile, comment, description);

			// Reset after animation
			setTimeout(() => {
				setIsSubmittingLocally(false);
				setIsExpanded(false);
			}, 300);
		},
		[onSubmitQuest]
	);

	const handleOpenCard = useCallback(() => {
		setIsExpanded(true);
	}, []);

  return (
    <QuestCardContainer
      isExpanded={isExpanded}
      isDisabled={isDisabled}
      isSubmittingLocally={isSubmittingLocally}
      isCompleted={isCompleted}
      onToggleExpand={handleToggleExpand}
      quest={quest}
    >
      {isExpanded ? (
        // Show modal content when expanded
        <QuestModalContent
          quest={quest}
          isCompleted={isCompleted}
          isPending={isPending}
          isExpired={isExpired}
          currentTab={currentTab}
          onSubmitQuest={handleSubmitQuest}
          onToggleHidden={onToggleHidden}
          onClaimRewards={onClaimRewards}
        />
      ) : (
        // Show regular card content when not expanded
        <div className="quest-card flex flex-col h-full">
          {/* Only show QuestCardImage for real-life tasks */}
          {questType === "real-life-task" && (
            <QuestCardImage 
              image={quest.sidequest?.image}
              icon={quest.sidequest?.icon}
              questTitle={quest.sidequest?.title || ''}
              quest={quest}
              currentTab={currentTab}
              onToggleHidden={onToggleHidden}
            />
          )}
          
          <QuestCardContent
            quest={quest}
            isCompleted={isCompleted}
            isPending={isPending}
            isExpired={isExpired}
            isExpanded={false}
            onToggleExpand={handleToggleExpand}
            onToggleHidden={onToggleHidden}
            onSubmitQuest={handleSubmitQuest}
            currentTab={currentTab}
            hasProgress={hasProgress}
          />
          
          <QuestCardFooter
            quest={quest}
            isCompleted={isCompleted}
            isPending={isPending}
            isExpired={isExpired}
            onToggleHidden={onToggleHidden}
            onOpenCard={handleOpenCard}
            onClaimRewards={onClaimRewards}
            requiresSubmission={requiresSubmission}
            isExpanded={false}
            onSubmitQuest={() => {}}
            currentTab={currentTab}
          />
        </div>
      )}
    </QuestCardContainer>
  );
};

export default QuestCardBase;
