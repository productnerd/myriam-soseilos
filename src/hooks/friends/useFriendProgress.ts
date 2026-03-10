import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFriends } from "@/hooks/friends/useFriends";
import { getTopicById } from "@/utils/topic/topicData";

export interface FriendProgressInfo {
	userId: string;
	name: string | null;
	thumbnail: string | null;
	currentTopicId: string | null;
	currentLevelId: string | null;
	courseId: string | null;
}

/**
 * Hook for fetching friend progress
 *
 * @param userId - The ID of the authenticated user
 * @param courseId - Optional course ID to filter by
 * @returns Friend progress query
 */
export function useFriendProgress(userId: string, courseId?: string) {
	const { friends } = useFriends(userId);

	return useQuery({
		queryKey: ["friendProgress", courseId, friends.map((f) => f.id).join(",")],
		queryFn: async (): Promise<FriendProgressInfo[]> => {
			if (friends.length === 0) return [];

			try {
				// Get all friend IDs
				const friendIds = friends.map((friend) => friend.id);

				// Create a map of friend data for quick lookup
				const friendMap = friends.reduce((acc, friend) => {
					acc[friend.id] = friend;
					return acc;
				}, {} as Record<string, (typeof friends)[0]>);

				// Query for friend progress in this course if courseId is provided,
				// otherwise get progress across all courses
				let progressQuery = supabase
					.from("user_progress")
					.select("user_id, current_topic_id, current_level_id, course_id")
					.in("user_id", friendIds);

				if (courseId) {
					progressQuery = progressQuery.eq("course_id", courseId);
				}

				const { data, error } = await progressQuery;

				if (error) {
					console.error("Error fetching friend progress:", error);
					throw error;
				}

				// Map the data to include friend details
				return data.map((progress) => ({
					userId: progress.user_id,
					name: friendMap[progress.user_id]?.name,
					thumbnail: friendMap[progress.user_id]?.thumbnail,
					currentTopicId: progress.current_topic_id,
					currentLevelId: progress.current_level_id,
					courseId: progress.course_id,
				}));
			} catch (error) {
				console.error("Error in useFriendProgress:", error);
				return [];
			}
		},
		enabled: !!userId && friends.length > 0, // Only run when user is authenticated and has friends
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: true,
	});
}

// TODO: This is not used anywhere
export function useFriendTopicProgress(topicId: string) {
	return useQuery({
		queryKey: ["friendTopicProgress", topicId],
		queryFn: async (): Promise<FriendProgressInfo[]> => {
			if (!topicId) return [];

			try {
				// Get the topic's information (including level_id)
				const topicData = await getTopicById(topicId);

				if (!topicData) {
					console.error("Error fetching topic information");
					return [];
				}

				// TODO: Shouldn't this return topicData?  [] looks wrong
				// Use the useFriendProgress hook result
				return [];
			} catch (error) {
				console.error("Error in useFriendTopicProgress:", error);
				return [];
			}
		},
		enabled: !!topicId,
	});
}
