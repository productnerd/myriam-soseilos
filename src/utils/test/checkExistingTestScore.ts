import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the user has already completed the test
 * Returns true if user completed the test, false otherwise
 * This function is stricter about checking for a valid score to ensure tests are properly completed
 */
export async function checkExistingTestScore(testId: string, userId: string): Promise<boolean> {
	try {
		// Check 'user_test_scores' for this specific test with a valid score
		const { data, error } = await supabase
			.from("user_test_scores")
			.select("*")
			.eq("test_id", testId)
			.eq("user_id", userId)
			.not("score", "is", null)
			.not("passed", "is", null)
			.maybeSingle();

		if (error) {
			console.error("Error checking for existing test score:", error);
			return false;
		}

		// If found a score, test is completed
		if (data) {
			console.debug(`Found existing test score for test ${testId}`);
			return true;
		}

		// No evidence found that test is completed
		console.debug(`No valid test score found for test ${testId}`);
		return false;
	} catch (error) {
		console.error("Error checking for existing test score:", error);
		return false;
	}
}
