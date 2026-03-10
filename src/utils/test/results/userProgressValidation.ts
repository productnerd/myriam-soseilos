import { supabase } from "@/integrations/supabase/client";
import { getFirstTopicId } from "@/utils/courses/courseNavigation";

/**
 * Validate that the user's progress is consistent and correct
 */
export async function validateUserProgress(userId: string, courseId: string): Promise<boolean> {
	try {
		// Check if user_progress record exists
		const { data: progress, error: progressError } = await supabase
			.from("user_progress")
			.select("*")
			.eq("user_id", userId)
			.eq("course_id", courseId)
			.maybeSingle();

		if (progressError) {
			console.error("Error checking user progress:", progressError);
			return false;
		}

		// If no progress record, return false to trigger repair
		if (!progress) {
			console.log("No user_progress record found");
			return false;
		}

		// Verify current_topic_id is set for INPROGRESS courses
		if (progress.status === "INPROGRESS" && !progress.current_topic_id) {
			console.log("current_topic_id is NULL for INPROGRESS course");
			return false;
		}

		// Verify current_topic_id is null for COMPLETED courses
		if (progress.status === "COMPLETED" && progress.current_topic_id) {
			console.log("current_topic_id should be NULL for COMPLETED course");
			return false;
		}

		// If current_topic_id is set, verify it exists and belongs to this course
		if (progress.current_topic_id) {
			const { data: topic, error: topicError } = await supabase
				.from("topics")
				.select("level_id")
				.eq("id", progress.current_topic_id)
				.maybeSingle();

			if (topicError || !topic) {
				console.log("Invalid current_topic_id, topic does not exist");
				return false;
			}

			// Check if the level belongs to this course
			const { data: level, error: levelError } = await supabase
				.from("levels")
				.select("course_id")
				.eq("id", topic.level_id)
				.maybeSingle();

			if (levelError || !level || level.course_id !== courseId) {
				console.log("current_topic_id is for a topic in a different course");
				return false;
			}
		}

		return true;
	} catch (error) {
		console.error("Error in validateUserProgress:", error);
		return false;
	}
}

/**
 * Fix inconsistent user progress
 */
export async function fixUserProgress(userId: string, courseId: string): Promise<boolean> {
	try {
		// First, get all topics for this course
		const { data: allTopics } = await supabase
			.from("topics")
			.select("id")
			.eq("course_id", courseId);

		if (!allTopics || allTopics.length === 0) {
			console.error("No topics found for course:", courseId);
			return false;
		}

		// Get all completed topics for this course
		const { data: completedTopics } = await supabase
			.from("user_completed_topics")
			.select("topic_id")
			.eq("user_id", userId)
			.eq("course_id", courseId);

		// Check if all topics in the course are completed
		const completedTopicIds = new Set(completedTopics?.map((t) => t.topic_id) || []);
		const allTopicsCompleted = allTopics.every((topic) => completedTopicIds.has(topic.id));

		// If all topics are completed, set status to COMPLETED and current_topic_id to null
		if (allTopicsCompleted) {
			console.log("All topics completed, marking course as COMPLETED");
			const { error: progressError } = await supabase.from("user_progress").upsert(
				{
					user_id: userId,
					course_id: courseId,
					status: "COMPLETED",
					current_topic_id: null,
					current_level_id: null,
					current_activity_id: null,
					updated_at: new Date().toISOString(),
				},
				{
					onConflict: "user_id,course_id",
					ignoreDuplicates: false,
				}
			);

			if (progressError) {
				console.error("Error marking course as completed:", progressError);
				return false;
			}

			console.log("Successfully marked course as completed");
			return true;
		}

		// Check if there's a level where all topics are completed but level test is failed
		// This would indicate the user needs to retake the level test
		const { data: levels } = await supabase
			.from("levels")
			.select("id, order_number")
			.eq("course_id", courseId)
			.order("order_number");

		if (levels) {
			for (const level of levels) {
				// Get all topics in this level
				const { data: levelTopics } = await supabase
					.from("topics")
					.select("id")
					.eq("level_id", level.id);

				if (levelTopics && levelTopics.length > 0) {
					// Check if all topics in this level are completed
					const allLevelTopicsCompleted = levelTopics.every((topic) =>
						completedTopicIds.has(topic.id)
					);

					if (allLevelTopicsCompleted) {
						// Check if there's a level test for this level
						const { data: levelTest } = await supabase
							.from("tests")
							.select("id")
							.eq("level_id", level.id)
							.eq("test_type", "level")
							.maybeSingle();

						if (levelTest) {
							// Check if the user has passed this level test
							const { data: testScore } = await supabase
								.from("user_test_scores")
								.select("score, passed")
								.eq("user_id", userId)
								.eq("test_id", levelTest.id)
								.order("completed_at", { ascending: false })
								.limit(1)
								.maybeSingle();

							// If test is failed or not taken, set current_topic_id to null but keep current_level_id
							const testPassed =
								testScore &&
								(testScore.passed === true ||
									(testScore.score !== null && testScore.score >= 80));

							if (!testPassed) {
								console.log(
									`Level ${level.order_number} topics completed but test failed, setting current_topic_id to null`
								);
								const { error: progressError } = await supabase
									.from("user_progress")
									.upsert(
										{
											user_id: userId,
											course_id: courseId,
											status: "INPROGRESS",
											current_topic_id: null,
											current_level_id: level.id,
											current_activity_id: null,
											updated_at: new Date().toISOString(),
										},
										{
											onConflict: "user_id,course_id",
											ignoreDuplicates: false,
										}
									);

								if (progressError) {
									console.error(
										"Error updating user progress for failed level test:",
										progressError
									);
									return false;
								}

								console.log(
									"Successfully set current_topic_id to null for failed level test"
								);
								return true;
							}
						}
					}
				}
			}
		}

		// If not all topics are completed and no level test issues found, proceed with normal repair
		const firstTopicId = await getFirstTopicId(courseId);

		if (!firstTopicId) {
			console.error("Could not get first topic ID for repair");
			return false;
		}

		// Get the level ID for this topic
		const { data: topicData, error: topicError } = await supabase
			.from("topics")
			.select("level_id")
			.eq("id", firstTopicId)
			.single();

		if (topicError) {
			console.error("Error getting level ID for repair:", topicError);
			return false;
		}

		// Upsert the user_progress record
		const { error: progressError } = await supabase.from("user_progress").upsert(
			{
				user_id: userId,
				course_id: courseId,
				status: "INPROGRESS",
				current_topic_id: firstTopicId,
				current_level_id: topicData.level_id,
				current_activity_id: null,
				updated_at: new Date().toISOString(),
			},
			{
				onConflict: "user_id,course_id",
				ignoreDuplicates: false,
			}
		);

		if (progressError) {
			console.error("Error repairing user progress:", progressError);
			return false;
		}

		console.log("Successfully repaired user progress");
		return true;
	} catch (error) {
		console.error("Error in repairUserProgress:", error);
		return false;
	}
}
