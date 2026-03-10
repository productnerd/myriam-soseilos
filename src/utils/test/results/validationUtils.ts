import { supabase } from "@/integrations/supabase/client";

/**
 * Validates that a topic belongs to the specified course
 */
export async function validateTopicBelongsToCourse(
	topicId: string,
	courseId: string
): Promise<boolean> {
	try {
		// Get the topic and verify its course
		const { data: topicData, error: topicError } = await supabase
			.from("topics")
			.select("level_id")
			.eq("id", topicId)
			.single();

		if (topicError) {
			console.error("Error fetching topic:", topicError);
			return false;
		}

		// Get the level and verify its course
		const { data: levelData, error: levelError } = await supabase
			.from("levels")
			.select("course_id")
			.eq("id", topicData.level_id)
			.single();

		if (levelError) {
			console.error("Error fetching level:", levelError);
			return false;
		}

		return levelData.course_id === courseId;
	} catch (error) {
		console.error("Error validating topic:", error);
		return false;
	}
}
