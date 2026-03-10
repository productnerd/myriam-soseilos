import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for fetching self-exploration results for a specific quest
 *
 * @param questId - The ID of the quest
 * @param userId - The ID of the authenticated user
 * @returns The self-exploration results data
 */
export const useSelfExplorationResults = (questId: string, userId: string) => {
	const queryResult = useQuery({
		queryKey: ["selfExplorationResults", questId, userId],
		queryFn: async () => {
			console.log("🔍 Fetching all self-exploration results for questId:", questId);
			console.log("👤 Fetching results for userId:", userId);

			const { data, error } = await supabase
				.from("self_exploration_results")
				.select("*")
				.eq("user_id", userId)
				.eq("quest_id", questId)
				.order("created_at", { ascending: false }); // Get all results, ordered by newest first

			if (error) {
				console.error("❌ Error fetching self-exploration results:", error);
				throw error;
			}

			console.log("✅ Self-exploration results fetched:", {
				hasData: !!data,
				count: data?.length || 0,
				results: data?.map((result) => ({
					id: result.id,
					created_at: result.created_at,
					hasAiResponse: !!result.ai_response,
					aiResponseLength: result.ai_response?.length || 0,
				})),
			});

			return data || [];
		},
		enabled: !!questId && !!userId, // Only run when questId is provided and userId is authenticated
		// Refetch more frequently to catch new results
		refetchInterval: 5000, // Refetch every 5 seconds
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});

	return queryResult;
};
