import { toast } from "sonner";
import { getFirstTopicId } from "@/utils/courses/courseNavigation";
import { updateUserProgressForInitialTest } from "./userProgressUtils";

/**
 * Handles post-test actions depending on test type
 */
export async function handleTestTypeSpecificActions(
	testId: string,
	courseId: string,
	userId: string,
	isPassed: boolean,
	skipped: boolean,
	testData: { test_type: string; level_id: string | null }
): Promise<boolean> {
	const isInitialTest = testData.test_type === "initial";
	const isLevelTest = testData.test_type === "level";

	console.log(
		"handleTestTypeSpecificActions - test type:",
		testData.test_type,
		"isPassed:",
		isPassed
	);

	// For initial tests, set the first topic as current
	if (isInitialTest) {
		// Fetch the first topic ID for the course
		const firstTopicId = await getFirstTopicId(courseId);

		if (!firstTopicId) {
			console.error("Failed to get first topic ID for course:", courseId);
			toast.error("Error saving progress: Could not find starting topic");
			return false;
		}

		console.log("Initial test: Setting current_topic_id to first topic:", firstTopicId);

		// Update user progress for initial test - CRITICAL FIX: Ensure current_topic_id is NEVER NULL
		const progressUpdated = await updateUserProgressForInitialTest(
			userId,
			courseId,
			firstTopicId
		);

		if (!progressUpdated) {
			return false;
		}
	}

	if (isLevelTest) {
		console.log("Level test completed. Test ID:", testId, "Passed:", isPassed);
		// Level test specific logic is now in handleLevelTestResult function
	}

	return true;
}
