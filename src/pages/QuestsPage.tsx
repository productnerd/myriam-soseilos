import React, { useCallback } from "react";
import PageTransition from "@/components/ui/PageTransition";
import { Tabs } from "@/components/ui/navigation/Tabs";
import { UserSidequest } from "@/types/user";
import { useQuests } from "@/hooks/quests/useQuests";
import { useQuestTabs } from "@/hooks/quests/useQuestTabs";
import { useQuestTypeFilter } from "@/hooks/quests/useQuestTypeFilter";
import QuestTabHeader from "@/components/quests/QuestTabHeader";
import QuestTabContent from "@/components/quests/QuestTabContent";
import QuestRewardsCelebration from "@/components/quests/QuestRewardsCelebration";
import QuestTypeToggle from "@/components/quests/QuestTypeToggle";
import SelfExplorationLinker from "@/components/quests/self-exploration/SelfExplorationLinker";

const QuestsPage = () => {
	const {
		userQuests,
		selfExplorationQuests,
		isLoading,
		error,
		toggleQuestHiddenStatus,
		submitQuest,
		claimQuestRewards,
		isClaimingRewards,
		celebrationQuest,
		clearCelebration,
	} = useQuests();

	const { selectedType, setSelectedType, filteredQuestsByType, questTypeCounts } =
		useQuestTypeFilter(userQuests, selfExplorationQuests);

	const {
		tab,
		handleTabChange,
		questCounts,
		filteredQuests,
		showActiveTab,
		showHiddenTab,
		showInReviewTab,
		showExpiredTab,
		showCompletedTab,
		showLockedTab,
	} = useQuestTabs(filteredQuestsByType, filteredQuestsByType);

	// Check if we should show the type toggle (only if user has both quest types)
	const shouldShowTypeToggle =
		questTypeCounts["real-life-task"] > 0 && questTypeCounts["self-exploration-quiz"] > 0;

	// Get completed quests for notification calculation
	const completedQuests =
		filteredQuestsByType?.filter((quest) => quest.state === "COMPLETED") || [];

	const handleToggleHidden = useCallback(
		(quest: UserSidequest) => {
			console.log("QuestsPage - handleToggleHidden called:", {
				questId: quest.id,
				currentHidden: quest.is_hidden,
				newHidden: !quest.is_hidden,
				questType: quest.self_exploration_quest_id
					? "self-exploration-quiz"
					: "real-life-task",
			});

			const questType = quest.self_exploration_quest_id
				? "self-exploration-quiz"
				: "real-life-task";

			toggleQuestHiddenStatus.mutate({
				questId: quest.id,
				isHidden: !quest.is_hidden,
				questType,
			});
		},
		[toggleQuestHiddenStatus]
	);

	const handleSubmitQuest = useCallback(
		(quest: UserSidequest, imageFile: File | null, comment: string, description: string) => {
			console.log("QuestsPage - handleSubmitQuest called with:", {
				quest,
				imageFile,
				comment,
				description,
			});
			submitQuest(quest, imageFile, comment, description);
		},
		[submitQuest]
	);

	const handleClaimRewards = useCallback(
		(quest: UserSidequest) => {
			console.log("QuestsPage - handleClaimRewards called for quest:", quest.id);
			claimQuestRewards(quest);
		},
		[claimQuestRewards]
	);

	const handleSwitchToActiveTab = useCallback(() => {
		console.log("🔄 QuestsPage - handleSwitchToActiveTab called");
		handleTabChange("active");
	}, [handleTabChange]);

	return (
		<PageTransition>
			<SelfExplorationLinker />

			{celebrationQuest && (
				<QuestRewardsCelebration quest={celebrationQuest} onClose={clearCelebration} />
			)}

			<div className={`container mx-auto px-3 ${shouldShowTypeToggle ? "pb-40" : "pb-20"}`}>
				<Tabs
					defaultValue={tab}
					value={tab}
					onValueChange={handleTabChange}
					className="w-full"
				>
					<QuestTabHeader
						questCounts={questCounts}
						showActiveTab={showActiveTab}
						showHiddenTab={showHiddenTab}
						showInReviewTab={showInReviewTab}
						showCompletedTab={showCompletedTab}
						showExpiredTab={showExpiredTab}
						showLockedTab={showLockedTab}
						currentTab={tab}
						selectedType={selectedType}
						completedQuests={completedQuests}
					/>

					<QuestTabContent
						tab={tab}
						quests={filteredQuests}
						isLoading={isLoading}
						error={error}
						onToggleHidden={handleToggleHidden}
						onSubmitQuest={handleSubmitQuest}
						onClaimRewards={handleClaimRewards}
						onSwitchToActiveTab={handleSwitchToActiveTab}
					/>
				</Tabs>

				{shouldShowTypeToggle && (
					<QuestTypeToggle
						selectedType={selectedType}
						onTypeChange={setSelectedType}
						questTypeCounts={questTypeCounts}
						onTabChange={handleTabChange}
					/>
				)}
			</div>
		</PageTransition>
	);
};

export default React.memo(QuestsPage);
