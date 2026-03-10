import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
	checkExistingTransaction,
	logPointsTransaction,
	updateUserPoints,
} from "./transactionUtils";

/**
 * Calculates the dark and grey points to award for level completion based on score and level
 */
async function calculateLevelPoints(
	levelId: string,
	score: number
): Promise<{ greyPoints: number; darkPoints: number }> {
	try {
		// Get level order number for calculating points
		const { data: level, error: levelError } = await supabase
			.from("levels")
			.select("order_number")
			.eq("id", levelId)
			.single();

		if (levelError) {
			console.error("Error fetching level details:", levelError);
			return { greyPoints: 0, darkPoints: 0 };
		}

		const orderNumber = level.order_number || 1;

		// Calculate percentage (0-1) from score (0-100)
		const scorePercentage = score / 100;

		// New algorithm: grey points = round((31 - 2*levelOrder) * scorePercentage)
		const baseGreyPoints = 31 - 2 * orderNumber;
		const greyPoints = Math.round(baseGreyPoints * scorePercentage);

		// Calculate dark points: 0 for levels 1-4, 1 for levels 5+ and +1 bonus for 95%+ score (only for levels 5+)
		let darkPoints = 0;

		if (orderNumber >= 5) {
			darkPoints = 1; // Base dark point for level 5+

			// Bonus dark point for score of 95% or higher (only for levels 5+)
			if (score >= 95) {
				darkPoints += 1;
			}
		}

		return { greyPoints, darkPoints };
	} catch (error) {
		console.error("Error calculating level points:", error);
		return { greyPoints: 0, darkPoints: 0 };
	}
}

/**
 * Gets the test ID for a level
 */
async function getLevelTestId(levelId: string): Promise<string | null> {
	try {
		const { data: testData } = await supabase
			.from("tests")
			.select("id")
			.eq("level_id", levelId)
			.eq("test_type", "level")
			.single();

		if (!testData) {
			console.error("No test found for this level");
			return null;
		}

		return testData.id;
	} catch (error) {
		console.error("Error getting level test ID:", error);
		return null;
	}
}

/**
 * Gets the user's latest test score for a specific test
 */
async function getUserTestScore(
	userId: string,
	testId: string
): Promise<{ score: number; passed: boolean } | null> {
	try {
		const { data: scoreData } = await supabase
			.from("user_test_scores")
			.select("score, passed")
			.eq("user_id", userId)
			.eq("test_id", testId)
			.order("completed_at", { ascending: false })
			.limit(1)
			.single();

		if (!scoreData) {
			return null;
		}

		return scoreData;
	} catch (error) {
		console.error("Error getting user test score:", error);
		return null;
	}
}

/**
 * Assigns points to a user for passing a level test
 * @param userId User ID
 * @param levelId Level ID that was completed
 * @returns Promise<boolean> indicating success
 */
export async function assignLevelCompletionPoints(
	userId: string | undefined,
	levelId: string | undefined
): Promise<boolean> {
	if (!userId || !levelId) return false;

	try {
		// First check if this transaction already exists to prevent duplicates
		const transactionExists = await checkExistingTransaction(
			userId,
			"level_completion",
			levelId
		);

		if (transactionExists) {
			console.log(`Transaction for level ${levelId} already exists, skipping`);
			return true; // Already recorded this transaction
		}

		// Get the test ID for this level
		const testId = await getLevelTestId(levelId);
		if (!testId) {
			return false;
		}

		// Get the user's score
		const scoreData = await getUserTestScore(userId, testId);
		if (!scoreData || !scoreData.passed || !scoreData.score || scoreData.score < 80) {
			console.log("User did not pass the test or score is below 80, no points awarded");
			return false;
		}

		// Calculate points based on score and level
		const { greyPoints, darkPoints } = await calculateLevelPoints(levelId, scoreData.score);

		console.log(
			`Assigning ${greyPoints} grey points and ${darkPoints} dark points to user ${userId} for level ${levelId} (score: ${scoreData.score})`
		);

		// Update the user's points
		const updated = await updateUserPoints(userId, greyPoints, darkPoints);

		if (!updated) {
			return false;
		}

		// Log the transaction
		await logPointsTransaction(userId, greyPoints, darkPoints, {
			source: "level_completion",
			id: levelId,
			score: scoreData.score,
		});

		console.log(
			`Successfully assigned ${greyPoints} grey points and ${darkPoints} dark points to user ${userId} for level ${levelId}`
		);
		toast.success(
			`${greyPoints} grey points${
				darkPoints > 0 ? ` and ${darkPoints} dark points` : ""
			} earned!`
		);
		return true;
	} catch (error) {
		console.error("Error assigning level points:", error);
		return false;
	}
}
