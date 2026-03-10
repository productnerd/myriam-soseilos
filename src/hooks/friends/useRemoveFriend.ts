import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/ui/useToast";

/**
 * Hook for removing friends
 *
 * @param userId - The ID of the authenticated user
 * @returns Remove friend mutation
 */
export function useRemoveFriend(userId: string) {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (friendId: string) => {
			// Remove friendship from both directions
			const { error } = await supabase
				.from("user_friends")
				.delete()
				.or(
					`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
				);

			if (error) throw error;

			return friendId;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friends"] });
			toast({
				title: "Success",
				description: "Friend removed successfully",
			});
		},
		onError: (error: Error) => {
			console.error("Error removing friend:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to remove friend",
				variant: "destructive",
			});
		},
	});
}
