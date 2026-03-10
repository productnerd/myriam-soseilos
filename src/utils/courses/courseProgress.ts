import { supabase } from "@/integrations/supabase/client";

/**
 * Get the course ID for a topic by traversing the topic -> level -> course hierarchy
 */
export async function getTopicCourseInfo(topicId: string): Promise<string | null> {
	try {
		// Get the level ID from the topic
		const { data: topicData, error: topicError } = await supabase
			.from("topics")
			.select("level_id")
			.eq("id", topicId)
			.single();

		if (topicError) {
			console.error("Error fetching topic:", topicError);
			return null;
		}

		// Get the course ID from the level
		const { data: levelData, error: levelError } = await supabase
			.from("levels")
			.select("course_id")
			.eq("id", topicData.level_id)
			.single();

		if (levelError) {
			console.error("Error fetching level:", levelError);
			return null;
		}

		return levelData.course_id;
	} catch (error) {
		console.error("Error getting course info for topic:", error);
		return null;
	}
}

/**
 * Update the user progress record
 */
export async function updateUserProgressRecord(
	userId: string,
	courseId: string,
	topicId: string,
	activityId: string
): Promise<boolean> {
	try {
		// Force current timestamp to ensure the record is updated
		const timestamp = new Date().toISOString();

		const { error: updateError } = await supabase.from("user_progress").upsert(
			{
				user_id: userId,
				course_id: courseId,
				current_topic_id: topicId,
				current_activity_id: activityId,
				status: "INPROGRESS",
				updated_at: timestamp,
			},
			{
				onConflict: "user_id,course_id",
				ignoreDuplicates: false, // Ensure update happens
			}
		);

		if (updateError) {
			console.error("Error updating user progress:", updateError);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error updating user progress record:", error);
		return false;
	}
}
