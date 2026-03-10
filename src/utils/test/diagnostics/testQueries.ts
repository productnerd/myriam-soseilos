import { supabase } from "@/integrations/supabase/client";

/**
 * Gets basic test information
 */
export async function getTestInfo(testId: string) {
	const { data, error } = await supabase
		.from("tests")
		.select("id, title, test_type, course_id, level_id, score_average, score_distribution")
		.eq("id", testId)
		.single();

	if (error) {
		console.error("Error fetching test info:", error);
		return null;
	}

	return data;
}
