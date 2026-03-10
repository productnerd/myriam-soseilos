import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to validate user progress for debugging purposes
 */
export function useUserProgressValidation(userId: string | null, selectedCourseId: string | null) {
	// Log user progress for debugging
	useEffect(() => {
		if (!userId || !selectedCourseId) return;

		async function fetchAndLogUserProgress() {
			const { data, error } = await supabase
				.from("user_progress")
				.select("*")
				.eq("user_id", userId);

			if (error) {
				console.error("[useUserProgressValidation] Error fetching user progress:", error);
			} else {
				console.log("[useUserProgressValidation] User progress:", data);
			}
		}

		fetchAndLogUserProgress();
	}, [userId, selectedCourseId]);

	// Replace RPC function call with direct validation
	useEffect(() => {
		if (!userId || !selectedCourseId) return;

		async function validateTopicProgress() {
			try {
				// Instead of calling the RPC function, perform the validation directly
				const { data: userProgress, error: progressError } = await supabase
					.from("user_progress")
					.select("current_topic_id, current_level_id")
					.eq("user_id", userId)
					.eq("course_id", selectedCourseId)
					.single();

				if (progressError) {
					console.error(
						"[useUserProgressValidation] Error checking user progress:",
						progressError
					);
					return;
				}

				if (!userProgress || !userProgress.current_topic_id) {
					console.log(
						"[useUserProgressValidation] No current topic or invalid user progress found"
					);
					return;
				}

				console.log("[useUserProgressValidation] Current user progress:", userProgress);

				// Additional validation could be performed here if needed
			} catch (err) {
				console.error("[useUserProgressValidation] Error validating topic progress:", err);
			}
		}

		validateTopicProgress();
	}, [userId, selectedCourseId]);
}
