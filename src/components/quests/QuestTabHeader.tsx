import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";
import { Badge } from "@/components/ui/data/Badge";
import { useUnclaimedRewards } from "@/hooks/quests/useUnclaimedRewards";
import { UserSidequest } from "@/types/user";

interface QuestTabHeaderProps {
	questCounts: {
		active: number;
		hidden: number;
		inReview: number;
		completed: number;
		expired: number;
		locked: number;
	};
	showActiveTab: boolean;
	showHiddenTab: boolean;
	showInReviewTab: boolean;
	showCompletedTab: boolean;
	showExpiredTab: boolean;
	showLockedTab: boolean;
	currentTab: string;
	selectedType: "all" | "real-life-task" | "self-exploration-quiz";
	completedQuests: UserSidequest[];
}

const QuestTabHeader: React.FC<QuestTabHeaderProps> = ({
	questCounts,
	showActiveTab,
	showHiddenTab,
	showInReviewTab,
	showCompletedTab,
	showExpiredTab,
	showLockedTab,
	currentTab,
	selectedType,
	completedQuests,
}) => {
	const { data: unclaimedRewardsCount = 0 } = useUnclaimedRewards();

	// Calculate unclaimed rewards for the current quest type
	const unclaimedRewardsForType = React.useMemo(() => {
		if (selectedType === "all") {
			return unclaimedRewardsCount;
		}

		return completedQuests.filter((quest) => {
			// Determine quest type based on which ID is present
			const questType = quest.sidequest_id ? "real-life-task" : "self-exploration-quiz";
			const hasRewards =
				!quest.rewards_claimed &&
				((quest.sidequest?.dark_token_reward || 0) > 0 ||
					(quest.sidequest?.grey_token_reward || 0) > 0);
			return questType === selectedType && hasRewards;
		}).length;
	}, [completedQuests, selectedType, unclaimedRewardsCount]);

	return (
		<div className="flex justify-end mb-4">
			<TabsList className="grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full sm:w-auto overflow-x-auto">
				{showActiveTab && (
					<TabsTrigger
						value="active"
						className="uppercase flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
					>
						<span className="hidden sm:inline">ACTIVE</span>
						<span className="sm:hidden">ACT</span>
						<Badge
							variant="secondary"
							className="text-xs px-1 sm:px-1.5 py-0.5 h-4 sm:h-5"
						>
							{questCounts.active}
						</Badge>
					</TabsTrigger>
				)}

				{showCompletedTab && (
					<TabsTrigger
						value="completed"
						className="relative uppercase flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
					>
						<span className="hidden sm:inline">COMPLETED</span>
						<span className="sm:hidden">COM</span>
						<Badge
							variant="secondary"
							className="text-xs px-1 sm:px-1.5 py-0.5 h-4 sm:h-5"
						>
							{questCounts.completed}
						</Badge>
						{unclaimedRewardsForType > 0 && (
							<span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-500 ring-2 ring-background"></span>
						)}
					</TabsTrigger>
				)}

				{showLockedTab && (
					<TabsTrigger
						value="locked"
						className="uppercase flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
					>
						<span className="hidden sm:inline">LOCKED</span>
						<span className="sm:hidden">LCK</span>
						<Badge
							variant="secondary"
							className="text-xs px-1 sm:px-1.5 py-0.5 h-4 sm:h-5"
						>
							{questCounts.locked}
						</Badge>
					</TabsTrigger>
				)}

				{questCounts.hidden > 0 && showHiddenTab && (
					<TabsTrigger
						value="hidden"
						className="uppercase flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
					>
						<span className="hidden sm:inline">HIDDEN</span>
						<span className="sm:hidden">HID</span>
						<Badge
							variant="secondary"
							className="text-xs px-1 sm:px-1.5 py-0.5 h-4 sm:h-5"
						>
							{questCounts.hidden}
						</Badge>
					</TabsTrigger>
				)}

				{showInReviewTab && (
					<TabsTrigger
						value="inReview"
						className="uppercase flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
					>
						<span className="hidden sm:inline">IN REVIEW</span>
						<span className="sm:hidden">REV</span>
						<Badge
							variant="secondary"
							className="text-xs px-1 sm:px-1.5 py-0.5 h-4 sm:h-5"
						>
							{questCounts.inReview}
						</Badge>
					</TabsTrigger>
				)}

				{showExpiredTab && (
					<TabsTrigger
						value="expired"
						className="uppercase flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
					>
						<span className="hidden sm:inline">EXPIRED</span>
						<span className="sm:hidden">EXP</span>
						<Badge
							variant="secondary"
							className="text-xs px-1 sm:px-1.5 py-0.5 h-4 sm:h-5"
						>
							{questCounts.expired}
						</Badge>
					</TabsTrigger>
				)}
			</TabsList>
		</div>
	);
};

export default QuestTabHeader;
