import React from "react";
import { useNavigate } from "react-router-dom";
import { LearningActivity } from "@/types/activity";
import { useReviewFlow } from "@/hooks/review/useReviewFlow";
import { useUserContext } from "@/contexts/UserContext";
import LoadingState from "@/components/loading/LoadingState";
import ErrorState from "@/components/test/ErrorState";
import ReviewEmptyState from "@/components/review/empty/ReviewEmptyState";
import ActivityContainer from "@/components/activities/layout/ActivityContainer";
import ReviewSuccessScreen from "@/components/review/success/ReviewSuccessScreen";

interface ReviewFlowProps {
	onComplete: () => void;
}

/**
 * This component handles the review flow.
 * It manages review-specific state and logic, then delegates rendering to `ActivityContainer`.
 *
 * The component handles:
 * - Review state management via `useReviewFlow` hook
 * - Loading and error states
 * - Success screen when review is completed
 * - Delegating to `ActivityContainer` for activity display
 */
const ReviewFlow: React.FC<ReviewFlowProps> = ({ onComplete }) => {
	const navigate = useNavigate();
	const { user } = useUserContext();

	// Review session state
	const reviewFlow = useReviewFlow(user!.id);

	if (reviewFlow.error) {
		return <ErrorState onClose={() => navigate("/learn")} />;
	}

	if (reviewFlow.isLoading) {
		console.log("⏳ [ReviewFlow] Loading review activities...");
		return <LoadingState showTrivia={false} message="Loading review activities..." />;
	}

	// Check for empty activities after loading is complete
	if (!reviewFlow.reviewActivities || reviewFlow.reviewActivities.length === 0) {
		return <ReviewEmptyState />;
	}

	// If user has completed all review activities
	if (reviewFlow.reviewCompleted) {
		return (
			<ReviewSuccessScreen
				onContinue={() => {
					// Review completed, so we call the parent's (ActivityFlow) 'onComplete' callback which sets 'showReview' to false
					onComplete();
				}}
			/>
		);
	}

	// If current activity index is invalid
	if (!reviewFlow.reviewActivities[reviewFlow.currentActivityIndex]) {
		console.error(
			"[ReviewFlow] No review activity found at index",
			reviewFlow.currentActivityIndex,
			"total activities:",
			reviewFlow.reviewActivities.length
		);
		return <ErrorState onClose={() => navigate("/learn")} />;
	}

	const currentReviewActivity: LearningActivity =
		reviewFlow.reviewActivities[reviewFlow.currentActivityIndex];
	const currentReviewActivityExplanation = currentReviewActivity?.explanation || "";

	// Render the current review activity
	console.log("🔍 [ReviewFlow] Rendering review flow");
	return (
		<div className="w-full max-w-3xl mx-auto px-4 pt-8 pb-20">
			<ActivityContainer
				activity={currentReviewActivity}
				currentActivityIndex={reviewFlow.currentActivityIndex}
				totalActivities={reviewFlow.reviewActivities.length}
				selectedAnswer={reviewFlow.selectedAnswer}
				showFeedback={reviewFlow.showFeedback}
				isCorrect={reviewFlow.isCorrect}
				onAnswer={reviewFlow.handleAnswerActivity}
				onAdvance={reviewFlow.handleAdvanceActivity}
				onSkip={async () => {
					await reviewFlow.handleSkipReview(); // Marks remaining activities as skipped in the database (if any)
					onComplete(); // Sets review visibility to false
				}}
				explanation={currentReviewActivityExplanation}
				flowType="review"
			/>
		</div>
	);
};

export default ReviewFlow;
