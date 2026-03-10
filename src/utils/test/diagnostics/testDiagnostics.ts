import { supabase } from "@/integrations/supabase/client";
import { getUserTestScores } from "./scoreQueries";
import { getTestInfo } from "./testQueries";

// The main function that fetches all diagnostic data for a test
export async function fetchTestDiagnostics(userId: string, testId: string) {
	try {
		if (!userId) {
			console.error("No user ID found for diagnostics");
			return;
		}

		// Get basic test information
		const testInfo = await getTestInfo(testId);

		// Get user test scores
		const userTestScores = await getUserTestScores(testId, userId);

		return {
			testInfo,
			userTestScores,
		};
	} catch (error) {
		console.error("Error fetching test diagnostics:", error);
		return { error: "Failed to fetch diagnostics" };
	}
}

/**
 * Runs authentication diagnostics and returns result as lines of text
 */
export async function runAuthDiagnostics(userId: string | null): Promise<string[]> {
	const lines: string[] = [];
	const authStatus = userId ? "Authenticated" : "Not authenticated";
	lines.push(`Auth Status: ${authStatus}`);
	lines.push(`User ID: ${userId || "Not logged in"}`);
	return lines;
}

/**
 * Resolves and validates a test ID
 */
export async function runIdResolutionDiagnostics(testId: string): Promise<{
	lines: string[];
	resolvedId: string;
}> {
	const lines: string[] = [];
	lines.push("\nID Resolution:");
	lines.push(`Original ID: ${testId}`);

	let resolvedId = testId;

	try {
		// Check if this is already a valid test ID
		const { data: testData, error: testError } = await supabase
			.from("tests")
			.select("id, test_type, level_id")
			.eq("id", testId)
			.maybeSingle();

		if (!testError && testData) {
			lines.push(`Resolved ID: ${resolvedId}`);
			return { lines, resolvedId };
		}

		// If not found directly, try to look it up by level_id
		const { data: levelTestData, error: levelTestError } = await supabase
			.from("tests")
			.select("id, test_type, level_id")
			.eq("level_id", testId)
			.eq("test_type", "level")
			.maybeSingle();

		if (levelTestError) {
			lines.push(`Error resolving ID: ${levelTestError.message}`);
			return { lines, resolvedId };
		}

		if (!levelTestData) {
			lines.push(`Could not resolve ID: ${testId}`);
			return { lines, resolvedId };
		}

		resolvedId = levelTestData.id;
		lines.push(`Resolved ID: ${resolvedId}`);
	} catch (error) {
		lines.push(`Error resolving ID: ${error instanceof Error ? error.message : String(error)}`);
	}

	return { lines, resolvedId };
}

/**
 * Runs diagnostics for test queries with original and resolved IDs
 */
export async function runTestQueryDiagnostics(
	originalId: string,
	resolvedId: string
): Promise<string[]> {
	const lines: string[] = [];
	lines.push("\n");

	// Check test with original ID
	const { data: originalTest, error: originalError } = await supabase
		.from("tests")
		.select("*")
		.eq("id", originalId)
		.maybeSingle();

	lines.push(`Test Query with Original ID: ${originalError ? "Failed" : "Success"}`);
	if (originalError) {
		lines.push(`Error: ${originalError.message}`);
	} else if (!originalTest) {
		lines.push(`Test not found directly`);
	} else {
		lines.push(`Test Type: ${originalTest.test_type}, Level ID: ${originalTest.level_id}`);
	}

	// Check test with resolved ID
	const { data: resolvedTest, error: resolvedError } = await supabase
		.from("tests")
		.select("*")
		.eq("id", resolvedId)
		.maybeSingle();

	lines.push(`\nTest Query with Resolved ID: ${resolvedError ? "Failed" : "Success"}`);
	if (resolvedError) {
		lines.push(`Error: ${resolvedError.message}`);
	} else if (!resolvedTest) {
		lines.push(`Test not found after resolution`);
	} else {
		lines.push(
			`Found test: ${resolvedTest.id}, Type: ${resolvedTest.test_type}, Level: ${resolvedTest.level_id}`
		);
	}

	return lines;
}

/**
 * Runs diagnostics for level test
 */
export async function runLevelTestDiagnostics(
	testId: string,
	isLevelTest: boolean
): Promise<string[]> {
	if (!isLevelTest) return [];

	const lines: string[] = [];

	const { data: levelTest, error: levelTestError } = await supabase
		.from("tests")
		.select("*")
		.eq("level_id", testId)
		.eq("test_type", "level")
		.maybeSingle();

	lines.push(`\nLevel Test Lookup: ${levelTestError ? "Failed" : "Success"}`);
	if (levelTestError) {
		lines.push(`Error: ${levelTestError.message}`);
	} else if (!levelTest) {
		lines.push(`No level test found for level ID: ${testId}`);
	} else {
		lines.push(`Found by level_id: ${levelTest.id}, Type: ${levelTest.test_type}`);
	}

	return lines;
}

