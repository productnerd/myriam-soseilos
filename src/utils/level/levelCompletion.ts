import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getLevelTest } from "@/utils/level/levelTestUtils";

/**
 * Set up for level test when all topics are completed
 */
export async function setupForLevelTest(
	userId: string,
	levelId: string,
	courseId: string
): Promise<void> {
	console.log("All topics in level completed, setting up for level test");
	const timestamp = new Date().toISOString();

	// When all topics are completed, set current_topic_id to null
	// This indicates level completion and should trigger showing the level test
	await supabase.from("user_progress").upsert(
		{
			user_id: userId,
			course_id: courseId,
			current_topic_id: null,
			current_level_id: levelId,
			status: "INPROGRESS",
			updated_at: timestamp,
		},
		{
			onConflict: "user_id,course_id",
			ignoreDuplicates: false,
		}
	);

	// Get the level test for this level to highlight it in the UI
	const levelTest = await getLevelTest(levelId);

	if (levelTest) {
		console.log("Level test found:", levelTest.id);
		// Save the level test ID to localStorage so the UI can show it
		localStorage.setItem("pendingLevelTest", levelTest.id);
		localStorage.setItem("pendingLevelId", levelId);
	}

	toast.success("Level completed! Take the level test to proceed to the next level.");
}
