import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FriendScore } from "@/types/tests";

/**
 * Hook for fetching friend scores for a specific test
 *
 * @param testId - The ID of the test
 * @param userId - The ID of the authenticated user
 * @returns The friend scores data
 */
export function useTestFriendScores(testId: string | null, userId: string) {
	return useQuery({
		queryKey: ["friendScores", testId, userId],
		queryFn: async (): Promise<FriendScore[]> => {
			if (!testId) return [];

			try {
				// First get users that have the same access code
				const { data: userProfile } = await supabase
					.from("profiles")
					.select("access_code")
					.eq("id", userId)
					.single();

				if (!userProfile?.access_code) return [];

				// Get all users with same access code (friends)
				const { data: profiles, error: profilesError } = await supabase
					.from("profiles")
					.select("id, name, thumbnail")
					.eq("access_code", userProfile.access_code)
					.neq("id", userId); // Exclude current user

				if (profilesError) {
					console.error("Error fetching friend profiles:", profilesError);
					return [];
				}

				if (!profiles || profiles.length === 0) return [];

				// Get test scores for these friends
				const friendIds = profiles.map((p) => p.id);

				const { data: scores, error: scoresError } = await supabase
					.from("user_test_scores")
					.select("user_id, score")
					.eq("test_id", testId)
					.in("user_id", friendIds);

				if (scoresError) {
					console.error("Error fetching friend scores:", scoresError);
					return [];
				}

				if (!scores) return [];

				// Combine profiles with scores
				return scores.map((score) => {
					const profile = profiles.find((p) => p.id === score.user_id);
					if (!profile) {
						return {
							id: score.user_id,
							name: "Friend",
							avatar_url: "",
							score: score.score || 0,
						};
					}

					return {
						id: profile.id,
						name: profile.name || "Friend",
						avatar_url: profile.thumbnail || "",
						score: score.score || 0,
					};
				});
			} catch (error) {
				console.error("Error fetching friend scores:", error);
				return [];
			}
		},
		enabled: !!testId && !!userId, // Only run when testId is provided and userId is authenticated
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
