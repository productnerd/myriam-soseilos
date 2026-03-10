import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getFirstTopicId } from "@/utils/courses/courseNavigation";
import { getTopicById, getNextTopicInLevel } from "@/utils/topic/topicData";

/**
 * Hook for fetching initial test data for a course
 *
 * @param courseId - The ID of the course
 * @param userId - The ID of the authenticated user
 * @returns Initial test data
 */
export function useInitialTest(courseId: string | null, userId: string) {
	const queryResult = useQuery({
		queryKey: ["initialTest", courseId, userId],
		queryFn: async () => {
			if (!courseId) return null;

			console.log("[useInitialTest] Fetching initial test for course:", courseId);

			const { data, error } = await supabase
				.from("tests")
				.select("*")
				.eq("course_id", courseId)
				.eq("test_type", "initial")
				.limit(1);

			if (error) {
				console.error("[useInitialTest] Error fetching initial test:", error);
				throw error;
			}

			// If there's a test, verify the current_topic_id is set for this course
			if (data.length > 0) {
				await verifyCurrentTopicSet(courseId, userId);
			}

			console.log("[useInitialTest] Initial test found:", data);
			return data.length > 0 ? data[0] : null;
		},
		enabled: !!courseId && !!userId, // Only run when courseId is provided and the user is authenticated
		refetchOnWindowFocus: false,
	});

	return queryResult;
}

/**
 * Verify that the current_topic_id is set for this course, and if not, fix it
 */
async function verifyCurrentTopicSet(courseId: string, userId: string) {
	try {
		// Check course status and current_topic_id
		const { data: userProgress } = await supabase
			.from("user_progress")
			.select("current_topic_id, status, current_level_id, current_activity_id")
			.eq("course_id", courseId)
			.eq("user_id", userId)
			.maybeSingle();

		// If progress record exists but current_topic_id is NULL for INPROGRESS course, fix it
		if (
			userProgress &&
			userProgress.status === "INPROGRESS" &&
			!userProgress.current_topic_id
		) {
			console.log(
				"[useInitialTest] Found NULL current_topic_id for INPROGRESS course, fixing..."
			);

			// First check if there's an in_progress topic in completed topics list
			// This would be unlikely but we'll check it anyway
			const { data: completedTopics } = await supabase
				.from("user_completed_topics")
				.select("topic_id")
				.eq("user_id", userId)
				.eq("course_id", courseId)
				.limit(1)
				.maybeSingle();

			// If there's a completed topic, we'll look for the next one that's not completed
			let firstTopicId = null;

			if (completedTopics && completedTopics.topic_id) {
				// Get the topic's information (including level_id)
				const topicData = await getTopicById(completedTopics.topic_id);

				if (topicData) {
					// Get the next topic in the level that's not completed
					const nextTopic = await getNextTopicInLevel(completedTopics.topic_id);

					if (nextTopic) {
						firstTopicId = nextTopic.id;
					}
				}
			}

			// If we couldn't find a next topic, use the first topic of the course
			if (!firstTopicId) {
				firstTopicId = await getFirstTopicId(courseId);
			}

			if (firstTopicId) {
				console.log("[useInitialTest] Using topic as fallback:", firstTopicId);

				// Get topic information (including level_id)
				const topicData = await getTopicById(firstTopicId);

				if (topicData) {
					// Update user_progress with valid topic_id
					await supabase
						.from("user_progress")
						.update({
							current_topic_id: firstTopicId,
							current_level_id: topicData.level_id,
							updated_at: new Date().toISOString(),
						})
						.eq("user_id", userId)
						.eq("course_id", courseId);

					console.log("[useInitialTest] Fixed NULL current_topic_id");
				}
			}
		}

		// Also ensure current_activity_id is NULL if this is during initial test flow
		if (userProgress && userProgress.current_activity_id !== null) {
			// Check if there's an initial test for this course
			const { data: initialTest } = await supabase
				.from("tests")
				.select("id")
				.eq("course_id", courseId)
				.eq("test_type", "initial")
				.maybeSingle();

			if (initialTest) {
				// Check if user has completed the initial test
				const { data: testScore } = await supabase
					.from("user_test_scores")
					.select("id")
					.eq("test_id", initialTest.id)
					.eq("user_id", userId)
					.maybeSingle();

				// If no test score (test not completed), reset current_activity_id to NULL
				if (!testScore) {
					console.log(
						"[useInitialTest] CRITICAL: Initial test not completed but current_activity_id is set, resetting to NULL"
					);

					await supabase
						.from("user_progress")
						.update({
							current_activity_id: null,
							updated_at: new Date().toISOString(),
						})
						.eq("course_id", courseId)
						.eq("user_id", userId);
				}
			}
		}
	} catch (error) {
		console.error("[useInitialTest] Error verifying current_topic_id:", error);
	}
}

/**
 * Helper function to update the current_topic_id
 */
// TODO: This is not used anywhere
async function updateCurrentTopicId(userId: string, courseId: string, topicId: string) {
	const { error } = await supabase
		.from("user_progress")
		.update({
			current_topic_id: topicId,
			updated_at: new Date().toISOString(),
		})
		.eq("course_id", courseId)
		.eq("user_id", userId);

	if (error) {
		console.error("[useInitialTest] Error updating current_topic_id:", error);
	} else {
		console.log("[useInitialTest] Successfully updated current_topic_id to:", topicId);
	}
}
