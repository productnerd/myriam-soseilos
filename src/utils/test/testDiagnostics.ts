import { supabase } from "@/integrations/supabase/client";

// Check if test data is properly set up
export async function checkTestDataHealth() {
	const diagnostics: string[] = [];
	let isHealthy = true;

	// Check test activities
	const { data: activities, error: activitiesError } = await supabase
		// TODO: Table `test_activities` has been removed. Test activities should be fetched directly from the `activities` table using the `test_id` foreign key.
		.from("test_activities")
		.select("*");

	if (activitiesError) {
		diagnostics.push(`Error fetching test activities: ${activitiesError.message}`);
		isHealthy = false;
	} else if (!activities?.length) {
		diagnostics.push("No test activities found");
		isHealthy = false;
	} else {
		diagnostics.push(`Found ${activities.length} test activities`);
	}

	// Check test submissions
	const { data: submissions, error: submissionsError } = await supabase
		.from("test_submissions")
		.select("*");

	if (submissionsError) {
		diagnostics.push(`Error fetching test submissions: ${submissionsError.message}`);
		isHealthy = false;
	} else {
		diagnostics.push(`Found ${submissions?.length || 0} test submissions`);
	}

	// Check test results
	const { data: results, error: resultsError } = await supabase.from("test_results").select("*");

	if (resultsError) {
		diagnostics.push(`Error fetching test results: ${resultsError.message}`);
		isHealthy = false;
	} else {
		diagnostics.push(`Found ${results?.length || 0} test results`);
	}

	return {
		isHealthy,
		diagnostics,
	};
}

// Reset test data
export async function resetTestData() {
	const tables = ["test_results", "test_submissions", "test_activities"];
	const results = [];

	for (const table of tables) {
		const { error } = await supabase.from(table).delete().neq("id", "dummy");
		if (error) {
			results.push(`Error clearing ${table}: ${error.message}`);
		} else {
			results.push(`Successfully cleared ${table}`);
		}
	}

	return results;
}

// Get test statistics
export async function getTestStats() {
	const stats = {
		totalActivities: 0,
		totalSubmissions: 0,
		totalResults: 0,
		averageScore: 0,
		passRate: 0,
	};

	// Get total activities
	const { data: activities } = await supabase
		// TODO: Table `test_activities` has been removed. Test activities should be fetched directly from the `activities` table using the `test_id` foreign key.
		.from("test_activities")
		.select("count", { count: "exact" });
	stats.totalActivities = activities?.[0]?.count || 0;

	// Get total submissions
	const { data: submissions } = await supabase
		.from("test_submissions")
		.select("count", { count: "exact" });
	stats.totalSubmissions = submissions?.[0]?.count || 0;

	// Get test results statistics
	const { data: results } = await supabase.from("test_results").select("score, passed");

	if (results?.length) {
		stats.totalResults = results.length;
		stats.averageScore =
			results.reduce((acc, curr) => acc + (curr.score || 0), 0) / results.length;
		stats.passRate = (results.filter((r) => r.passed).length / results.length) * 100;
	}

	return stats;
}
