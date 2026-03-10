import { supabase } from "@/integrations/supabase/client";

/**
 * Run extensive diagnostics on the test ID resolution process
 */
export async function runIdResolutionDiagnostics(testId: string) {
	const lines: string[] = [];
	let resolvedId: string | null = null;

	try {
		lines.push(`[DIAGNOSTIC] Starting ID resolution diagnostics for ID: ${testId}`);

		// Check if this ID exists as a test
		const { data: testData, error: testError } = await supabase
			.from("tests")
			.select("id, title, test_type, level_id, course_id")
			.eq("id", testId)
			.maybeSingle();

		if (testError) {
			lines.push(`[DIAGNOSTIC] Error checking direct test ID: ${testError.message}`);
		} else if (testData) {
			lines.push(`[DIAGNOSTIC] ID is a valid test ID: ${testData.id} (${testData.title})`);
			lines.push(`[DIAGNOSTIC] Test type: ${testData.test_type}`);
			lines.push(`[DIAGNOSTIC] Level ID: ${testData.level_id || "none"}`);
			lines.push(`[DIAGNOSTIC] Course ID: ${testData.course_id || "none"}`);
			resolvedId = testData.id;
		} else {
			lines.push(`[DIAGNOSTIC] ID is not a direct test ID`);

			// Check if this is a level ID
			const { data: levelTestData, error: levelTestError } = await supabase
				.from("tests")
				.select("id, title, test_type, level_id, course_id")
				.eq("level_id", testId)
				.eq("test_type", "level")
				.maybeSingle();

			if (levelTestError) {
				lines.push(`[DIAGNOSTIC] Error checking level test: ${levelTestError.message}`);
			} else if (levelTestData) {
				lines.push(
					`[DIAGNOSTIC] ID is a valid level ID with associated level test: ${levelTestData.id} (${levelTestData.title})`
				);
				lines.push(`[DIAGNOSTIC] Test type: ${levelTestData.test_type}`);
				lines.push(`[DIAGNOSTIC] Level ID: ${levelTestData.level_id}`);
				lines.push(`[DIAGNOSTIC] Course ID: ${levelTestData.course_id || "none"}`);
				resolvedId = levelTestData.id;
			} else {
				lines.push(
					`[DIAGNOSTIC] ID is neither a test ID nor a level ID with associated level test`
				);
			}
		}

		// If we have resolved to a test ID, check for test activities
		if (resolvedId) {
			const { data: testActivities, error: activitiesError } = await supabase
				// TODO: Table `test_activities` has been removed. Test activities should be fetched directly from the `activities` table using the `test_id` foreign key.
				.from("test_activities")
				.select("count")
				.eq("test_id", resolvedId);

			if (activitiesError) {
				lines.push(
					`[DIAGNOSTIC] Error counting test activities: ${activitiesError.message}`
				);
			} else {
				const count = testActivities?.length || 0;
				lines.push(`[DIAGNOSTIC] Test has ${count} activities linked`);

				if (count === 0) {
					lines.push(
						`[DIAGNOSTIC WARNING] Test has no activities - this may cause errors`
					);
				}
			}
		}

		return { lines, resolvedId };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		lines.push(`[DIAGNOSTIC ERROR] Unhandled exception: ${errorMessage}`);
		return { lines, resolvedId };
	}
}
