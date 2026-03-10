import { supabase } from "@/integrations/supabase/client";

/**
 * Update user progress for a specific course
 * @param userId User ID
 * @param courseId Course ID
 * @param topicId Topic ID
 * @param levelId Level ID
 * @returns Promise<boolean> Whether the update was successful
 */
export async function updateUserProgress(
	userId: string,
	courseId: string,
	topicId: string,
	levelId: string
): Promise<boolean> {
	try {
		const { error } = await supabase
			.from("user_progress")
			.update({
				current_level_id: levelId,
				current_topic_id: topicId,
				status: "INPROGRESS",
			})
			.eq("user_id", userId)
			.eq("course_id", courseId);

		if (error) {
			console.error("Failed to update user progress:", error);
			return false;
		}

		return true;
	} catch (err) {
		console.error("Exception in updateUserProgress:", err);
		return false;
	}
}

/**
 * Update user progress after completing an initial test
 * @param userId User ID
 * @param courseId Course ID
 * @param topicId Topic ID
 * @returns Promise<boolean> Whether the update was successful
 */
export async function updateUserProgressForInitialTest(
	userId: string,
	courseId: string,
	topicId: string
): Promise<boolean> {
	try {
		// Get the level of the topic
		const { data: topic, error: topicError } = await supabase
			.from("topics")
			.select("level_id")
			.eq("id", topicId)
			.single();

		if (topicError || !topic) {
			console.error("Failed to get level ID for topic:", topicError);
			return false;
		}

		const levelId = topic.level_id;

		const { error } = await supabase
			.from("user_progress")
			.update({
				current_level_id: levelId,
				current_topic_id: topicId,
				status: "INPROGRESS",
			})
			.eq("user_id", userId)
			.eq("course_id", courseId);

		if (error) {
			console.error("Failed to update user progress after initial test:", error);
			return false;
		}

		return true;
	} catch (err) {
		console.error("Exception in updateUserProgressForInitialTest:", err);
		return false;
	}
}
