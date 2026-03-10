import React, { useState, memo, useCallback } from "react";
import LoadingState from "@/components/loading/LoadingState";
import { useReviewAvailable } from "@/hooks/review/useReviewAvailable";
import ReviewFlow from "@/components/review/flow/ReviewFlow";
import LearningFlow from "@/components/learning/flow/LearningFlow";
import { useUserContext } from "@/contexts/UserContext";

interface ActivityFlowProps {
	topicId: string | undefined;
	initialActivityIndex?: number;
	showTrivia?: boolean;
}

/**
 * Main orchestrator component for the learning experience
 *
 * This component focuses solely on flow orchestration and delegates the actual flow logic and data fetching to ReviewFlow and LearningFlow components
 *
 * This component can render in two modes:
 * 1. Review Mode - When user has activities due for review
 * 2. Normal Learning Mode - When user is learning new content
 *
 * Flow:
 * 1. Component mounts with 'topicId'
 * 2. 'useReviewAvailable' determines if review is needed
 * 3. If review needed -> show ReviewFlow
 * 4. If no review needed -> show LearningFlow
 *
 */
const ActivityFlow: React.FC<ActivityFlowProps> = ({
	topicId,
	initialActivityIndex = 0,
	showTrivia = false,
}) => {
	// Get user data from global context
	const { user } = useUserContext();

	// State to control whether we're in review mode or normal learning mode
	const [showReview, setShowReview] = useState<boolean>(false);

	// Force refresh counter to trigger re-renders when needed
	const [forceRefresh, setForceRefresh] = useState<number>(0);

	// Callback function that sets the review mode state
	const handleReviewAvailable = useCallback((hasReview: boolean) => {
		console.log("[ActivityFlow] 🔍 Review available:", hasReview);
		setShowReview(hasReview);
	}, []);

	// Hook that checks if the user has activities due for review and if they should review that content
	const { isCheckingReview } = useReviewAvailable(user!.id, handleReviewAvailable);

	/**
	 * Handler for when review is completed or skipped
	 * Switches back to normal learning mode and re-checks for review availability
	 */
	const handleReviewCompleted = useCallback(() => {
		console.log(
			"[ActivityFlow] 🔍 Review complete callback triggered, returning to learning flow"
		);
		setShowReview(false);
		setForceRefresh((prev) => prev + 1);
	}, []);

	console.log(
		"[ActivityFlow] ActivityFlow render - showReview:",
		showReview,
		"isCheckingReview:",
		isCheckingReview
	);

	// REVIEW MODE: Render the review flow
	if (showReview) {
		console.log("[ActivityFlow] 🔍 Entering review mode");
		return (
			<ReviewFlow key={`review-flow-${forceRefresh}`} onComplete={handleReviewCompleted} />
		);
	}

	// If checking for review, show a loading state
	if (isCheckingReview) {
		console.log("[ActivityFlow] ⏳ Checking for review activities...");
		return <LoadingState showTrivia={showTrivia} message="Checking for review activities..." />;
	}

	// NORMAL LEARNING MODE: Render the learning flow
	console.log("[ActivityFlow] 📚 Entering normal learning mode");
	return (
		<LearningFlow
			key={`learning-flow-${forceRefresh}`}
			topicId={topicId}
			initialActivityIndex={initialActivityIndex}
			showTrivia={showTrivia}
		/>
	);
};

// Memoize to prevent unnecessary re-renders
export default memo(ActivityFlow);
