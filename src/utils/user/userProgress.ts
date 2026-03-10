// TODO: None of the functions in this file are used anywhere

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateTopicBelongsToCourse } from "@/utils/topic/topicValidation";

export interface UserProgressData {
	currentTopicId: string | null;
	currentActivityId: string | null;
}

// Cache validation results to avoid repeated database calls
const validationCache = new Map<string, boolean>();

/**
 * Fetches the user's current learning progress data for the specified course
 * @param courseId - Course ID to filter progress by specific course
 * @param userId - The user ID
 */
export async function fetchUserProgress(
	courseId: string,
	userId: string
): Promise<UserProgressData> {
	try {
		const progressData = await fetchInProgressRecord(userId, courseId);

		if (!progressData) {
			return { currentTopicId: null, currentActivityId: null };
		}

		// Check cache before validating topic
		const validationCacheKey = `${progressData.current_topic_id}-${progressData.course_id}`;
		let isTopicValid = validationCache.get(validationCacheKey);

		if (isTopicValid === undefined) {
			// Validate the topic belongs to the course
			isTopicValid = await validateTopicBelongsToCourse(
				// Since we have a null check for 'current_topic_id' in `fetchInProgressRecord()`, we can safely unwrap it (non-null assertion)
				progressData.current_topic_id!,
				progressData.course_id
			);

			// Cache the validation result
			validationCache.set(validationCacheKey, isTopicValid);
		}

		if (!isTopicValid) {
			// Fix the invalid reference
			await resetInvalidTopicReference(progressData.id);
			return { currentTopicId: null, currentActivityId: null };
		}

		// Log for debugging
		console.log("Found valid user progress:", progressData);

		return {
			currentTopicId: progressData.current_topic_id,
			currentActivityId: progressData.current_activity_id,
		};
	} catch (error) {
		console.error("Error in progress fetching:", error);
		return { currentTopicId: null, currentActivityId: null };
	}
}

/**
 * Fetches the user's most recent in-progress record for a specific course
 * @param userId - The user ID
 * @param courseId - Course ID to filter by specific course
 */
async function fetchInProgressRecord(userId: string, courseId: string) {
	const { data: userProgress, error: progressError } = await supabase
		.from("user_progress")
		.select("id, course_id, current_topic_id, current_activity_id")
		.eq("user_id", userId)
		.eq("status", "INPROGRESS")
		.eq("course_id", courseId)
		.order("updated_at", { ascending: false })
		.limit(1);

	if (progressError) {
		console.error("Error fetching user progress:", progressError);
		throw progressError;
	}

	if (!userProgress || userProgress.length === 0 || !userProgress[0]?.current_topic_id) {
		console.log("No current topic found for this user in course", courseId);
		return null;
	}

	return userProgress[0];
}

/**
 * Resets an invalid topic reference in the user progress
 */
async function resetInvalidTopicReference(progressId: string): Promise<void> {
	try {
		console.error("Topic does not belong to the assigned course, resetting progress");

		// Fix the invalid reference by setting current_topic_id to null
		const { error } = await supabase
			.from("user_progress")
			.update({ current_topic_id: null })
			.eq("id", progressId);

		if (error) {
			console.error("Error resetting topic reference:", error);
			toast.error("Error updating progress data");
		}
	} catch (error) {
		console.error("Error resetting invalid topic reference:", error);
	}
}
