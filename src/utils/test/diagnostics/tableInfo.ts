import { supabase } from "@/integrations/supabase/client";

/**
 * Runs diagnostics on test counts and recent scores
 */
export async function runTableInfoDiagnostics(resolvedId: string): Promise<string[]> {
	const lines: string[] = [];

	// Direct table info without user filter
	const { data: tableInfo, error: tableInfoError } = await supabase
		.from("user_test_scores")
		.select("count")
		.eq("test_id", resolvedId);

	lines.push(
		"\nTotal user_test_scores for this test: " +
			(tableInfoError ? `Error: ${tableInfoError.message}` : tableInfo?.[0]?.count || 0)
	);

	// Get the most recent 3 scores for this test from any user
	const { data: recentScores, error: recentScoresError } = await supabase
		.from("user_test_scores")
		.select("id, test_id, user_id, score, passed, completed_at")
		.eq("test_id", resolvedId)
		.order("completed_at", { ascending: false })
		.limit(3);

	lines.push(
		"\nRecent user_test_scores for this test (any user): " +
			(recentScoresError ? `Error: ${recentScoresError.message}` : "")
	);

	if (recentScores && recentScores.length > 0) {
		recentScores.forEach((score) => {
			lines.push(
				`- User: ${score.user_id}, Score: ${score.score}, Passed: ${score.passed}, Time: ${score.completed_at}`
			);
		});
	} else {
		lines.push("No recent scores found");
	}

	return lines;
}

/**
 * Runs diagnostics on all tests
 */
export async function runAllTestsDiagnostics(): Promise<string[]> {
	const lines: string[] = [];

	// Get all tests
	const { data: allTests, error: allTestsError } = await supabase
		.from("tests")
		.select("id, test_type, level_id")
		.order("created_at", { ascending: false })
		.limit(10);

	lines.push("\nAll Tests (10 most recent):");
	if (allTestsError) {
		lines.push(`Error fetching tests: ${allTestsError.message}`);
	} else if (!allTests || allTests.length === 0) {
		lines.push("No tests found");
	} else {
		lines.push("");
		allTests.forEach((test) => {
			lines.push(`ID: ${test.id}, Type: ${test.test_type}, Level: ${test.level_id}`);
		});
	}

	return lines;
}
