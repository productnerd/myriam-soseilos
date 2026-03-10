import { useQuery } from "@tanstack/react-query";
import { getTestActivities } from "@/utils/activities/activityOperations";
import { Activity } from "@/types/activity";

// Hook that fetches activities for a given test
export const useTestActivities = (testId: string) => {
	return useQuery({
		queryKey: ["test-activities", testId],
		queryFn: async (): Promise<Activity[]> => {
			if (!testId) return [];

			// Use `getTestActivities` to fetch test activities
			// This also handles proper type conversion from database to Activity
			return await getTestActivities(testId);
		},
		enabled: !!testId,
	});
};
