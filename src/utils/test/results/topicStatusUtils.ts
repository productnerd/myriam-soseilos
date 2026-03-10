import { supabase } from "@/integrations/supabase/client";

/**
 * Update topics statuses for a user for a specific level
 * @param userId User ID
 * @param courseId Course ID
 * @param levelId Level ID
 * @param topics List of topics to update
 * @returns Promise<void>
 */
export async function updateTopicStatuses(
	userId: string,
	courseId: string,
	levelId: string,
	topics: { id: string }[]
): Promise<void> {
	// Set the first topic to in_progress and others to locked
	for (let i = 0; i < topics.length; i++) {
		const topicId = topics[i].id;
		const status = i === 0 ? "in_progress" : "locked";

		// First check if the topic progress already exists
		const { data: existingProgress } = await supabase
			.from("user_progress")
			.select("id")
			.eq("user_id", userId)
			.eq("current_topic_id", topicId)
			.maybeSingle();

		if (existingProgress) {
			// Update existing progress
			const { error } = await supabase
				.from("user_progress")
				.update({
					current_topic_id: topicId,
					current_level_id: levelId,
				})
				.eq("user_id", userId)
				.eq("course_id", courseId);

			if (error) {
				console.error(`Failed to update topic ${topicId} status:`, error);
			}
		} else {
			// Create new progress entry
			const { error } = await supabase.from("user_progress").insert({
				user_id: userId,
				current_topic_id: topicId,
				current_level_id: levelId,
				course_id: courseId,
				status: "INPROGRESS",
			});

			if (error) {
				console.error(`Failed to create topic progress for topic ${topicId}:`, error);
			}
		}
	}
}
