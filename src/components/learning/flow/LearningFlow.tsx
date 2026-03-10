import React from "react";
import { useNavigate } from "react-router-dom";
import { useLearningFlow } from "@/hooks/learning/useLearningFlow";
import { useCurrentTopic } from "@/hooks/topic/useCurrentTopic";
import { useUserContext } from "@/contexts/UserContext";
import LoadingState from "@/components/loading/LoadingState";
import ErrorState from "@/components/test/ErrorState";
import LearningEmptyState from "@/components/learning/empty/LearningEmptyState";
import LearningSuccessScreen from "@/components/learning/success/LearningSuccessScreen";
import ActivityContainer from "@/components/activities/layout/ActivityContainer";
import LearningProgressBar from "@/components/learning/flow/LearningProgressBar";

interface LearningFlowProps {
	topicId: string | undefined;
	initialActivityIndex: number;
	showTrivia: boolean;
}

/**
 * Component for handling the normal (topic) learning flow
 *
 * This component manages learning-specific state and logic, then delegates rendering to ActivityContainer.
 *
 * Responsibilities:
 * - Learning state management via 'useLearningFlow' hook
 * - Activity rendering via ActivityContainer
 * - Progress tracking via LearningProgressBar
 * - Success state handling via LearningSuccessScreen
 * - Error and loading state management
 */
const LearningFlow: React.FC<LearningFlowProps> = ({ topicId, showTrivia }) => {
	const navigate = useNavigate();

	// Get user data from global context
	const { user } = useUserContext();

	// Fetch the topic's activities and current progress
	const { data, isLoading, error } = useCurrentTopic(topicId, user!.id); // ProtectedRoute guarantees user is available
	const activities = data?.topicActivities || [];
	const currentActivityIndex = data?.currentActivityIndex || 0;

	// Determine what content to show (i.e. next topic or next level test) to the user after they complete a topic
	// TODO: These are not used anywhere. How do we use them?
	// const { nextTopic, nextLevelTest } = useNextContent(topicId);

	// Hook that manages the complete learning flow for a topic
	const {
		learningCompleted,
		currentActivityIndex: learningCurrentIndex,
		selectedAnswer,
		showFeedback,
		isCorrect,
		isCheckingCompletionStatus,
		handleAnswerActivity,
		handleAdvanceActivity,
	} = useLearningFlow({
		activities,
		topicId,
		initialActivityIndex: currentActivityIndex,
		userId: user!.id,
	});

	// EARLY RETURNS: Handle error and empty states
	if (!topicId) {
		return <LoadingState showTrivia={showTrivia} message="Loading topic..." />;
	}

	if (error) {
		return <ErrorState onClose={() => navigate("/learn")} />;
	}

	if (!activities || activities.length === 0) {
		return <LearningEmptyState />;
	}

	// LOADING STATE: Show loading while data is being fetched
	if (isLoading || isCheckingCompletionStatus) {
		console.log(
			"[LearningFlow] ⏳ Loading state - isLoading:",
			isLoading,
			"isCheckingCompletionStatus:",
			isCheckingCompletionStatus
		);
		return <LoadingState showTrivia={showTrivia} message="Loading learning activities..." />;
	}

	// LEARNING COMPLETION: If user has completed all activities
	if (learningCompleted) {
		return <LearningSuccessScreen topicId={topicId} />;
	}

	// Get the current activity and its explanation
	const currentActivity = activities[learningCurrentIndex];
	const currentExplanation = currentActivity?.explanation || "";

	// RENDER LEARNING ACTIVITY: Show the current learning activity
	console.log("[LearningFlow] 📚 Rendering learning flow");

	return (
		<>
			{/* Progress bar at the very top of the page */}
			{activities.length > 0 && (
				<div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
					<LearningProgressBar
						currentIndex={learningCurrentIndex}
						totalCount={activities.length}
						showFeedback={false} // This will be managed by ActivityFlow
						className="px-4 py-2"
					/>
				</div>
			)}

			<div className="w-full max-w-3xl mx-auto px-4 pt-8 pb-20">
				<ActivityContainer
					activity={currentActivity}
					currentActivityIndex={learningCurrentIndex}
					totalActivities={activities.length}
					selectedAnswer={selectedAnswer}
					showFeedback={showFeedback}
					isCorrect={isCorrect}
					onAnswer={handleAnswerActivity}
					onAdvance={handleAdvanceActivity}
					explanation={currentExplanation}
					flowType="topic"
				/>
			</div>
		</>
	);
};

export default LearningFlow;
