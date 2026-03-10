import { useQuery } from "@tanstack/react-query";
import { fetchUserQuests } from "@/utils/quests/queryQuests";

/**
 * Hook for retrieving user quests with filtering based on user's point level
 *
 * @param userId - The ID of the authenticated user
 * @returns An object containing quests data and functions to refresh the data
 */
export function useQuestsQuery(userId: string) {
	return useQuery({
		queryKey: ["user_sidequests", userId],
		queryFn: () => {
			return fetchUserQuests(userId);
		},
		retry: 1,
		enabled: !!userId, // Only run when userId is provided
	});
}
