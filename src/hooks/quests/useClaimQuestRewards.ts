
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserSidequest } from "@/types/user";
import { toast } from "sonner";
import { assignQuestRewards } from "@/utils/points/questPointsAssignment";

/**
 * Hook for claiming rewards from completed quests
 */
export function useClaimQuestRewards() {
	const queryClient = useQueryClient();
	const [celebrationQuest, setCelebrationQuest] = useState<UserSidequest | null>(null);

	const mutation = useMutation({
		mutationFn: async (quest: UserSidequest) => {
			console.log("Claiming rewards for quest:", quest.id);

			// Optimistically update the profile data in the cache
			const greyReward = quest.sidequest?.grey_token_reward || 0;
			const darkReward = quest.sidequest?.dark_token_reward || 0;

			queryClient.setQueryData(["profile"], (oldData: any) => {
				if (oldData) {
					return {
						...oldData,
						grey_points: (oldData.grey_points || 0) + greyReward,
						dark_points: (oldData.dark_points || 0) + darkReward,
					};
				}
				return oldData;
			});

			// Get the current user
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				throw new Error("User not authenticated");
			}

			// First assign the points to the user
			const pointsResult = await assignQuestRewards(
				user.id,
				greyReward,
				darkReward,
				quest.sidequest?.title || "Unknown Quest"
			);

			if (!pointsResult.success) {
				// Revert optimistic update on error
				queryClient.setQueryData(["profile"], (oldData: any) => {
					if (oldData) {
						return {
							...oldData,
							grey_points: (oldData.grey_points || 0) - greyReward,
							dark_points: (oldData.dark_points || 0) - darkReward,
						};
					}
					return oldData;
				});
				throw new Error(pointsResult.error || "Failed to assign points");
			}

			// Then mark rewards as claimed in the database
			const { data, error } = await supabase
				.from("user_sidequests")
				.update({ rewards_claimed: true })
				.eq("id", quest.id)
				.select("*");

			if (error) {
				// Revert optimistic update on error
				queryClient.setQueryData(["profile"], (oldData: any) => {
					if (oldData) {
						return {
							...oldData,
							grey_points: (oldData.grey_points || 0) - greyReward,
							dark_points: (oldData.dark_points || 0) - darkReward,
						};
					}
					return oldData;
				});
				throw error;
			}

			// Create a properly shaped UserSidequest object
			const updatedQuest: UserSidequest = {
				...quest,
				rewards_claimed: true,
			};

			// Set the celebration quest
			setCelebrationQuest(updatedQuest);

			return updatedQuest;
		},
		onSuccess: (data) => {
			// Invalidate both quests and profile queries to ensure UI updates
			queryClient.invalidateQueries({ queryKey: ["user_sidequests"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });

			toast.success("Rewards Claimed!", {
				description: "The quest rewards have been added to your account!",
			});
		},
		onError: (error) => {
			// Profile cache was already reverted in the mutationFn
			// Also invalidate profile to ensure consistency
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			toast.error("Failed to claim rewards: " + error.message);
		},
	});

	return {
		mutate: mutation.mutate,
		isPending: mutation.isPending,
		celebrationQuest,
		clearCelebration: () => setCelebrationQuest(null),
	};
}
