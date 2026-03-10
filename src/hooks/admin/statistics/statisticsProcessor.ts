import { supabase } from "@/integrations/supabase/client";
import { PlatformStatistic } from "./types";
import { fetchPopularSkills } from "./skillsStatistics";
import { processPopularCoursesData, fetchPopularCourses } from "./coursesStatistics";
import { processSidequestData } from "./sideQuestStatistics";
import { fetchCountryStatistics } from "./countryStatistics";

/**
 * Fetches and processes all statistics from the platform_statistics table
 */
export async function fetchAndProcessStatistics(): Promise<Record<string, any>> {
	console.log("Fetching admin statistics...");

	// First fetch directly calculated statistics
	console.log("Starting direct calculations...");
	const popularSkills = await fetchPopularSkills();
	const popularCourses = await fetchPopularCourses();
	const countryStats = await fetchCountryStatistics();
	console.log(
		`Directly calculated ${popularSkills.length} popular skills, ${popularCourses.length} courses, and ${countryStats.length} countries`
	);

	// Fetch platform statistics
	const { data, error } = await supabase.from("platform_statistics").select("*");

	if (error) {
		console.error("Error fetching platform statistics:", error);
		throw error;
	}

	console.log("Raw platform statistics:", data);

	// Convert array to an object with stat_key as keys
	const statistics: Record<string, any> = {};
	data?.forEach((item: PlatformStatistic) => {
		statistics[item.stat_key] = {
			value: item.stat_value,
			updated: item.calculated_at,
		};
	});

	// Always update with our directly calculated data
	statistics.popular_skills = {
		value: popularSkills,
		updated: new Date().toISOString(),
	};

	statistics.popular_courses = {
		value: popularCourses,
		updated: new Date().toISOString(),
	};

	statistics.country_statistics = {
		value: countryStats,
		updated: new Date().toISOString(),
	};

	// Process sidequest completion data if present
	if (statistics.sidequest_completion?.value) {
		statistics.sidequest_completion.value = processSidequestData(
			statistics.sidequest_completion.value
		);
	} else {
		console.warn("No sidequest completion data found");
		statistics.sidequest_completion = { value: [] };
	}

	return statistics;
}

/**
 * Manually refreshes all statistics by calling the update_platform_statistics RPC
 */
export async function refreshStatistics(): Promise<boolean> {
	console.log("Manually refreshing statistics...");
	const { data, error } = await supabase.rpc("update_platform_statistics");

	if (error) {
		console.error("Error refreshing statistics:", error);
		throw error;
	}

	console.log("Statistics refresh completed");
	return true;
}
