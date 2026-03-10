import React from "react";
import { UserSidequest } from "@/types/user";
import QuestCard from "./QuestCard";
import SelfExplorationQuestCard from "./content/SelfExplorationQuestCard";
import { useProfileData } from "@/hooks/profile/useProfileData";

interface QuestGridProps {
	quests: UserSidequest[];
	onToggleHidden: (quest: UserSidequest) => void;
	onSubmitQuest: (
		quest: UserSidequest,
		imageFile: File | null,
		comment: string,
		description: string
	) => void;
	onClaimRewards?: (quest: UserSidequest) => void;
	currentTab?: "active" | "hidden" | "inReview" | "completed" | "expired" | "locked";
	onSwitchToActiveTab?: () => void;
}

const QuestGrid: React.FC<QuestGridProps> = ({
	quests,
	onToggleHidden,
	onSubmitQuest,
	onClaimRewards,
	currentTab = "active",
	onSwitchToActiveTab,
}) => {
	const { profile } = useProfileData(user?.id || null);
	const userGreyPoints = profile?.grey_points || 0;

	// Sort quests to put locked ones last
	const sortedQuests = [...quests].sort((a, b) => {
		const aLocked =
			a.state === "LOCKED" ||
			(a.sidequest?.grey_unlock && userGreyPoints < a.sidequest.grey_unlock);
		const bLocked =
			b.state === "LOCKED" ||
			(b.sidequest?.grey_unlock && userGreyPoints < b.sidequest.grey_unlock);

		// If one is locked and the other isn't, put locked one last
		if (aLocked && !bLocked) return 1;
		if (!aLocked && bLocked) return -1;

		// Otherwise maintain original order
		return 0;
	});

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{sortedQuests.map((quest) => {
				// Check if this is a self-exploration quest
				if (quest.self_exploration_quest_id) {
					// Cast to the self-exploration quest type
					const selfExplorationQuest = quest as any; // We'll need to properly type this
					return (
						<SelfExplorationQuestCard
							key={quest.id}
							userQuest={selfExplorationQuest}
							onRetakeComplete={onSwitchToActiveTab}
						/>
					);
				}

				// Regular sidequest - make sure onClaimRewards is passed down
				return (
					<QuestCard
						key={quest.id}
						quest={quest}
						onToggleHidden={onToggleHidden}
						onSubmitQuest={onSubmitQuest}
						onClaimRewards={onClaimRewards}
						currentTab={
							currentTab as "active" | "hidden" | "inReview" | "completed" | "expired"
						}
					/>
				);
			})}
		</div>
	);
};

export default QuestGrid;
