import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserProgressProps {
	topicId: string;
	currentActivityId: string;
	nextActivityId: string | null;
	userId: string | null;
}

/**
 * Save the user's progress for a topic and activity.
 *
 * This function uses atomic database operations to ensure data integrity.
 * All progress updates are wrapped in a single transaction to prevent inconsistencies.
 */
export async function saveUserProgress({
	topicId,
	currentActivityId,
	nextActivityId,
	userId,
}: UserProgressProps): Promise<boolean> {
	try {
		if (!userId) {
			console.warn("[saveUserProgress] User not authenticated, cannot save progress");
			return false;
		}

		console.log(
			`[saveUserProgress] Starting atomic progress save for topic ${topicId}`
		);

		// Save the next activity ID as current_activity_id to resume from there
		const activityIdToSave = nextActivityId || currentActivityId;

		// Call the `save_user_progress` database function to save progress and increment daily activity
		const { data: result, error } = await supabase.rpc("save_user_progress" as any, {
			p_user_id: userId,
			p_topic_id: topicId,
			p_activity_id: activityIdToSave,
		});

		if (error) {
			console.error("[saveUserProgress] Failed to save progress:", error);
			toast.error("Error saving progress");
			return false;
		}

		if (!result || !result.success) {
			console.error("[saveUserProgress] Progress save returned failure:", result?.error);
			toast.error(result?.error || "Error saving progress");
			return false;
		}

		console.log(
			"[saveUserProgress] Progress saved successfully with atomic transaction for topic:",
			topicId,
			"and activity:",
			activityIdToSave
		);
		return true;
	} catch (error) {
		console.error("[saveUserProgress] Error saving user progress:", error);
		toast.error("Error saving progress");
		return false;
	}
}
