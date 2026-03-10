import { supabase } from "@/integrations/supabase/client";

/**
 * Get test data from the database
 */
export async function getTestData(testId: string) {
	const { data, error } = await supabase
		.from("tests")
		.select("test_type, level_id")
		.eq("id", testId)
		.single();

	if (error) {
		console.error("Error fetching test data:", error);
		return null;
	}

	return data;
}
