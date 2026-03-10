import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getTopicsForLevel } from "@/utils/topic/topicData";

/**
 * Hook for checking if a user has completed a course
 *
 * @param courseId - The ID of the course
 * @param userId - The ID of the user
 * @returns Whether the course is completed
 */
export function useCourseCompletion(courseId: string, userId: string) {
	return useQuery({
		queryKey: ["courseCompletion", courseId, userId],
		queryFn: async () => {
			console.log(`[useCourseCompletion] Checking completion for course: ${courseId}`);

			// Get all levels in the course
			const { data: levels, error: levelsError } = await supabase
				.from("levels")
				.select("id, order_number")
				.eq("course_id", courseId)
				.order("order_number");

			if (levelsError || !levels || levels.length === 0) {
				console.error("[useCourseCompletion] Error fetching levels:", levelsError);
				return false;
			}

			console.log(
				`[useCourseCompletion] Found ${levels.length} levels for course ${courseId}`,
				levels
			);

			// For each level, check if all topics are completed AND level test is passed
			for (const level of levels) {
				console.log(
					`[useCourseCompletion] Checking completion status for level ${level.order_number}`
				);

				// Check if all topics in this level are completed
				const topics = await getTopicsForLevel(level.id);

				// TODO: Is this error handling needed? Are we not handling errors in the `getTopicsForLevel`?
				if (!topics || topics.length === 0) {
					console.error(
						"[useCourseCompletion] Error fetching topics for level:",
						level.id
					);
					return false;
				}

				console.log(
					`[useCourseCompletion] Level ${level.order_number} has ${topics.length} topics`,
					topics
				);

				// Get completed topics for this level
				const { data: completedTopics, error: completedError } = await supabase
					.from("user_completed_topics")
					.select("topic_id")
					.eq("user_id", userId)
					.eq("level_id", level.id);

				if (completedError) {
					console.error(
						"[useCourseCompletion] Error fetching completed topics:",
						completedError
					);
					return false;
				}

				console.log(
					`[useCourseCompletion] Level ${level.order_number} topics completed: ${
						completedTopics?.length || 0
					}`
				);

				const allTopicsCompleted = completedTopics?.length === topics.length;
				if (!allTopicsCompleted) {
					console.log(
						`[useCourseCompletion] Level ${level.order_number} topics not all completed`
					);
					return false;
				}

				console.log(
					`[useCourseCompletion] Checking if test exists for level ${level.order_number}`
				);
				// If all topics for that level are comlpeted, proceed to check if level test exists and is passed
				const { data: levelTest, error: testError } = await supabase
					.from("tests")
					.select("id")
					.eq("level_id", level.id)
					.eq("test_type", "level")
					.maybeSingle();

				if (testError) {
					console.error("[useCourseCompletion] Error fetching level test:", testError);
					return false;
				}

				if (levelTest) {
					console.log(
						`[useCourseCompletion] Level ${level.order_number} has test ${levelTest.id}`
					);

					console.log(
						`[useCourseCompletion] Checking if user has passed level ${level.order_number} test`
					);
					// Check if user has passed this level test
					const { data: testScore, error: scoreError } = await supabase
						.from("user_test_scores")
						.select("score, passed")
						.eq("user_id", userId)
						.eq("test_id", levelTest.id)
						.order("completed_at", { ascending: false })
						.limit(1)
						.maybeSingle();

					if (scoreError) {
						console.error(
							"[useCourseCompletion] Error fetching test score:",
							scoreError
						);
						return false;
					}

					const testPassed =
						testScore &&
						(testScore.passed === true ||
							(testScore.score !== null && testScore.score >= 80));
					console.log(`[useCourseCompletion] Level ${level.order_number} test status:`, {
						hasScore: !!testScore,
						score: testScore?.score,
						passed: testScore?.passed,
						testPassed,
					});

					if (!testPassed) {
						console.log(
							`[useCourseCompletion] Level ${level.order_number} test not passed`
						);
						return false;
					}
				} else {
					console.log(
						`[useCourseCompletion] Level ${level.order_number} has no test, considering it passed`
					);
				}
			}

			console.log("[useCourseCompletion] All levels completed - course is complete!");
			return true;
		},
		enabled: !!userId, // Only run when userId is authenticated
		refetchOnWindowFocus: true,
		staleTime: 1000, // Very short stale time to ensure fresh data
		refetchInterval: 30000, // Refetch every 30 seconds instead of 5 seconds
	});
}
