import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hasReviewActivities } from "@/utils/review/reviewUtils";

/**
 * This hook determines whether the user has activities due for review.
 * If they do, it determines whether they should review that content (based on time window).
 *
 * Review Logic:
 * 1. Check if user has completed a review in the last 24 hours
 * 2. If not, check if they have activities due for review
 * 3. If they do, trigger review mode via callback
 *
 * @param userId - The ID of the authenticated user (always available via global context)
 * @param onReviewAvailable - Callback function that gets called with true/false
 * @returns Whether the review check is still in progress
 */
export function useReviewAvailable(
	userId: string,
	onReviewAvailable: (hasReview: boolean) => void
) {
	const [isCheckingReview, setIsCheckingReview] = useState<boolean>(true);
	const hasInitialCheckRun = useRef<boolean>(false);

	const checkReview = useCallback(async () => {
		console.log("[useReviewAvailable] 🔍 Starting review check");

		try {
			// Ensure we're in checking state
			setIsCheckingReview(true);

			// Step 1: Check when the user last completed a review
			const { data } = await supabase
				.from("user_review_activities")
				.select("last_review")
				.eq("user_id", userId)
				.order("last_review", { ascending: false })
				.limit(1)
				.single();

			const now = new Date();
			const lastReviewDate = data?.last_review ? new Date(data.last_review) : null;
			const hoursSinceLastReview = lastReviewDate
				? (now.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60)
				: 24; // If the user has never completed a review before, we treat this as they've done one 24h ago

			console.log("[useReviewAvailable] 🔍 Hours since last review:", hoursSinceLastReview);

			// Step 2: Only show review if it's been more than 24h since last review
			// TODO: For testing, set this to a very low number
			if (hoursSinceLastReview >= 24) {
				const reviewAvailable = await hasReviewActivities(userId);
				console.log(
					"[useReviewAvailable] 🔍 Review activities available:",
					reviewAvailable
				);
				onReviewAvailable(reviewAvailable);
			} else {
				console.log(
					"[useReviewAvailable] 🔍 Skipping review - last review was",
					hoursSinceLastReview,
					"hours ago (need 24h)"
				);
				onReviewAvailable(false);
			}
		} catch (error) {
			console.error("[useReviewAvailable] 🔍 Error checking for review activities:", error);
			onReviewAvailable(false); // Always continue to normal content if there's an error checking for reviews
		} finally {
			setIsCheckingReview(false);
			console.log("[useReviewAvailable] Review check finished");
		}
	}, [userId, onReviewAvailable]);

	// Run the review check immediately when the component mounts
	useEffect(() => {
		if (!hasInitialCheckRun.current) {
			console.log("🔍 [useReviewCheck] Running initial check");
			hasInitialCheckRun.current = true;
			checkReview();
		}
	}, [checkReview]);

	return { isCheckingReview };
}
