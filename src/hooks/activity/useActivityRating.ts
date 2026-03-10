import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for rating activities
 *
 * @param userId - The ID of the authenticated user
 * @returns Activity rating functions and state
 */
export function useActivityRating(userId: string) {
	const [selectedRating, setSelectedRating] = useState<boolean | null>(null);
	const [comment, setComment] = useState("");
	const [ratingStatus, setRatingStatus] = useState<"idle" | "submitting" | "success" | "error">(
		"idle"
	);

	const submitRating = async (activityId: string, isPositive: boolean, comment: string) => {
		try {
			setRatingStatus("submitting");

			const { error } = await supabase.from("community_notes").insert({
				activity_id: activityId,
				user_id: userId,
				is_positive: isPositive,
				comment: comment || null,
			});

			if (error) throw error;

			setRatingStatus("success");
			toast.success("Thank you for your feedback!");
		} catch (error) {
			console.error("Error submitting rating:", error);
			setRatingStatus("error");
			toast.error("Failed to submit feedback");
		}
	};

	return {
		selectedRating,
		comment,
		ratingStatus,
		selectRating: setSelectedRating,
		handleComment: setComment,
		submitRating,
		resetState: () => {
			setSelectedRating(null);
			setComment("");
			setRatingStatus("idle");
		},
	};
}
