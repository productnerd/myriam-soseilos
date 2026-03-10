import { supabase } from "@/integrations/supabase/client";

/**
 * Validates that a topic belongs to the specified course
 * @param topicId - The topic ID to validate
 * @param courseId - The course ID to check against
 * @returns Promise<boolean> - True if topic belongs to course, false otherwise
 */
export async function validateTopicBelongsToCourse(
	topicId: string,
	courseId: string
): Promise<boolean> {
	try {
		// Get the level the topic corresponds to
		const { data: topicData, error: topicError } = await supabase
			.from("topics")
			.select("level_id")
			.eq("id", topicId)
			.single();

		if (topicError) {
			console.error(
				"[topicValidation] Error validating topic (fetching level data):",
				topicError
			);
			return false;
		}

		// Use the fetched 'level_id' to get the 'course_id'
		const { data: levelData, error: levelError } = await supabase
			.from("levels")
			.select("course_id")
			.eq("id", topicData.level_id)
			.single();

		if (levelError) {
			console.error(
				"[topicValidation] Error validating level (fetching course data):",
				levelError
			);
			return false;
		}

		// Check if the topic belongs to the course
		return levelData.course_id === courseId;
	} catch (error) {
		console.error("[topicValidation] Error validating topic hierarchy:", error);
		return false;
	}
}
