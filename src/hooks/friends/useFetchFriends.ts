import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/types/friends";

/**
 * Hook to fetch friends for the current user.
 * This includes both friends who invited the user and friends the user has invited.
 *
 * @param userId - The ID of the authenticated user
 * @returns The friends data
 */
export function useFetchFriends(userId: string) {
	const queryResult = useQuery({
		queryKey: ["friends", userId],
		queryFn: async (): Promise<Friend[]> => {
			console.log("Fetching friends for user:", userId);

			try {
				// Get all friends (both directions of invitation)
				const { data: friendProfiles, error } = await supabase
					.from("profiles")
					.select(
						"id, name, email, dark_points, grey_points, streak, thumbnail, last_active, flag, country, favorite_emoji, invited_by"
					)
					.or(`invited_by.eq.${userId},id.eq.${userId}`)
					.neq("id", userId) // Exclude the current user
					.order("last_active", { ascending: false });

				if (error) {
					console.error("Error fetching friends:", error);
					throw error;
				}

				console.log(`Found ${friendProfiles?.length || 0} friends for user:`, userId);

				// Mark which friends were invited by the current user
				const enhancedProfiles = friendProfiles.map((profile) => ({
					...profile,
					invited: profile.invited_by === userId,
				}));

				return enhancedProfiles as Friend[];
			} catch (error) {
				console.error("Error in useFetchFriends:", error);
				throw error;
			}
		},
		enabled: !!userId, // Only run when userId is provided
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return queryResult;
}
