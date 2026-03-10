
import React from "react";
import { UserSidequest } from "@/types/user";
import QuestGrid from "./QuestGrid";

interface QuestListProps {
	quests: UserSidequest[];
	onToggleHidden: (quest: UserSidequest) => void;
	onSubmitQuest?: (
		quest: UserSidequest,
		imageFile: File | null,
		comment: string,
		description: string
	) => void;
	onClaimRewards?: (quest: UserSidequest) => void;
	currentTab?: "active" | "hidden" | "inReview" | "completed" | "expired" | "locked";
	onSwitchToActiveTab?: () => void;
}

const QuestList: React.FC<QuestListProps> = ({
	quests,
	onToggleHidden,
	onSubmitQuest,
	onClaimRewards,
	currentTab = "active",
	onSwitchToActiveTab,
}) => {
	// Debug logging to understand quest rendering
	React.useEffect(() => {
		quests.forEach(quest => {
			console.log('🎯 QuestList rendering quest:', {
				id: quest.id,
				hasSelExpQuest: !!quest.self_exploration_quest_id,
				questData: typeof quest,
				isLocked: quest.state === "LOCKED"
			});
		});
	}, [quests]);

	return (
		<div className="space-y-6">
			<QuestGrid
				quests={quests}
				onToggleHidden={onToggleHidden}
				onSubmitQuest={onSubmitQuest || (() => {})}
				onClaimRewards={onClaimRewards}
				currentTab={currentTab}
				onSwitchToActiveTab={onSwitchToActiveTab}
			/>
		</div>
	);
};

export default QuestList;