/**
 * Runs diagnostics for test scores
 */
export async function runScoreDiagnostics(
	userId: string | undefined,
	testId: string,
	resolvedId: string
): Promise<string[]> {
	const lines: string[] = [];

	if (!userId) {
		return lines;
	}

	// Check for test scores with original ID
	const { data: originalScores, error: originalScoresError } = await supabase
		.from("user_test_scores")
		.select("*")
		.eq("test_id", testId)
		.eq("user_id", userId);

	lines.push(
		"\nUser Test Scores Query (Original ID): " + (originalScoresError ? "Failed" : "Success")
	);
	if (originalScoresError) {
		lines.push(`Error: ${originalScoresError.message}`);
	} else {
		lines.push(`Existing Scores: ${originalScores?.length || 0}`);
		if (originalScores && originalScores.length > 0) {
			lines.push("\nMost recent scores (Original ID):");
			originalScores
				.sort(
					(a, b) =>
						new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
				)
				.slice(0, 3)
				.forEach((score) => {
					lines.push(
						`- ID: ${score.id}, Score: ${score.score}, Passed: ${score.passed}, Time: ${score.completed_at}`
					);
				});
		}
	}

	// Check for test scores with resolved ID
	const { data: resolvedScores, error: resolvedScoresError } = await supabase
		.from("user_test_scores")
		.select("*")
		.eq("test_id", resolvedId)
		.eq("user_id", userId);

	lines.push(
		"\nUser Test Scores Query (Resolved ID): " + (resolvedScoresError ? "Failed" : "Success")
	);
	if (resolvedScoresError) {
		lines.push(`Error: ${resolvedScoresError.message}`);
	} else {
		lines.push(`Existing Scores: ${resolvedScores?.length || 0}`);
		if (resolvedScores && resolvedScores.length > 0) {
			lines.push("\nMost recent scores (Resolved ID):");
			resolvedScores
				.sort(
					(a, b) =>
						new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
				)
				.slice(0, 3)
				.forEach((score) => {
					lines.push(
						`- ID: ${score.id}, Score: ${score.score}, Passed: ${score.passed}, Time: ${score.completed_at}`
					);
				});
		}
	}

	// Also check test_scores table
	const { data: testScores, error: testScoresError } = await supabase
		.from("test_scores")
		.select("*")
		.eq("test_id", resolvedId)
		.eq("user_id", userId);

	lines.push("\nTest Scores Table (Resolved ID): " + (testScoresError ? "Failed" : "Success"));
	if (testScoresError) {
		lines.push(`Error: ${testScoresError.message}`);
	} else {
		lines.push(`Existing Entries: ${testScores?.length || 0}`);
		if (testScores && testScores.length > 0) {
			lines.push("\nMost recent test_scores entries:");
			testScores
				.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
				.slice(0, 3)
				.forEach((score) => {
					lines.push(
						`- ID: ${score.id}, Score: ${score.score}, Time: ${score.created_at}`
					);
				});
		}
	}

	return lines;
}

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

/**
 * Main function to run all diagnostics
 */
export async function runDiagnostics(
	testId: string,
	isLevelTest: boolean,
	userId: string | null
): Promise<string> {
	try {
		const lines: string[] = [];
		let combinedResults: string[] = [];

		// Run authentication diagnostics
		const authLines = await runAuthDiagnostics(userId);
		combinedResults = combinedResults.concat(authLines);

		// Run ID resolution
		const { lines: idLines, resolvedId } = await runIdResolutionDiagnostics(testId);
		combinedResults = combinedResults.concat(idLines);

		// Run test query diagnostics
		const testQueryLines = await runTestQueryDiagnostics(testId, resolvedId);
		combinedResults = combinedResults.concat(testQueryLines);

		// Run level test diagnostics if applicable
		if (isLevelTest) {
			const levelTestLines = await runLevelTestDiagnostics(testId, isLevelTest);
			combinedResults = combinedResults.concat(levelTestLines);
		}

		// Run score diagnostics if user is authenticated
		if (userId) {
			const scoreLines = await runScoreDiagnostics(userId, testId, resolvedId);
			combinedResults = combinedResults.concat(scoreLines);

			// Run table info diagnostics
			const tableInfoLines = await runTableInfoDiagnostics(resolvedId);
			combinedResults = combinedResults.concat(tableInfoLines);
		}

		// Run all tests diagnostics
		const allTestsLines = await runAllTestsDiagnostics();
		combinedResults = combinedResults.concat(allTestsLines);

		// Test direct insertion message
		combinedResults.push(
			"\nTest Direct Insertion: No direct test performed - would create duplicate data"
		);

		return combinedResults.join("\n");
	} catch (error) {
		return `Error running diagnostics: ${
			error instanceof Error ? error.message : String(error)
		}`;
	}
}
