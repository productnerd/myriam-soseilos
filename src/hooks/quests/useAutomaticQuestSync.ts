import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook to run the quest expiration check manually
 */
export function useAutomaticQuestSync() {
	// Function to trigger the edge function manually
	const triggerQuestUpdate = async () => {
		try {
			// Call the edge function to update expired quests
			const { data, error } = await supabase.functions.invoke("update-expired-quests");

			if (error) {
				console.error("Error calling update-expired-quests:", error);
				toast.error("Failed to update quest statuses.");
				return false;
			}

			console.log("Quest update result:", data);
			toast.success("Quest statuses updated successfully!");
			return true;
		} catch (error) {
			console.error("Error during quest update:", error);
			toast.error("Failed to update quest statuses.");
			return false;
		}
	};

	return {
		triggerQuestUpdate,
	};
}
