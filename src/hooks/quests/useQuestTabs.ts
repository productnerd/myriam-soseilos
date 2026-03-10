import { useMemo, useState, useCallback, useEffect } from "react";
import { UserSidequest } from "@/types/quests";
import { useProfileData } from "@/hooks/profile/useProfileData";

export const useQuestTabs = (
	userQuests: UserSidequest[] = [],
	filteredQuestsByType: UserSidequest[] = []
) => {
	const [tab, setTab] = useState<
		"active" | "hidden" | "inReview" | "completed" | "expired" | "locked"
	>("active");
	const { profile } = useProfileData(user?.id || null);
	const userGreyPoints = profile?.grey_points || 0;

	const handleTabChange = useCallback((newTab: string) => {
		setTab(newTab as "active" | "hidden" | "inReview" | "completed" | "expired" | "locked");
	}, []);

	const questCounts = useMemo(() => {
		if (!filteredQuestsByType?.length) {
			return {
				active: 0,
				hidden: 0,
				inReview: 0,
				completed: 0,
				expired: 0,
				locked: 0,
			};
		}

		const isQuestGreyLocked = (quest: UserSidequest) => {
			const greyUnlockRequired =
				quest.sidequest?.grey_unlock || quest.self_exploration_quest?.grey_unlock || 0;
			return greyUnlockRequired > 0 && userGreyPoints < greyUnlockRequired;
		};

		// Separate quests by their database state and grey point requirements
		const dbLockedQuests = filteredQuestsByType.filter((quest) => quest.state === "LOCKED");
		const greyLockedQuests = filteredQuestsByType.filter(
			(quest) => quest.state !== "LOCKED" && isQuestGreyLocked(quest)
		);
		const availableQuests = filteredQuestsByType.filter(
			(quest) => quest.state !== "LOCKED" && !isQuestGreyLocked(quest)
		);

		const active = availableQuests.filter((quest) => {
			const isActiveState = quest.state === "LIVE" || quest.state === "IN_PROGRESS";
			const isNotHidden = !quest.is_hidden;
			return isActiveState && isNotHidden;
		}).length;

		const hidden = availableQuests.filter((quest) => quest.is_hidden).length;
		const inReview = availableQuests.filter((quest) => quest.state === "IN_REVIEW").length;
		const completed = availableQuests.filter((quest) => quest.state === "COMPLETED").length;
		const expired = availableQuests.filter((quest) => quest.state === "EXPIRED").length;
		const locked = dbLockedQuests.length + greyLockedQuests.length;

		return {
			active,
			hidden,
			inReview,
			completed,
			expired,
			locked,
		};
	}, [filteredQuestsByType, userGreyPoints]);

	// Auto-switch tabs when active is empty but completed has items
	useEffect(() => {
		if (tab === "active" && questCounts.active === 0 && questCounts.completed > 0) {
			setTab("completed");
		}
	}, [tab, questCounts.active, questCounts.completed]);

	// Hide active tab if it's empty and completed has items
	const showActiveTab = questCounts.active > 0 || questCounts.completed === 0;

	const filteredQuests = useMemo(() => {
		if (!filteredQuestsByType?.length) return [];

		const isQuestGreyLocked = (quest: UserSidequest) => {
			const greyUnlockRequired =
				quest.sidequest?.grey_unlock || quest.self_exploration_quest?.grey_unlock || 0;
			return greyUnlockRequired > 0 && userGreyPoints < greyUnlockRequired;
		};

		let filtered: UserSidequest[] = [];

		switch (tab) {
			case "active":
				filtered = filteredQuestsByType.filter((quest) => {
					const isActiveState = quest.state === "LIVE" || quest.state === "IN_PROGRESS";
					const isNotHidden = !quest.is_hidden;
					const isNotDbLocked = quest.state !== "LOCKED";
					const isNotGreyLocked = !isQuestGreyLocked(quest);
					return isActiveState && isNotHidden && isNotDbLocked && isNotGreyLocked;
				});
				break;
			case "hidden":
				filtered = filteredQuestsByType.filter(
					(quest) =>
						quest.is_hidden && quest.state !== "LOCKED" && !isQuestGreyLocked(quest)
				);
				break;
			case "inReview":
				filtered = filteredQuestsByType.filter(
					(quest) => quest.state === "IN_REVIEW" && !isQuestGreyLocked(quest)
				);
				break;
			case "completed":
				filtered = filteredQuestsByType
					.filter((quest) => quest.state === "COMPLETED" && !isQuestGreyLocked(quest))
					.sort((a, b) => {
						const aHasUnclaimedRewards =
							!a.rewards_claimed &&
							((a.sidequest?.dark_token_reward || 0) > 0 ||
								(a.sidequest?.grey_token_reward || 0) > 0 ||
								(a.self_exploration_quest?.dark_token_reward || 0) > 0 ||
								(a.self_exploration_quest?.grey_token_reward || 0) > 0);
						const bHasUnclaimedRewards =
							!b.rewards_claimed &&
							((b.sidequest?.dark_token_reward || 0) > 0 ||
								(b.sidequest?.grey_token_reward || 0) > 0 ||
								(b.self_exploration_quest?.dark_token_reward || 0) > 0 ||
								(b.self_exploration_quest?.grey_token_reward || 0) > 0);

						if (aHasUnclaimedRewards && !bHasUnclaimedRewards) return -1;
						if (!aHasUnclaimedRewards && bHasUnclaimedRewards) return 1;
						return 0;
					});
				break;
			case "expired":
				filtered = filteredQuestsByType.filter(
					(quest) => quest.state === "EXPIRED" && !isQuestGreyLocked(quest)
				);
				break;
			case "locked":
				// Include both database-locked quests and grey-point-locked quests
				filtered = filteredQuestsByType.filter(
					(quest) => quest.state === "LOCKED" || isQuestGreyLocked(quest)
				);
				break;
			default:
				filtered = filteredQuestsByType.filter((quest) => {
					const isActiveState = quest.state === "LIVE" || quest.state === "IN_PROGRESS";
					const isNotHidden = !quest.is_hidden;
					const isNotDbLocked = quest.state !== "LOCKED";
					const isNotGreyLocked = !isQuestGreyLocked(quest);
					return isActiveState && isNotHidden && isNotDbLocked && isNotGreyLocked;
				});
		}

		return filtered;
	}, [filteredQuestsByType, tab, userGreyPoints]);

	const showHiddenTab = questCounts.hidden > 0;
	const showInReviewTab = questCounts.inReview > 0;
	const showCompletedTab = questCounts.completed > 0;
	const showExpiredTab = questCounts.expired > 0;
	const showLockedTab = questCounts.locked > 0;

	return {
		tab,
		handleTabChange,
		questCounts,
		filteredQuests,
		showActiveTab,
		showHiddenTab,
		showInReviewTab,
		showCompletedTab,
		showExpiredTab,
		showLockedTab,
	};
};
