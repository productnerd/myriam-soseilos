import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { assignPointsToUser } from "@/utils/points/learnPointsAssigment/topicPoints";
import { checkGreyPointQuestUnlocks } from "@/utils/quests/unlockQuests";

/**
 * Marks a topic as completed and updates the next topic to in-progress.
 * Also awards points for topic completion.
 *
 * This function uses atomic database operations to ensure data integrity.
 * All progress updates are wrapped in a single transaction to prevent inconsistencies.
 *
 * @param topicId - the ID of the topic that was completed
 * @param userId - the ID of the authenticated user
 * @returns Promise<boolean> - whether the operation was successful
 */
export async function completeTopicAndProgress(topicId: string, userId: string): Promise<boolean> {
	try {
		console.log(
			`[completeTopicAndProgress] Starting atomic topic completion for topic ${topicId}`
		);

		// =============================================================================
		// Step 1: Call the `get_topic_completion_data` database function to gather all required data:
		// - The current topic's details (id, level_id, order_number, course_id)
		// - If the topic is already completed by the user
		// - All topics in the same level (to check completion status)
		// - All completed topics for this level by this user
		// - The next topic in the level (if any)
		// =============================================================================
		const { data: topicData, error: dataError } = await supabase.rpc(
			"get_topic_completion_data" as any,
			{
				p_topic_id: topicId,
				p_user_id: userId,
			}
		);

		if (dataError) {
			console.error("[completeTopicAndProgress] Failed to gather topic data:", dataError);
			return false;
		}

		if (!topicData || topicData.length === 0) {
			console.error("[completeTopicAndProgress] No topic data found");
			return false;
		}

		const { topic, course_id, existing_completion, all_topics, completed_topics, next_topic } =
			topicData[0] as any;

		// =============================================================================
		// Step 2: Call the `complete_topic` database function to perform topic completion:
		// - Mark the topic as completed in `user_completed_topics` (if not already completed)
		// - Update `user_progress` based on the completion state:
		//    - If all topics in level are completed ==> current_topic_id = NULL
		//    - If there's a next topic ==> current_topic_id = next_topic_id
		// =============================================================================
		const { data: completionResult, error: completionError } = await supabase.rpc(
			"complete_topic" as any,
			{
				p_user_id: userId,
				p_topic_id: topicId,
				p_course_id: course_id,
				p_level_id: topic.level_id,
				p_is_already_completed: !!existing_completion,
				p_next_topic_id: next_topic?.id || null,
				p_all_topics_completed: all_topics.every(
					(t: any) =>
						completed_topics.some((ct: any) => ct.topic_id === t.id) || t.id === topicId
				),
			}
		);

		if (completionError) {
			console.error("[completeTopicAndProgress] Failed to complete topic:", completionError);
			toast.error("Failed to complete topic");
			return false;
		}

		if (!completionResult || !completionResult.success) {
			console.error(
				"[completeTopicAndProgress] Completion returned failure:",
				completionResult?.error
			);
			toast.error(completionResult?.error || "Failed to complete topic");
			return false;
		}

		// Step 3: Award points only if topic wasn't already completed
		if (!existing_completion) {
			console.log("[completeTopicAndProgress] Awarding points for new topic completion");
			const pointsAssigned = await assignPointsToUser(userId, topicId);

			if (!pointsAssigned) {
				// We don't fail the entire operation if points fail, but we rather log it
				console.error(
					"[completeTopicAndProgress] Failed to assign points for topic completion"
				);
			} else {
				console.log(
					"[completeTopicAndProgress] Points successfully assigned for topic completion"
				);
			}
		} else {
			console.log(
				`[completeTopicAndProgress] Topic ${topicId} was already completed, skipping points`
			);
		}

		// Step 4: Handle quest unlocks (non-critical operations)
		try {
			await checkGreyPointQuestUnlocks(userId);
		} catch (questError) {
			// We don't fail the entire operation for quest issues, but we rather log it
			console.error(
				"[completeTopicAndProgress] Quest unlock failed (non-critical):",
				questError
			);
		}

		console.log(
			`[completeTopicAndProgress] Topic ${topicId} completed successfully with atomic transaction`
		);
		return true;
	} catch (error) {
		console.error("[completeTopicAndProgress] Error completing topic:", error);
		toast.error("Failed to update progress");
		return false;
	}
}
