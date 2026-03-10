import { supabase } from "@/integrations/supabase/client";
import { createUserTestScore } from "./userTestScoreStorage";
import { createOrUpdateTestScore } from "./testScoreStorage";
import {
	calculateScorePercentage as calcScorePercentage,
	determinePassed as determineIfPassed,
} from "./scoreCalculation";

/**
 * Re-export calculation functions from scoreCalculation.ts
 */
export const calculateScorePercentage = calcScorePercentage;
export const determinePassed = determineIfPassed;

/**
 * Save user test scores
 */
export async function saveUserTestScores(
	testId: string,
	userId: string,
	score: number,
	scorePercentage: number | null,
	isPassed: boolean | null,
	skipped: boolean
): Promise<boolean> {
	try {
		console.debug("Saving user test scores with:", {
			testId,
			userId,
			score,
			scorePercentage,
			isPassed,
			skipped,
		});

		// First, create or update a record in test_scores table
		const testScoreSuccess = await createOrUpdateTestScore(
			testId,
			userId,
			scorePercentage,
			isPassed
		);

		if (!testScoreSuccess) {
			console.error("Failed to save test score");
			return false;
		}

		// Then create or update a user_test_score record
		const userTestScoreSuccess = await createOrUpdateUserTestScore(
			testId,
			userId,
			scorePercentage,
			isPassed,
			skipped
		);

		if (!userTestScoreSuccess) {
			console.error("Failed to save user test score");
			return false;
		}

		console.log("Successfully saved both test_score and user_test_score");
		return true;
	} catch (error) {
		console.error("Error in saveUserTestScores:", error);
		return false;
	}
}

/**
 * Create or update a user test score record
 * This function checks if a record exists first and updates it if it does,
 * otherwise creates a new record
 */
export async function createOrUpdateUserTestScore(
	testId: string,
	userId: string,
	scorePercentage: number | null,
	isPassed: boolean | null,
	skipped: boolean
): Promise<boolean> {
	try {
		console.log("Creating or updating user_test_score for:", { testId, userId });

		// If test is skipped, don't create a record
		if (skipped) {
			console.debug("Test was skipped, not creating user_test_score record");
			return true;
		}

		// Get test_type from tests table
		const { data: testInfo, error: testInfoError } = await supabase
			.from("tests")
			.select("test_type")
			.eq("id", testId)
			.maybeSingle();

		if (testInfoError) {
			console.error("Error getting test type:", testInfoError);
			return false;
		}

		const testType = testInfo?.test_type || "normal";
		const isLevelTest = testType === "level";

		// Always store score as 0-100 percentage, and ensure it's never NULL
		const finalScore =
			scorePercentage === null ? 0 : Math.max(0, Math.min(100, scorePercentage));

		// Check if record exists
		const { data: existingRecord, error: findError } = await supabase
			.from("user_test_scores")
			.select("id")
			.eq("test_id", testId)
			.eq("user_id", userId)
			.maybeSingle();

		if (findError) {
			console.error("Error checking for existing test score:", findError);
			return false;
		}

		let result;

		if (existingRecord) {
			// Update existing record
			console.debug("Found existing user_test_score record, updating it:", existingRecord);

			// Determine the passed status
			let passedStatus: boolean;
			if (isPassed !== null) {
				// Use the explicitly provided passed status
				passedStatus = isPassed;
			} else {
				// Use score-based calculation with appropriate threshold
				const threshold = isLevelTest ? 80 : 70;
				passedStatus = finalScore >= threshold;
			}

			const { data, error } = await supabase
				.from("user_test_scores")
				.update({
					score: finalScore,
					passed: passedStatus,
					completed_at: new Date().toISOString(),
					test_type: testType,
				})
				.eq("id", existingRecord.id)
				.select();

			result = { data, error };
		} else {
			// Create new record
			console.debug("No existing user_test_score record, creating new one");

			// Determine the passed status
			let passedStatus: boolean;
			if (isPassed !== null) {
				// Use the explicitly provided passed status
				passedStatus = isPassed;
			} else {
				// Use score-based calculation with appropriate threshold
				const threshold = isLevelTest ? 80 : 70;
				passedStatus = finalScore >= threshold;
			}

			const { data, error } = await supabase
				.from("user_test_scores")
				.insert({
					test_id: testId,
					user_id: userId,
					score: finalScore, // Never null, capped at 100
					passed: passedStatus,
					completed_at: new Date().toISOString(),
					test_type: testType,
				})
				.select();

			result = { data, error };
		}

		if (result.error) {
			console.error("Error saving user test score:", result.error);
			return false;
		}

		console.debug("Successfully saved user test score:", result.data);

		// Verify the operation was successful
		const { data: verifyData, error: verifyError } = await supabase
			.from("user_test_scores")
			.select("*")
			.eq("user_id", userId)
			.eq("test_id", testId)
			.order("completed_at", { ascending: false })
			.limit(1);

		if (verifyError || !verifyData || verifyData.length === 0) {
			console.error(
				"Failed to verify user test score saving:",
				verifyError || "No record found"
			);
			return false;
		}

		console.log("[VERIFICATION] Recent user test score record:", verifyData[0]);
		return true;
	} catch (error) {
		console.error("Error creating/updating user test score:", error);
		return false;
	}
}
