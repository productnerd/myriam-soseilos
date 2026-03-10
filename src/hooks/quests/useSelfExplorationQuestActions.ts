import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for managing self-exploration quest actions
 *
 * @param userId - The ID of the authenticated user
 * @returns Self-exploration quest action functions
 */
export const useSelfExplorationQuestActions = (userId: string) => {
	const queryClient = useQueryClient();

	const markAsCompleted = useMutation({
		mutationFn: async ({ questId }: { questId: string }) => {
			console.log("🎯 Marking self-exploration quest as completed:", { questId, userId });

			const { data, error } = await supabase
				.from("user_self_exploration_quests")
				.update({
					state: "COMPLETED",
					completed_at: new Date().toISOString(),
					progress: 100,
				})
				.eq("self_exploration_quest_id", questId)
				.eq("user_id", userId)
				.select()
				.single();

			if (error) {
				console.error("❌ Error marking quest as completed:", error);
				throw error;
			}

			console.log("✅ Quest marked as completed:", data);
			return data;
		},
		onSuccess: (data, variables) => {
			console.log("🎉 Quest completion success - invalidating queries");

			// Invalidate and refetch related queries
			queryClient.invalidateQueries({ queryKey: ["selfExplorationQuests"] });
			queryClient.invalidateQueries({
				queryKey: ["selfExplorationResults", variables.questId],
			});
			queryClient.invalidateQueries({ queryKey: ["userQuests"] });

			toast.success("Quest completed successfully!");
		},
		onError: (error) => {
			console.error("❌ Quest completion failed:", error);
			toast.error("Failed to complete quest. Please try again.");
		},
	});

	const toggleHidden = useMutation({
		mutationFn: async ({ questId, isHidden }: { questId: string; isHidden: boolean }) => {
			console.log("👁️ Toggling quest visibility:", { questId, userId, isHidden });

			const { data, error } = await supabase
				.from("user_self_exploration_quests")
				.update({ is_hidden: isHidden })
				.eq("self_exploration_quest_id", questId)
				.eq("user_id", userId)
				.select()
				.single();

			if (error) {
				console.error("❌ Error toggling quest visibility:", error);
				throw error;
			}

			console.log("✅ Quest visibility toggled:", data);
			return data;
		},
		onSuccess: () => {
			console.log("🎉 Quest visibility toggle success - invalidating queries");

			// Invalidate and refetch the quests list
			queryClient.invalidateQueries({ queryKey: ["selfExplorationQuests"] });
			queryClient.invalidateQueries({ queryKey: ["userQuests"] });

			toast.success("Quest visibility updated!");
		},
		onError: (error) => {
			console.error("❌ Quest visibility toggle failed:", error);
			toast.error("Failed to update quest visibility. Please try again.");
		},
	});

	const startQuest = useMutation({
		mutationFn: async (questId: string) => {
			console.log("🚀 Starting self-exploration quest:", questId);

			const { data, error } = await supabase
				.from("user_self_exploration_quests")
				.update({
					state: "IN_PROGRESS",
					current_question_index: 0,
					progress: 0,
				})
				.eq("self_exploration_quest_id", questId)
				.eq("user_id", userId)
				.select()
				.single();

			if (error) {
				console.error("❌ Error starting quest:", error);
				throw error;
			}

			console.log("✅ Quest started:", data);
			return data;
		},
		onSuccess: () => {
			console.log("🎉 Quest start success - invalidating queries");
			queryClient.invalidateQueries({ queryKey: ["selfExplorationQuests"] });
			queryClient.invalidateQueries({ queryKey: ["userQuests"] });
			toast.success("Quest started!");
		},
		onError: (error) => {
			console.error("❌ Failed to start quest:", error);
			toast.error("Failed to start quest. Please try again.");
		},
	});

	const startRetake = useMutation({
		mutationFn: async (questId: string) => {
			console.log("🔄 Starting quest retake:", questId);

			// Set state to LIVE and clear all progress data
			const { data, error } = await supabase
				.from("user_self_exploration_quests")
				.update({
					state: "LIVE",
					current_question_index: 0,
					progress: null,
					completed_at: null,
				})
				.eq("self_exploration_quest_id", questId)
				.eq("user_id", userId)
				.select()
				.single();

			if (error) {
				console.error("❌ Error starting retake:", error);
				throw error;
			}

			console.log("✅ Quest retake started with LIVE state:", data);
			return data;
		},
		onSuccess: () => {
			console.log("🎉 Quest retake success - invalidating queries");
			queryClient.invalidateQueries({ queryKey: ["selfExplorationQuests"] });
			queryClient.invalidateQueries({ queryKey: ["userQuests"] });
			toast.success("Press START whenever you are ready to retake the quiz");
		},
		onError: (error) => {
			console.error("❌ Failed to start retake:", error);
			toast.error("Failed to start retake. Please try again.");
		},
	});

	const checkRetakeEligibility = async (questId: string): Promise<boolean> => {
		console.log("🔍 Checking retake eligibility for:", questId);

		if (!userId) {
			return false;
		}

		const { data, error } = await supabase
			.from("self_exploration_retakes")
			.select("retake_count")
			.eq("user_id", userId)
			.eq("quest_id", questId)
			.eq("retake_date", new Date().toISOString().split("T")[0])
			.single();

		if (error && error.code !== "PGRST116") {
			console.error("❌ Error checking retake eligibility:", error);
			return false;
		}

		const retakeCount = data?.retake_count || 0;
		const canRetake = retakeCount < 3; // Allow up to 3 retakes per day

		console.log("✅ Retake eligibility check:", { retakeCount, canRetake });
		return canRetake;
	};

	return {
		markAsCompleted,
		toggleHidden,
		startQuest,
		startRetake,
		checkRetakeEligibility,
		isStartingQuest: startQuest.isPending,
		isStartingRetake: startRetake.isPending,
	};
};
