import { useQuery } from "@tanstack/react-query";
import { fetchTopicActivities } from "@/utils/topic/topicActivities";
import { Activity } from "@/types/activity";

/**
 * Hook to fetch activities for a specified topic
 */
export function useTopicActivities(topicId: string | undefined) {
	return useQuery({
		queryKey: ["topicActivities", topicId],
		queryFn: async () => {
			if (!topicId) return [];
			return fetchTopicActivities(topicId);
		},
		enabled: !!topicId,
		staleTime: 300000, // Consider data fresh for 5 minutes
		gcTime: 600000, // Keep in cache for 10 minutes (renamed from cacheTime)
		refetchOnWindowFocus: false, // Don't refetch on window focus for activity data
	});
}

// Re-export the service function for direct use
export { fetchTopicActivities } from "@/utils/topic/topicActivities";
