import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for saving test progress
 *
 * @param userId - The ID of the authenticated user
 * @returns Test progress mutation functions
 */
export function useTestProgress(userId: string) {
	const mutation = useMutation({
		mutationFn: async ({ activityId, testId }: { activityId: string; testId: string }) => {
			try {
				// Get the test info to determine which course this belongs to
				const { data: testInfo, error: testError } = await supabase
					.from("tests")
					.select("course_id, level_id")
					.eq("id", testId)
					.single();

				if (testError) {
					throw new Error(`Error getting test info: ${testError.message}`);
				}

				// CRITICAL: We only update the activity_id, but we DO NOT touch the current_topic_id
				// This is to ensure the current_topic_id remains set when we navigate to the test.
				const { data: currentUserProgress, error: progressCheckError } = await supabase
					.from("user_progress")
					.select("current_topic_id")
					.eq("user_id", userId)
					.eq("course_id", testInfo.course_id)
					.maybeSingle();

				if (progressCheckError) {
					console.error("Error checking user progress:", progressCheckError);
				}

				// Only proceed if current_topic_id is properly set
				if (currentUserProgress?.current_topic_id) {
					// Update user progress for this test activity - set ONLY current_activity_id
					const { error: updateError } = await supabase
						.from("user_progress")
						.update({ current_activity_id: activityId })
						.eq("user_id", userId)
						.eq("course_id", testInfo.course_id);

					if (updateError) {
						throw new Error(`Error updating test progress: ${updateError.message}`);
					}
				} else {
					console.error(
						"CRITICAL ERROR: Cannot update current_activity_id because current_topic_id is NULL"
					);
				}

				return { activityId, testId };
			} catch (error) {
				console.error("Error saving test progress:", error);
				throw error;
			}
		},
		onError: (error) => {
			toast.error("Failed to save test progress");
			console.error("Test progress mutation error:", error);
		},
	});

	return {
		saveTestProgress: mutation.mutate,
		saveTestProgressAsync: mutation.mutateAsync,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		isSuccess: mutation.isSuccess,
		error: mutation.error,
	};
}
