import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidequest } from "@/types/quests";
import { toast } from "sonner";
import { shouldShowToast } from "@/utils/ui/toastUtils";

/**
 * Hook for fetching quests that are unlocked when a user completes a topic
 *
 * @param topicId - The ID of the topic that was completed
 * @param userId - The ID of the authenticated user (always available via global context)
 * @returns Unlocked quests data and loading state
 */
export function useUnlockedQuests(topicId: string, userId: string) {
	const query = useQuery({
		queryKey: ["unlockedQuests", userId, topicId],
		queryFn: async (): Promise<Sidequest[]> => {
			if (!userId) return [];

			console.log("Fetching unlocked quests for topic:", topicId);

			const { data: existingQuests, error: existingError } = await supabase
				.from("user_sidequests")
				.select("sidequest_id")
				.eq("user_id", userId);

			if (existingError) {
				console.error("Error fetching existing quests:", existingError);
				throw existingError;
			}

			const existingQuestIds = new Set(existingQuests?.map((q) => q.sidequest_id) || []);

			let queryBuilder = supabase
				.from("sidequests")
				.select(
					`
          id, 
          title, 
          description, 
          grey_token_reward, 
          dark_token_reward,
          status,
          topic_id,
          expiry,
          completion_count,
          created_at,
          topic:topic_id (
            id,
            title,
            level:level_id (
              course:course_id (
                color
              )
            )
          )
        `
				)
				.eq("status", "ACTIVE");

			// If topicId is provided, filter quests by topic
			if (topicId) {
				queryBuilder = queryBuilder.eq("topic_id", topicId);
			}

			const { data, error } = await queryBuilder;

			if (error) {
				console.error("Error fetching unlocked quests:", error);
				throw error;
			}

			// Filter out quests that the user already has
			const newQuests = (data || [])
				.filter((quest) => !existingQuestIds.has(quest.id))
				// Ensure the status field is properly typed to match our updated Sidequest type
				.map((quest) => ({
					...quest,
					status: quest.status as "ACTIVE" | "DRAFT" | "ARCHIVED" | "EXPIRED",
				})) as Sidequest[];

			if (newQuests.length > 0) {
				console.log("Found new quests to assign:", newQuests);

				// Create user_sidequests entries for the new quests
				const userQuestsToCreate = newQuests.map((quest) => ({
					user_id: userId,
					sidequest_id: quest.id,
					state: "LIVE",
					created_at: new Date().toISOString(),
				}));

				const { error: insertError } = await supabase
					.from("user_sidequests")
					.insert(userQuestsToCreate);

				if (insertError) {
					console.error("Error creating user quests:", insertError);
					throw insertError;
				}

				// Use the debouncer to prevent duplicate toast notifications
				const toastMessage = `${newQuests.length} new ${
					newQuests.length === 1 ? "quest" : "quests"
				} unlocked!`;
				if (shouldShowToast(toastMessage)) {
					// Show notification in the top-right position
					toast.success(toastMessage, {
						position: "top-right",
					});
				}
			}

			return newQuests;
		},
		enabled: !!userId, // Only run when user is authenticated
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: true,
	});

	return query;
}
