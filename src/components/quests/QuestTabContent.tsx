import React from "react";
import { TabsContent } from "@/components/ui/navigation/Tabs";
import { UserSidequest } from "@/types/user";
import QuestListWrapper from "./QuestListWrapper";

interface QuestTabContentProps {
	tab: string;
	quests: UserSidequest[];
	isLoading: boolean;
	error: Error | null;
	onToggleHidden: (quest: UserSidequest) => void;
	onSubmitQuest: (
		quest: UserSidequest,
		imageFile: File | null,
		comment: string,
		description: string
	) => void;
	onClaimRewards: (quest: UserSidequest) => void;
	onSwitchToActiveTab?: () => void;
}

const QuestTabContent: React.FC<QuestTabContentProps> = ({
	tab,
	quests,
	isLoading,
	error,
	onToggleHidden,
	onSubmitQuest,
	onClaimRewards,
	onSwitchToActiveTab,
}) => {
	const tabs = ["active", "hidden", "inReview", "completed", "expired", "locked"];

	return (
		<div className="space-y-6">
			{tabs.map((tabName) => (
				<TabsContent key={tabName} value={tabName} className="space-y-6">
					<QuestListWrapper
						quests={quests}
						isLoading={isLoading}
						error={error}
						onToggleHidden={onToggleHidden}
						onSubmitQuest={onSubmitQuest}
						onClaimRewards={onClaimRewards}
						currentTab={
							tabName as
								| "active"
								| "hidden"
								| "inReview"
								| "completed"
								| "expired"
								| "locked"
						}
						onSwitchToActiveTab={onSwitchToActiveTab}
					/>
				</TabsContent>
			))}
		</div>
	);
};

export default QuestTabContent;
