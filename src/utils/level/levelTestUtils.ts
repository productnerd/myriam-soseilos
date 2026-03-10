import { supabase } from "@/integrations/supabase/client";

/**
 * Check if all topics in a level are completed by a user
 */
export async function areAllTopicsCompletedInLevel(
	userId: string,
	levelId: string
): Promise<boolean> {
	try {
		// Get all topics in the level
		const { data: topics, error: topicsError } = await supabase
			.from("topics")
			.select("id")
			.eq("level_id", levelId);

		if (topicsError || !topics) {
			console.error("Error fetching topics:", topicsError);
			return false;
		}

		// Get completed topics for this user in this level
		const { data: completedTopics, error: completedError } = await supabase
			.from("user_completed_topics")
			.select("topic_id")
			.eq("user_id", userId)
			.eq("level_id", levelId);

		if (completedError) {
			console.error("Error fetching completed topics:", completedError);
			return false;
		}

		// Check if all topics are completed
		const completedTopicIds = new Set(completedTopics?.map((ct) => ct.topic_id) || []);
		return topics.every((topic) => completedTopicIds.has(topic.id));
	} catch (error) {
		console.error("Error checking topic completion:", error);
		return false;
	}
}

/**
 * Get the level test for a specific level
 */
export async function getLevelTest(levelId: string): Promise<{ id: string; title: string } | null> {
	try {
		const { data: testData, error: testError } = await supabase
			.from("tests")
			.select("id, title")
			.eq("level_id", levelId)
			.eq("test_type", "level")
			.maybeSingle();

		if (testError) {
			console.error("Error fetching level test:", testError);
			return null;
		}

		return testData;
	} catch (error) {
		console.error("Error in getLevelTestInfo:", error);
		return null;
	}
}

/**
 * Check if a user has passed a level test (score >= 80%)
 */
export async function hasPassedLevelTest(userId: string, testId: string): Promise<boolean> {
	try {
		const { data: scores, error } = await supabase
			.from("user_test_scores")
			.select("score, passed")
			.eq("user_id", userId)
			.eq("test_id", testId)
			.order("completed_at", { ascending: false });

		if (error) {
			console.error("Error fetching test scores:", error);
			return false;
		}

		if (!scores || scores.length === 0) {
			console.log(`No test scores found for test ${testId}`);
			return false;
		}

		const latestScore = scores[0];
		console.log(`hasPassedLevelTest: Latest score for test ${testId}:`, {
			score: latestScore.score,
			passed: latestScore.passed,
			userId,
		});

		// For level tests, we should only consider it passed if:
		// 1. passed field is explicitly true, OR
		// 2. score is >= 80 (but passed field is not explicitly false)
		const isPassed =
			latestScore.passed === true ||
			(latestScore.score !== null && latestScore.score >= 80 && latestScore.passed !== false);

		console.log(`hasPassedLevelTest: Result for test ${testId}:`, isPassed);
		return isPassed;
	} catch (error) {
		console.error("Error checking test score:", error);
		return false;
	}
}

/**
 * Get the next level's first topic for automatic progression
 */
export async function getNextLevelFirstTopic(
	currentLevelId: string
): Promise<{ topicId: string; levelId: string } | null> {
	try {
		// Get current level info
		const { data: currentLevel, error: currentLevelError } = await supabase
			.from("levels")
			.select("course_id, order_number")
			.eq("id", currentLevelId)
			.single();

		if (currentLevelError || !currentLevel) {
			console.error("Error fetching current level:", currentLevelError);
			return null;
		}

		// Get next level
		const { data: nextLevel, error: nextLevelError } = await supabase
			.from("levels")
			.select("id")
			.eq("course_id", currentLevel.course_id)
			.eq("order_number", currentLevel.order_number + 1)
			.maybeSingle();

		// If no next level is found, the course is completed
		if (nextLevelError || !nextLevel) {
			console.log("No next level found - course completed");
			return null;
		}

		// Get first topic of next level
		const { data: firstTopic, error: topicError } = await supabase
			.from("topics")
			.select("id")
			.eq("level_id", nextLevel.id)
			.order("order_number", { ascending: true })
			.limit(1)
			.maybeSingle();

		if (topicError || !firstTopic) {
			console.error("Error fetching first topic of next level:", topicError);
			return null;
		}

		return {
			topicId: firstTopic.id,
			levelId: nextLevel.id,
		};
	} catch (error) {
		console.error("Error getting next level first topic:", error);
		return null;
	}
}
