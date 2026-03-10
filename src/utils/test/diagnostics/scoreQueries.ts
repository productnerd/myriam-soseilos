import { supabase } from "@/integrations/supabase/client";

/**
 * Get recent scores for the current user
 */
export async function getUserRecentScores(userId: string | null): Promise<string> {
	try {
		if (!userId) {
			return "Recent test scores for user: No authenticated user found";
		}

		// Get scores from the last hour
		const oneHourAgo = new Date();
		oneHourAgo.setHours(oneHourAgo.getHours() - 1);

		const { data: recentScores, error } = await supabase
			.from("user_test_scores")
			.select("*")
			.eq("user_id", userId)
			.gte("completed_at", oneHourAgo.toISOString())
			.order("completed_at", { ascending: false });

		if (error) {
			return `Error getting recent scores: ${error.message}`;
		}

		let output = `Recent test scores for user (last hour): ${recentScores.length}\n`;

		if (recentScores.length > 0) {
			recentScores.forEach((score) => {
				output += `- Test: ${score.test_id}, Score: ${score.score}, Passed: ${score.passed}, Time: ${score.completed_at}\n`;
			});
		} else {
			output += "No recent test scores found\n";
		}

		return output;
	} catch (error) {
		return `Error in recent scores check: ${
			error instanceof Error ? error.message : String(error)
		}`;
	}
}

/**
 * Get test scores for a specific user and test
 */
export async function getUserTestScores(testId: string, userId: string) {
	try {
		// Get the user's scores for this test
		const { data: scores, error } = await supabase
			.from("user_test_scores")
			.select("*")
			.eq("test_id", testId)
			.eq("user_id", userId)
			.order("completed_at", { ascending: false });

		if (error) {
			console.error("Error fetching user test scores:", error);
			return null;
		}

		return scores;
	} catch (error) {
		console.error("Error in getUserTestScores:", error);
		return null;
	}
}
