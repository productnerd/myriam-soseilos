import { supabase } from "@/integrations/supabase/client";
import { markTopicAsCompleted } from "./topicStatus";
import { getNextTopic } from "@/utils/courses/courseNavigation";
import { unlockQuestsOnTopicCompletion } from "@/utils/quests/unlockQuestsOnTopicCompletion";

/**
 * Update topic progress when a topic is completed
 */
export async function updateTopicProgress(
	completedTopicId: string,
	userId: string | null
): Promise<boolean> {
	try {
		console.log("Updating topic progress for completed topic:", completedTopicId);

		if (!userId) {
			console.error("No user ID available");
			return false;
		}

		// Get the topic details to get the level and course
		const { data: topic, error: topicError } = await supabase
			.from("topics")
			.select("level_id, order_number")
			.eq("id", completedTopicId)
			.single();

		if (topicError) {
			console.error("Error getting topic details:", topicError);
			return false;
		}

		// Get the course for this level
		const { data: level, error: levelError } = await supabase
			.from("levels")
			.select("course_id")
			.eq("id", topic.level_id)
			.single();

		if (levelError) {
			console.error("Error getting level details:", levelError);
			return false;
		}

		// Mark the topic as completed in user_completed_topics
		await markTopicAsCompleted(userId, completedTopicId, topic.level_id, level.course_id);

		// Unlock quests related to this topic
		await unlockQuestsOnTopicCompletion(userId, completedTopicId);

		// Get the next topic in this level
		const nextTopic = await getNextTopic(topic.level_id, topic.order_number);

		if (nextTopic) {
			// Update user_progress to point to the next topic
			const { error: progressError } = await supabase
				.from("user_progress")
				.update({
					current_topic_id: nextTopic.id,
					current_activity_id: null,
					updated_at: new Date().toISOString(),
				})
				.eq("user_id", userId)
				.eq("course_id", level.course_id);

			if (progressError) {
				console.error("Error updating user progress:", progressError);
				return false;
			}
		} else {
			// This was the last topic in the level, set current_topic_id to null
			// to indicate that the user needs to take the level test
			const { error: progressError } = await supabase
				.from("user_progress")
				.update({
					current_topic_id: null,
					current_activity_id: null,
					updated_at: new Date().toISOString(),
				})
				.eq("user_id", userId)
				.eq("course_id", level.course_id);

			if (progressError) {
				console.error("Error updating user progress:", progressError);
				return false;
			}
		}

		return true;
	} catch (error) {
		console.error("Error updating topic progress:", error);
		return false;
	}
}
