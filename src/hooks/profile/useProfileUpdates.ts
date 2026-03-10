import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";
import { toast } from "sonner";

export function useProfileUpdates(
	profile: UserProfile | null,
	updateProfileCallback: (updates: Partial<UserProfile>) => void
) {
	// Function to update user's name
	const handleNameUpdate = async (newName: string) => {
		if (!profile?.id) return;

		try {
			const { error } = await supabase
				.from("profiles")
				.update({ name: newName })
				.eq("id", profile.id);

			if (error) throw error;

			// Update local state
			updateProfileCallback({ name: newName });

			toast.success("Name updated successfully");
		} catch (error) {
			console.error("Error updating name:", error);
			toast.error("Failed to update name");
		}
	};

	// Function to update user's flag and country
	const handleFlagUpdate = async (flag: string, country: string) => {
		if (!profile?.id) return;

		try {
			// The database trigger will automatically set the country based on the flag
			const { error } = await supabase.from("profiles").update({ flag }).eq("id", profile.id);

			if (error) throw error;

			// Update local state with both flag and country
			updateProfileCallback({
				flag,
				country,
			});

			toast.success("Flag updated successfully");
		} catch (error) {
			console.error("Error updating flag:", error);
			toast.error("Failed to update flag");
		}
	};

	// Function to update user's favorite emoji
	const handleEmojiUpdate = async (emoji: string) => {
		if (!profile?.id) return;

		try {
			const { error } = await supabase
				.from("profiles")
				.update({ favorite_emoji: emoji })
				.eq("id", profile.id);

			if (error) throw error;

			// Update local state
			updateProfileCallback({ favorite_emoji: emoji });

			toast.success("Emoji updated successfully");
		} catch (error) {
			console.error("Error updating emoji:", error);
			toast.error("Failed to update emoji");
		}
	};

	return {
		handleNameUpdate,
		handleFlagUpdate,
		handleEmojiUpdate,
	};
}
