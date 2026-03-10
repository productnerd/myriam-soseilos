import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Topic } from "@/types/topic";
import { getTopicsForLevel } from "@/utils/topic/topicData";

/**
 * Hook to fetch topics for a specific level with completion status
 *
 * @param levelId - The ID of the level
 * @param userId - The ID of the authenticated user
 * @returns The topics and course ID
 */
export function useTopicsByLevel(levelId: string, userId: string) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["topics", levelId, userId],
		queryFn: async () => {
			try {
				if (!levelId) {
					return { topics: [], courseId: null };
				}

				console.log("[useTopicsByLevel] Fetching topics for level", levelId);

				// First get the course_id from the level with one query
				const { data: level, error: levelError } = await supabase
					.from("levels")
					.select("course_id, order_number")
					.eq("id", levelId)
					.single();

				if (levelError) {
					console.error("[useTopicsByLevel] Error fetching level info:", levelError);
					throw levelError;
				}

				// Get the user's progress for this course
				// Use Promise.all to parallelize these independent queries
				const [completedTopicsResult, userProgressResult] = await Promise.all([
					// Get all COMPLETED topics from user_completed_topics
					supabase
						.from("user_completed_topics")
						.select("topic_id")
						.eq("user_id", userId)
						.eq("level_id", levelId),

					// Get the current topic from user_progress
					supabase
						.from("user_progress")
						.select("current_topic_id, current_level_id")
						.eq("user_id", userId)
						.eq("course_id", level.course_id)
						.maybeSingle(),
				]);

				if (completedTopicsResult?.error) {
					console.error(
						"[useTopicsByLevel] Error fetching completed topics:",
						completedTopicsResult.error
					);
					throw completedTopicsResult.error;
				}

				if (userProgressResult?.error) {
					console.error(
						"[useTopicsByLevel] Error fetching user progress:",
						userProgressResult.error
					);
				}
				// Fetch all topics for this level (this doesn't depend on user)
				const topics = await getTopicsForLevel(levelId);

				const completedTopics = completedTopicsResult?.data || [];
				const currentTopicId = userProgressResult?.data?.current_topic_id;

				// TODO: What is this for?
				// Create a set of completed topic IDs for faster lookup
				const completedTopicIds = new Set(completedTopics.map((t) => t.topic_id) || []);

				return {
					topics,
					courseId: level.course_id,
					completedTopics,
					currentTopicId,
				};
			} catch (error) {
				console.error("[useTopicsByLevel] Error in queryFn:", error);
				throw error;
			}
		},
		enabled: !!levelId && !!userId, // Only run when levelId is provided and user is authenticated
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	// Memoize the topics array to prevent unnecessary re-renders
	const memoizedResult = useMemo(
		() => ({
			data: data?.topics as Topic[],
			completedTopics: data?.completedTopics,
			currentTopicId: data?.currentTopicId,
			isLoading,
			error,
		}),
		[data, isLoading, error]
	);

	return memoizedResult;
}
