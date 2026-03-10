import { supabase } from "@/integrations/supabase/client";
import { UserSidequest } from "@/types/user";
import { toast } from "@/hooks/ui/useToast";

//Service for completing a quest
export async function completeQuest(quest: UserSidequest, userId: string | null) {
	// Get current user ID to ensure proper row-level security
	if (!userId) {
		throw new Error("Authentication required to complete quests");
	}

	// Mark quest as completed
	const { data, error } = await supabase
		.from("user_sidequests")
		.update({
			state: "COMPLETED",
			completed_at: new Date().toISOString(),
		})
		.eq("id", quest.id)
		.eq("user_id", userId) // Add user_id filter to satisfy RLS
		.select();

	if (error) throw error;

	// Note: Point assignment is now deferred until rewards are claimed
	return data;
}

/**
 * Toast notifications for quest completion
 */
export const completionNotifications = {
	onSuccess: () => {
		toast.topRight({
			title: "Quest Completed!",
			description: "The quest has been marked as completed. You can now claim your rewards!",
		});
	},
	onError: (error: Error) => {
		toast({
			title: "Error",
			description: "Failed to complete quest: " + error.message,
			variant: "destructive",
		});
	},
};
