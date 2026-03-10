import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFriends } from "@/hooks/friends/useFriends";

export interface FriendTestScore {
	userId: string;
	name: string | null;
	thumbnail: string | null;
	score: number | null;
	passed: boolean | null;
	completedAt: string;
}

export function useFriendTestScores(testId: string | null) {
	const { friends } = useFriends();

	return useQuery({
		queryKey: ["friendTestScores", testId, friends.map((f) => f.id).join(",")],
		queryFn: async (): Promise<FriendTestScore[]> => {
			if (!testId || friends.length === 0) return [];

			try {
				// Get all friend IDs
				const friendIds = friends.map((friend) => friend.id);

				// Create a map of friend data for quick lookup
				const friendMap = friends.reduce((acc, friend) => {
					acc[friend.id] = friend;
					return acc;
				}, {} as Record<string, (typeof friends)[0]>);

				// First, get friends who share their scores
				const { data: profilesData, error: profilesError } = await supabase
					.from("profiles")
					.select("id, score_sharing")
					.in("id", friendIds)
					.eq("score_sharing", true); // Only get friends who share scores

				if (profilesError) {
					console.error("Error fetching friend profiles:", profilesError);
					throw profilesError;
				}

				// Get IDs of friends who share scores
				const sharingFriendIds = profilesData.map((profile) => profile.id);

				if (sharingFriendIds.length === 0) {
					return []; // No friends sharing scores
				}

				// Query for test scores of friends who share scores
				const { data, error } = await supabase
					.from("user_test_scores")
					.select("user_id, score, passed, completed_at")
					.eq("test_id", testId)
					.in("user_id", sharingFriendIds);

				if (error) {
					console.error("Error fetching friend test scores:", error);
					throw error;
				}

				// Map the data to include friend details
				return data.map((score) => ({
					userId: score.user_id,
					name: friendMap[score.user_id]?.name,
					thumbnail: friendMap[score.user_id]?.thumbnail,
					score: score.score,
					passed: score.passed,
					completedAt: score.completed_at,
				}));
			} catch (error) {
				console.error("Error in useFriendTestScores:", error);
				return [];
			}
		},
		enabled: !!testId && friends.length > 0,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}
