import React from "react";
import { UserSidequest } from "@/types/user";
import QuestCardCollapsedView from "./content/QuestCardCollapsedView";
import QuestCardExpandedView from "./content/QuestCardExpandedView";

interface QuestCardContentProps {
	quest: UserSidequest;
	isCompleted: boolean;
	isPending: boolean;
	isExpired: boolean;
	isExpanded: boolean;
	onToggleExpand: () => void;
	onToggleHidden: (quest: UserSidequest) => void;
	onSubmitQuest: (
		quest: UserSidequest,
		imageFile: File | null,
		comment: string,
		description: string
	) => void;
	currentTab: "active" | "hidden" | "completed" | "expired" | "inReview";
	hasProgress: boolean;
}

const QuestCardContent: React.FC<QuestCardContentProps> = ({
	quest,
	isCompleted,
	isPending,
	isExpired,
	isExpanded,
	onToggleExpand,
	onToggleHidden,
	onSubmitQuest,
	currentTab,
	hasProgress,
}) => {
	const isLocked = quest.state === "LOCKED";

	if (!isExpanded) {
		return (
			<QuestCardCollapsedView
				quest={quest}
				isLocked={isLocked}
				hasProgress={hasProgress}
				onToggleHidden={onToggleHidden}
				currentTab={currentTab}
			/>
		);
	}

	return (
		<QuestCardExpandedView
			quest={quest}
			isCompleted={isCompleted}
			isExpired={isExpired}
			isPending={isPending}
			currentTab={currentTab}
			onSubmitQuest={onSubmitQuest}
		/>
	);
};

export default QuestCardContent;
