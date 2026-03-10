import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Handle the result of a level test - unlocking the next level and achievements
 * @param userId The ID of the user
 * @param testId The ID of the completed test
 * @param levelId The level ID of the test
 * @param passed Whether the test was passed
 * @returns Promise<boolean> Whether the handling was successful
 */
export async function handleLevelTestResult(
	userId: string,
	testId: string,
	levelId: string,
	passed: boolean
): Promise<boolean> {
	try {
		console.debug(`Handling level test result for test ID ${testId}, passed: ${passed}`);

		if (!levelId) {
			// Get the level ID associated with the test
			const { data: testData, error: testError } = await supabase
				.from("tests")
				.select("level_id")
				.eq("id", testId)
				.maybeSingle();

			if (testError) {
				console.error("Failed to get test data:", testError);
				// Don't show error toast here - just log it and continue
			} else if (testData?.level_id) {
				// We found the level ID - set it
				levelId = testData.level_id;
				console.debug("Found level ID from test:", levelId);
			} else {
				console.warn("[WARN] No level_id found for test:", testId);
				// This might be a standalone test without a level - handle it gracefully
			}
		}

		// If we still don't have a level ID, we can't complete level progression
		if (!levelId) {
			console.warn(
				"[WARN] Cannot complete level progression - no level ID found for test:",
				testId
			);
			// Return true because we've done all we can - the test result is still saved
			return true;
		}

		// If the test wasn't passed, we're done here
		if (!passed) {
			console.debug("Test not passed, not unlocking next level");
			return true;
		}

		// If the test was passed, unlock the next level

		// First, get the current level number
		const { data: levelData, error: levelError } = await supabase
			.from("levels")
			.select("order_number, course_id")
			.eq("id", levelId)
			.maybeSingle();

		if (levelError) {
			console.error("Failed to get level data:", levelError);
			return false;
		}

		if (!levelData) {
			console.error("Level not found:", levelId);
			return false;
		}

		const level_number = levelData.order_number;
		const course_id = levelData.course_id;

		console.debug("Current level:", level_number, "Next level:", level_number + 1);

		// Find the next level
		const { data: nextLevelData, error: nextLevelError } = await supabase
			.from("levels")
			.select("id")
			.eq("course_id", course_id)
			.eq("order_number", level_number + 1)
			.maybeSingle();

		if (nextLevelError) {
			console.error("Failed to get next level data:", nextLevelError);
			return false;
		}

		if (!nextLevelData) {
			console.debug("No next level found - this might be the last level");
			toast.success("Congratulations! You completed the final level of this course.");
			return true;
		}

		const nextLevelId = nextLevelData.id;

		// Check if user already has access to the next level in user_topic_progress
		// We'll use topics table instead of user_topic_progress which isn't in the types
		const { data: nextLevelTopics, error: topicsError } = await supabase
			.from("topics")
			.select("id")
			.eq("level_id", nextLevelId)
			.order("order_number")
			.limit(1);

		if (topicsError) {
			console.error("Failed to get topics for next level:", topicsError);
			return false;
		}

		if (!nextLevelTopics || nextLevelTopics.length === 0) {
			console.error("No topics found for next level:", nextLevelId);
			return false;
		}

		const firstTopicId = nextLevelTopics[0].id;

		// Check if the user already has access to the first topic of the next level
		// Let's use user_progress table which should be in the types
		const { data: userProgress, error: progressError } = await supabase
			.from("user_progress")
			.select("*")
			.eq("user_id", userId)
			.eq("course_id", course_id)
			.maybeSingle();

		if (progressError) {
			console.error("Failed to check existing level access:", progressError);
			return false;
		}

		// If they already have access to the next level, we're done
		if (userProgress?.current_level_id === nextLevelId) {
			console.debug("User already has access to the next level");
			return true;
		}

		// Get all topics for the next level
		const { data: allNextLevelTopics, error: allTopicsError } = await supabase
			.from("topics")
			.select("id")
			.eq("level_id", nextLevelId)
			.order("order_number");

		if (allTopicsError || !allNextLevelTopics) {
			console.error("Failed to get all topics for next level:", allTopicsError);
			return false;
		}

		// Update the user_progress to point to the first topic of the next level
		const { error: updateProgressError } = await supabase
			.from("user_progress")
			.update({
				current_level_id: nextLevelId,
				current_topic_id: firstTopicId,
			})
			.eq("user_id", userId)
			.eq("course_id", course_id);

		if (updateProgressError) {
			console.error("Failed to update user progress:", updateProgressError);
			return false;
		}

		console.log("Unlocked next level for user");
		toast.success("Next level unlocked!", {
			description: "You now have access to the next level.",
			duration: 5000,
		});

		return true;
	} catch (err) {
		console.error("Exception in handleLevelTestResult:", err);
		return false;
	}
}
