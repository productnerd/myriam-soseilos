
import React from "react";
import { UserSidequest } from "@/types/user";
import QuestCardBase from "./QuestCardBase";

interface QuestCardProps {
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
}

// This is now just a thin wrapper around the base component
// to maintain the same interface for existing imports
const QuestCard: React.FC<QuestCardProps> = ({
	quest,
	onToggleHidden,
	onSubmitQuest,
	onClaimRewards,
	currentTab = "active",
}) => {
	// Handle click behavior based on quest type
	const handleCardClick = () => {
		// For now, just use existing behavior
		return;
	};

	return (
		<QuestCardBase
			quest={quest}
			onToggleHidden={onToggleHidden}
			onSubmitQuest={onSubmitQuest}
			onClaimRewards={onClaimRewards}
			currentTab={currentTab}
			onCardClick={handleCardClick}
		/>
	);
};

export default QuestCard;
