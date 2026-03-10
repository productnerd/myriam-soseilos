import { createOrUpdateUserTestScore } from "./scoreUtils";

/**
 * TODO:Create a new user test score record
 * This is a wrapper around the database insert operation
 * ALWAYS CREATES A NEW RECORD, NEVER UPDATES EXISTING ONES
 * @deprecated Use createOrUpdateUserTestScore instead
 */
export async function createUserTestScore(
	testId: string,
	userId: string,
	scorePercentage: number | null,
	isPassed: boolean | null,
	skipped: boolean
): Promise<boolean> {
	try {
		console.log("Creating new user_test_score:", {
			testId,
			userId,
			scorePercentage,
			isPassed,
			skipped,
		});

		// Forward to the new function that can handle both creating and updating
		return await createOrUpdateUserTestScore(
			testId,
			userId,
			scorePercentage,
			isPassed,
			skipped
		);
	} catch (error) {
		console.error("Error creating user test score:", error);
		return false;
	}
}
