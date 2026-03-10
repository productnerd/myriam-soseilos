import React from "react";
import { UserSidequest } from "@/types/user";
import QuestList from "./QuestList";
import ErrorState from "../test/ErrorState";
import LoadingState from "../loading/LoadingState";
import { toast } from "sonner";

interface QuestListWrapperProps {
	quests?: UserSidequest[];
	isLoading: boolean;
	error: Error | null;
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

const QuestListWrapper: React.FC<QuestListWrapperProps> = ({
	quests,
	isLoading,
	error,
	onToggleHidden,
	onSubmitQuest,
	onClaimRewards,
	currentTab = "active",
	onSwitchToActiveTab,
}) => {
	const handleRefresh = () => {
		window.location.reload();
		toast.success("Refreshing quests...");
	};

	if (isLoading) {
		return <LoadingState message="Loading quests..." />;
	}

	if (error) {
		return (
			<ErrorState
				message={`Error loading quests: ${error.message}`}
				onClose={handleRefresh}
			/>
		);
	}

	// Check for quest availability
	const hasQuests = quests && quests.length > 0;

	console.log("QuestListWrapper debug:", {
		hasQuests,
		questCount: quests?.length || 0,
		currentTab,
		questStates: quests?.map((q) => ({ id: q.id, state: q.state, isHidden: q.is_hidden })),
	});

	// Show simple empty message if no quests
	if (!hasQuests) {
		let emptyMessage = "No quests found.";
		if (currentTab === "inReview") {
			emptyMessage = "No quests under review.";
		} else if (currentTab === "completed") {
			emptyMessage = "No completed quests.";
		} else if (currentTab === "hidden") {
			emptyMessage = "No hidden quests.";
		} else if (currentTab === "expired") {
			emptyMessage = "No expired quests.";
		} else if (currentTab === "locked") {
			emptyMessage = "No locked quests. Complete more activities to unlock new quests!";
		} else if (currentTab === "active") {
			emptyMessage = "No active quests available.";
		}

		return <div className="py-8 text-center text-muted-foreground">{emptyMessage}</div>;
	}

	// Show the quest list with onClaimRewards properly passed down
	return (
		<QuestList
			quests={quests}
			onToggleHidden={onToggleHidden}
			onSubmitQuest={onSubmitQuest}
			onClaimRewards={onClaimRewards}
			currentTab={currentTab}
			onSwitchToActiveTab={onSwitchToActiveTab}
		/>
	);
};

export default QuestListWrapper;
