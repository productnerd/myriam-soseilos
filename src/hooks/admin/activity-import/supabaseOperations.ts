import { supabase } from "@/integrations/supabase/client";
import { ActivityValidationData } from "@/utils/activities/activityValidation";
import { ActivityType } from "@/types/activity";
import { isPollActivityType } from "@/utils/activities/activityOperations";

/**
 * Get the next order number for activities in a topic
 */
export const getNextOrderNumber = async (topicId: string): Promise<number> => {
	const { data, error } = await supabase
		.from("activities")
		.select("order_number")
		.eq("topic_id", topicId)
		.order("order_number", { ascending: false })
		.limit(1);

	if (error) {
		console.error("Error getting next order number:", error);
		return 1; // Default to 1 if error
	}

	return data && data.length > 0 ? data[0].order_number + 1 : 1;
};

/**
 * Insert a single activity into the database
 */
export const insertActivity = async (
	activity: ActivityValidationData,
	nextOrderNumber: number
): Promise<boolean> => {
	try {
		// Determine if this activity type should have a null correct_answer
		const isPollType = isPollActivityType(activity.type as ActivityType);
		const isEduntainment = activity.type === "eduntainment";

		// Prepare the activity object
		const activityToInsert = {
			topic_id: activity.topic_id,
			type: activity.type as ActivityType,
			main_text: activity.main_text || (isEduntainment ? "Educational content" : ""),
			correct_answer: isPollType
				? null
				: isEduntainment
				? "N/A"
				: activity.correct_answer || "",
			explanation: activity.explanation || "",
			options: activity.options || null,
			order_number: activity.order_number || nextOrderNumber,
			embed_url: activity.embed_url || null,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			author_id: null, // Could be set to admin user ID if needed
		};

		const { error: insertError } = await supabase.from("activities").insert(activityToInsert);

		if (insertError) {
			throw new Error(`Database error: ${insertError.message}`);
		}

		return true;
	} catch (error) {
		console.error("Error inserting activity:", error);
		return false;
	}
};
