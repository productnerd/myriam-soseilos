import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/ui/useToast";

/**
 * Hook for adding friends
 *
 * @param userId - The ID of the authenticated user
 * @returns Add friend mutation
 */
export function useAddFriend(userId: string) {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (friendEmail: string) => {
			// First, find the user by email
			const { data: userProfile, error: userError } = await supabase
				.from("profiles")
				.select("id")
				.eq("email", friendEmail)
				.maybeSingle();

			if (userError) {
				throw userError;
			}

			if (!userProfile || !userProfile.id) {
				throw new Error("User not found with this email");
			}

			// Check if friendship already exists
			const { data: existingFriendship, error: checkError } = await supabase
				.from("user_friends")
				.select("id")
				.eq("user_id", userId)
				.eq("friend_id", userProfile.id);

			if (checkError) throw checkError;

			if (existingFriendship && existingFriendship.length > 0) {
				throw new Error("This user is already your friend");
			}

			// Add to user_friends table (both directions for mutual friendship)
			const { error } = await supabase.from("user_friends").insert([
				{
					user_id: userId,
					friend_id: userProfile.id,
				},
				{
					user_id: userProfile.id,
					friend_id: userId,
				},
			]);

			if (error) throw error;

			return userProfile.id;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friends"] });
			toast({
				title: "Success",
				description: "Friend added successfully",
			});
		},
		onError: (error: Error) => {
			console.error("Error adding friend:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to add friend",
				variant: "destructive",
			});
		},
	});
}
