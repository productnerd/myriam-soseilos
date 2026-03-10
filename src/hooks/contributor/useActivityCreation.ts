import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityFormData } from "@/types/activity";
import { toast } from "sonner";
import { isPollActivityType } from "@/utils/activities/activityOperations";

/**
 * Hook for creating activities
 *
 * @param userId - The ID of the authenticated user
 * @returns Activity creation functions and state
 */
export function useActivityCreation(userId: string) {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const submitActivities = async (activities: ActivityFormData[]) => {
		try {
			setIsSubmitting(true);

			// Process each activity to ensure required fields are present
			const processedActivities = activities.map((activity) => {
				// Filter out any properties that don't exist in the database schema
				const { image_urls, ...activityWithoutImageUrls } = activity;

				// For poll types, set correct_answer to null
				const isPollType = isPollActivityType(activity.type as any);
				const isEduntainment = activity.type === "eduntainment";

				// Set correct_answer based on activity type
				const correctAnswer = isPollType
					? null
					: isEduntainment
					? "N/A"
					: activity.correct_answer || "";

				return {
					...activityWithoutImageUrls,
					user_id: userId,
					correct_answer: correctAnswer,
				};
			});

			const { error } = await supabase
				.from("new_activity_submissions")
				.insert(processedActivities);

			if (error) throw error;

			toast.success("Activities submitted successfully");
			return true;
		} catch (error) {
			console.error("Error submitting activities:", error);
			toast.error("Failed to submit activities");
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	return { submitActivities, isSubmitting };
}
