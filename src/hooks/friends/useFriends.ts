import { useFetchFriends } from "@/hooks/friends/useFetchFriends";
import { useAddFriend } from "@/hooks/friends/useAddFriend";
import { useRemoveFriend } from "@/hooks/friends/useRemoveFriend";
import { Friend } from "@/types/friends";

export type { Friend };

/**
 * Hook for managing friends
 *
 * @param userId - The ID of the authenticated user
 * @returns Friends state and actions
 */
export function useFriends(userId: string) {
	const friendsQuery = useFetchFriends(userId);
	const addFriendMutation = useAddFriend(userId);
	const removeFriendMutation = useRemoveFriend(userId);

	return {
		friends: friendsQuery.data || [],
		isLoading: friendsQuery.isLoading,
		isError: friendsQuery.isError,
		refetch: friendsQuery.refetch,
		addFriend: addFriendMutation.mutate,
		removeFriend: removeFriendMutation.mutate,
	};
}
