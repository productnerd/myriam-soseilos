import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for checking unclaimed quest rewards
 *
 * @param userId - The ID of the authenticated user
 * @returns The number of unclaimed rewards
 */
export const useUnclaimedRewards = (userId: string) => {
	return useQuery({
		queryKey: ["unclaimedRewards", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("user_sidequests")
				.select(
					`
          id,
          state,
          rewards_claimed,
          sidequest:sidequest_id (
            dark_token_reward,
            grey_token_reward
          )
        `
				)
				.eq("user_id", userId)
				.eq("state", "COMPLETED")
				.eq("rewards_claimed", false);

			if (error) {
				console.error("Error checking unclaimed rewards:", error);
				return 0;
			}

			// Filter quests that have rewards to claim
			const questsWithRewards =
				data?.filter((quest) => {
					const darkReward = quest.sidequest?.dark_token_reward || 0;
					const greyReward = quest.sidequest?.grey_token_reward || 0;
					return darkReward > 0 || greyReward > 0;
				}) || [];

			return questsWithRewards.length;
		},
		enabled: !!userId, // Only run when userId is provided
		refetchInterval: 30000, // Reduced from 10 seconds to 30 seconds
		staleTime: 10000, // Consider data stale after 10 seconds instead of 0
	});
};
