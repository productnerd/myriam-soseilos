import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActiveUsersByCourse {
	[courseId: string]: number;
}

interface ActiveUsersData {
	course_id: string;
	active_users: number;
}

export function useActiveUsersPerCourse() {
	return useQuery({
		queryKey: ["activeUsersPerCourse"],
		queryFn: async (): Promise<ActiveUsersByCourse> => {
			try {
				// Fetch the active users data from the platform_statistics table
				const { data, error } = await supabase
					.from("platform_statistics")
					.select("stat_value")
					.eq("stat_key", "course_active_users")
					.single();

				if (error) {
					console.error("Error fetching active users per course:", error);
					return {};
				}

				if (!data || !data.stat_value) {
					console.warn("No active users data found");
					return {};
				}

				// Transform the data into a map of courseId -> activeUsers
				// First cast to unknown, then to our expected type to avoid TypeScript errors
				const activeUsersArray = data.stat_value as unknown as ActiveUsersData[];
				const activeUsersMap: ActiveUsersByCourse = {};

				if (Array.isArray(activeUsersArray)) {
					activeUsersArray.forEach((item) => {
						if (item && item.course_id && typeof item.active_users === "number") {
							activeUsersMap[item.course_id] = item.active_users;
						}
					});
				} else {
					console.warn("Active users data is not in expected format:", data.stat_value);
				}

				return activeUsersMap;
			} catch (error) {
				console.error("Error in useActiveUsersPerCourse:", error);
				return {};
			}
		},
		// Fetch once per day; this data is updated daily by the cron job
		staleTime: 24 * 60 * 60 * 1000,
	});
}
