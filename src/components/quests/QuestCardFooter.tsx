import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { UserSidequest } from "@/types/user";
import { Send, AlertTriangle, Gift } from "lucide-react";
import { Badge } from "@/components/ui/data/Badge";
import { pointTypes } from "@/lib/ui";
import { useProfileData } from "@/hooks/profile/useProfileData";

interface QuestCardFooterProps {
	quest: UserSidequest;
	isCompleted: boolean;
	isPending: boolean;
	isExpired: boolean;
	onToggleHidden: (quest: UserSidequest) => void;
	onOpenCard: () => void;
	onClaimRewards?: (quest: UserSidequest) => void;
	requiresSubmission: boolean;
	isExpanded: boolean;
	onSubmitQuest: () => void;
	currentTab?: "active" | "hidden" | "inReview" | "completed" | "expired";
}

const QuestCardFooter: React.FC<QuestCardFooterProps> = ({
	quest,
	isCompleted,
	isPending,
	isExpired,
	onToggleHidden,
	onOpenCard,
	onClaimRewards,
	requiresSubmission,
	isExpanded,
	onSubmitQuest,
	currentTab = "active",
}) => {
	const { profile } = useProfileData(user?.id || null);
	const { grey, dark } = pointTypes;
	const isLocked = quest.state === "LOCKED";

	// For now assume all are real-life-task
	const questType = "real-life-task";
	const greyUnlock = quest.sidequest?.grey_unlock;

	// Check if quest should be locked due to grey points requirement
	const userGreyPoints = profile?.grey_points || 0;
	const shouldShowLocked = isLocked || (greyUnlock && userGreyPoints < greyUnlock);
	const greyPointsNeeded =
		greyUnlock && userGreyPoints < greyUnlock ? greyUnlock - userGreyPoints : 0;
	const showGreyCountdown = greyPointsNeeded > 0;

	// Check if quest has rewards to claim
	const hasRewards =
		(quest.sidequest?.dark_token_reward || 0) > 0 ||
		(quest.sidequest?.grey_token_reward || 0) > 0;

	// Determine if rewards are claimable - simplified logic
	const canClaimRewards =
		isCompleted && !quest.rewards_claimed && hasRewards && onClaimRewards && !shouldShowLocked;

	// Determine if quest is submittable - hide submit buttons when locked or insufficient grey points
	const canSubmit =
		!isCompleted && !isPending && !isExpired && requiresSubmission && !shouldShowLocked;

	// Check if quest requires submission (has require_image or require_description set to true)
	const questRequiresSubmission =
		quest.sidequest?.require_image || quest.sidequest?.require_description;

	// Only log once per quest to avoid duplicate logs
	React.useEffect(() => {
		console.log("QuestCardFooter Debug:", {
			questId: quest.id,
			questTitle: quest.sidequest?.title,
			isCompleted,
			rewardsClaimed: quest.rewards_claimed,
			hasRewards,
			canClaimRewards,
			onClaimRewards: !!onClaimRewards,
			shouldShowLocked,
			currentTab,
			darkReward: quest.sidequest?.dark_token_reward,
			greyReward: quest.sidequest?.grey_token_reward,
		});
	}, [
		quest.id,
		isCompleted,
		quest.rewards_claimed,
		hasRewards,
		canClaimRewards,
		onClaimRewards,
		shouldShowLocked,
		currentTab,
	]);

	// Render rewards information
	const renderRewards = () => {
		const darkTokens = quest.sidequest?.dark_token_reward || 0;
		const greyTokens = quest.sidequest?.grey_token_reward || 0;

		return (
			<div className="flex items-center space-x-2">
				{darkTokens > 0 && (
					<div
						className={`flex items-center ${pointTypes.dark.bgLight} ${
							pointTypes.dark.borderLight
						} border rounded-full px-2 py-0.5 ${shouldShowLocked ? "opacity-50" : ""}`}
					>
						<dark.icon className={`h-3.5 w-3.5 mr-1 ${pointTypes.dark.textColor}`} />
						<span className={`text-xs font-medium ${pointTypes.dark.textColor}`}>
							{darkTokens}
						</span>
					</div>
				)}
				{greyTokens > 0 && (
					<div
						className={`flex items-center ${pointTypes.grey.bgLight} ${
							pointTypes.grey.borderLight
						} border rounded-full px-2 py-0.5 ${shouldShowLocked ? "opacity-50" : ""}`}
					>
						<grey.icon className={`h-3.5 w-3.5 mr-1 ${pointTypes.grey.textColor}`} />
						<span className={`text-xs font-medium ${pointTypes.grey.textColor}`}>
							{greyTokens}
						</span>
					</div>
				)}
			</div>
		);
	};

	// Render status badge - only show expired badge
	const renderStatusBadge = () => {
		if (isCompleted) {
			return null;
		} else if (isPending || quest.state === "IN_REVIEW") {
			return null;
		} else if (isExpired) {
			return (
				<Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
					<AlertTriangle className="h-3 w-3 mr-1" />
					Expired
				</Badge>
			);
		}
		return null;
	};

	// Render action button - only for expanded real-life cards
	const renderActionButton = () => {
		if (shouldShowLocked) {
			return null;
		} else if (canClaimRewards) {
			return (
				<Button
					size="sm"
					className="bg-green-500 hover:bg-green-600 text-white"
					onClick={(e) => {
						e.stopPropagation();
						console.log("Claiming rewards for quest:", quest.id);
						onClaimRewards(quest);
					}}
				>
					<Gift className="h-4 w-4 mr-2" />
					Claim Rewards
				</Button>
			);
		} else if (canSubmit && isExpanded) {
			// Submit button for expanded real-life cards only
			return (
				<Button
					size="sm"
					className="bg-orange-500 hover:bg-orange-600 text-white"
					onClick={(e) => {
						e.stopPropagation();
						onSubmitQuest();
					}}
				>
					<Send className="h-4 w-4 mr-2" />
					Submit Quest
				</Button>
			);
		} else {
			return null;
		}
	};

	// Render small submit button for collapsed cards that require submission
	const renderSmallSubmitButton = () => {
		if (
			questRequiresSubmission &&
			!isCompleted &&
			!isPending &&
			!isExpired &&
			!shouldShowLocked &&
			!isExpanded
		) {
			return (
				<Button
					size="sm"
					className="bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 p-0 rounded-md"
					onClick={(e) => {
						e.stopPropagation();
						onOpenCard();
					}}
				>
					<Send className="h-4 w-4" />
				</Button>
			);
		}
		return null;
	};

	return (
		<div className="flex w-full px-5 py-5 justify-between items-end mt-auto">
			{/* Left side - Points */}
			<div className="flex items-end">{renderRewards()}</div>

			{/* Right side - Status and action buttons */}
			<div className="flex items-end space-x-2">
				{!isExpanded && renderStatusBadge()}
				{renderActionButton()}
				{renderSmallSubmitButton()}
			</div>
		</div>
	);
};

export default QuestCardFooter;
