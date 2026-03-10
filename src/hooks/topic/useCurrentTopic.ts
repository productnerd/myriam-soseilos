import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity } from "@/types/activity";
import { useRequiredCourseContext } from "@/contexts/CourseContext";
import { fetchTopicActivities } from "@/utils/topic/topicActivities";

// Define the return type for the hook
interface CurrentTopicData {
	topicActivities: Activity[];
	currentActivityIndex: number;
}

/**
 * This hook fetches all the data needed for a learning session:
 * 1. Activities for the topic (unanswered ones)
 * 2. Current activity index (where the user left off)
 *
 * It's used by `LearningFlow` to get data for `ActivityContainer`.
 *
 * @param topicId - The ID of the topic to fetch (comes from URL params, can be undefined)
 * @param userId - The ID of the authenticated user
 * @returns Pending activities for the topic, current activity index, and loading states
 */
export function useCurrentTopic(topicId: string | undefined, userId: string) {
	const queryClient = useQueryClient();

	const { selectedCourseId } = useRequiredCourseContext();

	const queryResult = useQuery<CurrentTopicData>({
		queryKey: ["currentTopic", topicId, selectedCourseId, userId],
		queryFn: async () => {
			// Don't proceed if required parameters are not available
			if (!topicId) {
				return { topicActivities: [], currentActivityIndex: 0 };
			}

			console.log("[useCurrentTopic] Fetching topic data for:", topicId);

			// Check cache first for better performance
			const cachedData = queryClient.getQueryData<CurrentTopicData>([
				"currentTopic",
				topicId,
				selectedCourseId,
				userId,
			]);

			if (cachedData) {
				return cachedData;
			}

			console.log("[useCurrentTopic] Using topic ID:", topicId);

			try {
				// Fetch uncompleted activities for this topic
				const activities = await fetchTopicActivities(topicId, userId);

				// Since activities are sorted by order_number, the first activity in the list is the current activity
				let currentActivityIndex = 0;
				if (activities.length > 0) {
					// Note: 'order_number' is 1-based, array index is 0-based
					currentActivityIndex = activities[0].order_number - 1;
				}

				// Return all the data needed for `ActivityFlow`
				console.log(`[useCurrentTopic] Topic (${topicId}) data fetched successfully`);
				return { topicActivities: activities, currentActivityIndex };
			} catch (err) {
				console.log(`[useCurrentTopic] Error fetching topic (${topicId}) data:`, err);
				return { topicActivities: [], currentActivityIndex: 0 };
			}
		},
		refetchOnWindowFocus: false, // Don't refetch when window gains focus
		enabled: !!topicId, // Only run when topicId is available
		retry: 1, // Retry once on failure
		staleTime: 60000, // Consider data fresh for 1 minute
		gcTime: 300000, // Keep in cache for 5 minutes
	});

	return queryResult;
}
