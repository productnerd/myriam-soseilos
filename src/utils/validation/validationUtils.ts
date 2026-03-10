import { supabase } from "@/integrations/supabase/client";

/**
 * Validate that an activity's topic belongs to the specified course
 */
export async function validateNextActivity(
	nextActivityId: string,
	courseId: string
): Promise<boolean> {
	try {
		// Get the topic ID from the activity
		const { data: activityData, error: activityError } = await supabase
			.from("activities")
			.select("topic_id")
			.eq("id", nextActivityId)
			.single();

		if (activityError) {
			console.error("Error fetching activity:", activityError);
			return false;
		}

		// If activity has a topic ID, validate it belongs to the course
		if (activityData.topic_id) {
			// Get the level ID from the topic
			const { data: topicData, error: topicError } = await supabase
				.from("topics")
				.select("level_id")
				.eq("id", activityData.topic_id)
				.single();

			if (topicError) {
				console.error("Error fetching next topic:", topicError);
				return false;
			}

			// Get the course ID from the level
			const { data: levelData, error: levelError } = await supabase
				.from("levels")
				.select("course_id")
				.eq("id", topicData.level_id)
				.single();

			if (levelError) {
				console.error("Error fetching next level:", levelError);
				return false;
			}

			// Check if the topic's course matches our course
			return levelData.course_id === courseId;
		}

		// If activity doesn't have a topic ID, assume it's valid
		return true;
	} catch (error) {
		console.error("Error validating next activity:", error);
		return false;
	}
}
