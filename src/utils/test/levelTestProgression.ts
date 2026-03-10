import { supabase } from "@/integrations/supabase/client";
import { getNextLevelFirstTopic } from "@/utils/level/levelTestUtils";
import { toast } from "sonner";

/**
 * This function handles the automatic progression after successfully passing a level test.
 * It updates the user's progress to the next level's first topic.
 * If there's no next level, it marks the course as completed.
 */
export async function handleLevelTestProgression(
	userId: string,
	testId: string,
	score: number,
	passed: boolean
): Promise<void> {
	if (!passed || score < 80) {
		console.log("Level test not passed, no progression needed");
		return;
	}

	try {
		// Get the test info for level progression
		const { data: testData, error: testError } = await supabase
			.from("tests")
			.select("level_id, course_id")
			.eq("id", testId)
			.single();

		if (testError || !testData) {
			console.error("Error fetching test info:", testError);
			return;
		}

		// Validate that this level test has the required fields (level tests should have both 'level_id' and 'course_id')
		if (!testData.course_id) {
			console.error("Level test missing course_id - this should not happen");
			return;
		}

		if (!testData.level_id) {
			console.error("Level test missing level_id - this should not happen");
			return;
		}

		console.log("Processing level test progression for level:", testData.level_id);

		// Get first topic of next level
		const nextLevelInfo = await getNextLevelFirstTopic(testData.level_id);

		if (nextLevelInfo) {
			// Update user progress to next level's first topic
			const { error: progressError } = await supabase
				.from("user_progress")
				.update({
					current_level_id: nextLevelInfo.levelId,
					current_topic_id: nextLevelInfo.topicId,
					current_activity_id: null,
					updated_at: new Date().toISOString(),
				})
				.eq("user_id", userId)
				.eq("course_id", testData.course_id);

			if (progressError) {
				console.error("Error updating progress:", progressError);
				toast.error("Error updating progress to next level");
				return;
			}

			console.log("Successfully progressed to next level:", nextLevelInfo.levelId);
			toast.success("🎉 Level completed! Welcome to the next level!");

			// TODO: This is not good practice - considering lifting state up or using context to share 'levelId' globally
			// Dispatch custom event to trigger UI updates
			window.dispatchEvent(
				new CustomEvent("level-unlocked", {
					detail: { levelId: nextLevelInfo.levelId },
				})
			);
		} else {
			// No next level - course completed
			const { error: courseCompleteError } = await supabase
				.from("user_progress")
				.update({
					status: "COMPLETED",
					current_topic_id: null,
					current_activity_id: null,
					updated_at: new Date().toISOString(),
				})
				.eq("user_id", userId)
				.eq("course_id", testData.course_id);

			if (courseCompleteError) {
				console.error("Error marking course as completed:", courseCompleteError);
				toast.error("Error completing course");
				return;
			}

			console.log("Course completed!");
			toast.success("🏆 Congratulations! You've completed the entire course!");
		}
	} catch (error) {
		console.error("Error in level test progression:", error);
		toast.error("Error processing level completion");
	}
}
