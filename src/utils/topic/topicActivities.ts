import { supabase } from "@/integrations/supabase/client";
import { Activity } from "@/types/activity";

/**
 * Fetches uncompleted activities for a specific topic
 * @param topicId - The ID of the topic to fetch activities for
 * @param userId - The ID of the user to fetch activities for
 * @returns A list of activities for the topic, excluding activities that have already been answered
 */
export async function fetchTopicActivities(topicId: string, userId: string): Promise<Activity[]> {
	try {
		console.log(`Fetching activities for topic ${topicId}`);

		// First, get all activities for the topic
		const { data: activitiesData, error: activitiesError } = await supabase
			.from("activities")
			.select("*")
			.eq("topic_id", topicId)
			.order("order_number");

		if (activitiesError) {
			console.error("Error fetching topic activities:", activitiesError);
			throw activitiesError;
		}

		if (!userId) return [];

		// Get activities that have already been answered by this user
		// We can query the review activities table since completed activites get inserted there
		const { data: answeredActivitiesData, error: answeredActivitiesError } = await supabase
			.from("user_review_activities")
			.select("activity_id")
			.eq("user_id", userId);

		if (answeredActivitiesError) {
			console.error("Error fetching completed activities:", answeredActivitiesError);
			return [];
		}

		// Create a set of answered activity IDs for efficient lookup
		const answeredActivityIds = new Set(
			answeredActivitiesData?.map((a) => a.activity_id) || []
		);

		// Filter out activities that have already been answered
		const unansweredActivities = activitiesData.filter(
			(activity) => !answeredActivityIds.has(activity.id)
		);

		console.log(
			`Found ${unansweredActivities.length} uncompleted activities for topic ${topicId}`
		);

		return unansweredActivities.map((item) => ({
			id: item.id,
			main_text: item.main_text,
			type: item.type,
			options: Array.isArray(item.options) ? item.options : [],
			correct_answer: item.correct_answer,
			explanation: item.explanation,
			order_number: item.order_number,
			topic_id: item.topic_id,
			embed_url: item.embed_url,
			statistics: item.statistics,
			author_id: item.author_id,
		})) as Activity[];
	} catch (err) {
		console.error("Error in fetchTopicActivities:", err);
		return [];
	}
}

/**
 * Updates the current_activity_id in `user_progress` to track learning flow progress
 * TODO: This is not used anywhere
 */
export async function updateCurrentActivity(
	userId: string,
	courseId: string,
	activityId: string | null
): Promise<boolean> {
	try {
		const { error } = await supabase
			.from("user_progress")
			.update({
				current_activity_id: activityId,
				updated_at: new Date().toISOString(),
			})
			.eq("user_id", userId)
			.eq("course_id", courseId);

		if (error) {
			console.error("Error updating current activity:", error);
			return false;
		}

		return true;
	} catch (err) {
		console.error("Error in updateCurrentActivity:", err);
		return false;
	}
}
