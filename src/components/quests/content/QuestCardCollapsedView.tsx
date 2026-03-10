
import React from "react";
import { UserSidequest } from "@/types/user";
import RealLifeTaskCollapsedView from "./RealLifeTaskCollapsedView";
import SelfExplorationCollapsedView from "./SelfExplorationCollapsedView";

interface QuestCardCollapsedViewProps {
  quest: UserSidequest;
  isLocked: boolean;
  hasProgress: boolean;
  onToggleHidden: (quest: UserSidequest) => void;
  currentTab?: "active" | "hidden" | "inReview" | "completed" | "expired";
}

const QuestCardCollapsedView: React.FC<QuestCardCollapsedViewProps> = ({
  quest,
  isLocked,
  hasProgress,
  onToggleHidden,
  currentTab = "active"
}) => {
  // Determine quest type based on the presence of self_exploration_quest_id vs sidequest_id
  const questType = quest.self_exploration_quest_id ? "self-exploration-quiz" : "real-life-task";
  const topicColor = quest.sidequest?.topic?.level?.course?.color || quest.self_exploration_quest?.topic?.level?.course?.color || "#4B5563";
  const isHidden = quest.is_hidden || false;

  if (questType === "self-exploration-quiz") {
    return (
      <SelfExplorationCollapsedView
        quest={quest}
        isLocked={isLocked}
        isHidden={isHidden}
        topicColor={topicColor}
        hasProgress={hasProgress}
        onToggleHidden={onToggleHidden}
        currentTab={currentTab}
      />
    );
  } else {
    return (
      <RealLifeTaskCollapsedView
        quest={quest}
        isLocked={isLocked}
        topicColor={topicColor}
        hasProgress={hasProgress}
        onToggleHidden={onToggleHidden}
      />
    );
  }
};

export default QuestCardCollapsedView;
