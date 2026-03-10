import { supabase } from "@/integrations/supabase/client";
import { updateUserProgress } from "./userProgressUtils";
import { updateTopicStatuses } from "./topicStatusUtils";

/**
 * Get information about the current level
 */
export async function getCurrentLevelInfo(levelId: string) {
	const { data: currentLevel, error } = await supabase
		.from("levels")
		.select("order_number, course_id")
		.eq("id", levelId)
		.single();

	if (error || !currentLevel) {
		console.error("Error fetching level info:", error);
		return null;
	}

	return currentLevel;
}

/**
 * Find the next level in sequence
 */
export async function getNextLevel(courseId: string, currentOrderNumber: number) {
	const { data: nextLevel, error } = await supabase
		.from("levels")
		.select("id")
		.eq("course_id", courseId)
		.gt("order_number", currentOrderNumber)
		.order("order_number")
		.limit(1)
		.maybeSingle();

	if (error) {
		console.error("Error fetching next level:", error);
		return null;
	}

	return nextLevel || null;
}

/**
 * Get the level ID associated with a test
 */
export async function getTestLevelId(testId: string): Promise<string | null> {
	const { data: testData, error } = await supabase
		.from("tests")
		.select("level_id")
		.eq("id", testId)
		.single();

	if (error || !testData?.level_id) {
		console.error("Error fetching test level ID:", error);
		return null;
	}

	return testData.level_id;
}

/**
 * Update user progress for the next level
 */
export async function updateProgressForNextLevel(
	userId: string,
	nextLevelId: string,
	courseId: string
) {
	if (!userId) {
		console.error("No user ID found for progress update");
		return;
	}

	// Get all topics in the next level
	const { data: nextLevelTopics, error } = await supabase
		.from("topics")
		.select("id")
		.eq("level_id", nextLevelId)
		.order("order_number");

	if (error || !nextLevelTopics || nextLevelTopics.length === 0) {
		console.error("Error fetching next level topics:", error);
		return;
	}

	const firstTopicId = nextLevelTopics[0].id;

	// Update the user's progress
	await updateUserProgress(userId, courseId, firstTopicId, nextLevelId);

	// Update topic statuses
	await updateTopicStatuses(userId, courseId, nextLevelId, nextLevelTopics);
}

/**
 * Mark course as completed when there are no more levels
 */
export async function markCourseAsCompleted(userId: string, courseId: string) {
	if (!userId) {
		console.error("No user ID found for marking course as completed");
		return;
	}

	const { error } = await supabase
		.from("user_progress")
		.update({
			current_topic_id: null,
			status: "COMPLETED",
		})
		.eq("user_id", userId)
		.eq("course_id", courseId);

	if (error) {
		console.error("Error marking course as completed:", error);
	} else {
		console.log("Course completed!");
	}
}
