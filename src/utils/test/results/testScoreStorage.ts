import { supabase } from "@/integrations/supabase/client";

/**
 * Creates or updates a test score record
 * This function ALWAYS creates a new record in test_scores table
 * to maintain a historical record of all test attempts
 */
export async function createOrUpdateTestScore(
	testId: string,
	userId: string,
	score: number | null,
	passed: boolean | null
): Promise<boolean> {
	try {
		console.debug(`Creating test score record for test: ${testId} (score: ${score})`);

		// Ensure score is never null and capped at 100
		const finalScore = score === null ? 0 : Math.min(100, score);

		// Add a unique timestamp to each insert to avoid any possibility of duplication
		const now = new Date().toISOString();

		// Always insert a new record in test_scores table to maintain history
		const { error: insertError } = await supabase.from("test_scores").insert({
			user_id: userId,
			test_id: testId,
			score: finalScore,
			created_at: now,
		});

		if (insertError) {
			console.error("Error inserting test score:", insertError);
			return false;
		}

		console.log(
			"Successfully created test score record in test_scores table with score:",
			finalScore
		);

		// Verify the insert by retrieving the inserted record
		const { data: verifyData, error: verifyError } = await supabase
			.from("test_scores")
			.select("*")
			.eq("user_id", userId)
			.eq("test_id", testId)
			.order("created_at", { ascending: false })
			.limit(1);

		if (verifyError || !verifyData || verifyData.length === 0) {
			console.error(
				"Failed to verify test score insertion:",
				verifyError || "No record found"
			);
			return false;
		}

		console.log("[VERIFICATION] Recent test score record:", verifyData[0]);
		return true;
	} catch (error) {
		console.error("Error in createOrUpdateTestScore:", error);
		return false;
	}
}
