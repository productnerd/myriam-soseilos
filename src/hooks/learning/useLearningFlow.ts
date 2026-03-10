import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Activity } from "@/types/activity";
import { supabase } from "@/integrations/supabase/client";
import { useSoundEffect } from "@/hooks/ui/useSoundEffect";
import { useFocusPoints } from "@/hooks/focus/useFocusPoints";
import { useActivityStreak } from "@/hooks/activity/useActivityStreak";
import { shouldActivityCountForStreakAndFocus } from "@/utils/activities/activityScoring";
import { saveUserProgress } from "@/utils/learning/saveUserProgress";
import { completeTopicAndProgress } from "@/utils/topic/topicCompletion";
import { addActivityToReviewSystem } from "@/utils/learning/addToReview";
import { createAnswerHandler, createAdvanceHandler } from "@/utils/activities/activityFlowHandling";

interface UseLearningFlowProps {
	activities: Activity[]; // Array of activities for the current topic
	topicId?: string; // ID of the current topic being learned
	initialActivityIndex?: number; // Starting activity index (for resuming progress)
	userId: string; // ID of the user (always available via global context)
}

/**
 * Hook that manages the complete learning flow for a topic.
 *
 * This hook orchestrates the learning experience by:
 * 1. Managing activity state (current activity, answers, feedback)
 * 2. Handling user progression and answering of activities
 * 3. Saving progress to the database
 * 4. Marking topics as completed
 * 5. Managing learning-specific features (sounds, focus points, streaks)
 */
export function useLearningFlow({
	activities,
	topicId,
	initialActivityIndex = 0,
	userId,
}: UseLearningFlowProps) {
	const navigate = useNavigate();

	// Loading state while checking if topic is already completed
	const [isCheckingCompletionStatus, setIsCheckingCompletionStatus] = useState<boolean>(true);
	// Use a ref to track if we've shown the toast for this topic (handles Strict Mode double execution)
	const hasShownToastRef = useRef<Set<string>>(new Set());

	// ===== CORE LEARNING STATE =====
	// These state variables manage the current learning session
	const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(initialActivityIndex);
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [showFeedback, setShowFeedback] = useState<boolean>(false);
	const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined); // Allow 'undefined' for non-gradable activities (polls, surveys etc.)
	const [learningCompleted, setLearningCompleted] = useState<boolean>(false);

	// ===== LEARNING-SPECIFIC HOOKS =====
	// These hooks provide learning-specific functionality
	const { playSound } = useSoundEffect();
	const { deductFocusPoints } = useFocusPoints(userId);
	const { handleActivityResult } = useActivityStreak(userId);

	/**
	 * TODO: The topicId passed to the hook (from the URL) is a topic that is in progress (determined on user progress) - this hook seems redundant?
	 * Check if the topic has already been completed.
	 * This is a learning-specific logic to prevent users from retaking topics they've already completed.
	 *
	 * Flow:
	 * 1. Check 'user_completed_topics' table for this topic
	 * 2. If found, show toast and navigate back to learn page
	 * 3. If not found, allow access to the topic
	 */
	useEffect(() => {
		const checkIfTopicCompleted = async () => {
			if (!userId || !topicId) {
				setIsCheckingCompletionStatus(false);
				return;
			}

			console.debug("[useLearningFlow] Checking if topic already completed:", topicId);

			try {
				// Check if this topic has already been completed by the user
				const { data: completedTopic, error: completedTopicError } = await supabase
					.from("user_completed_topics")
					.select("id, created_at")
					.eq("user_id", userId)
					.eq("topic_id", topicId)
					.maybeSingle();

				if (completedTopicError) {
					console.error(
						"[useLearningFlow] Error checking topic completion status:",
						completedTopicError
					);
					setIsCheckingCompletionStatus(false);
					return;
				}

				// If topic is already completed, navigate back to learn page with notification
				if (completedTopic) {
					console.debug("[useLearningFlow] Topic already completed:", completedTopic);

					// Only show toast if we haven't shown it for this topic yet
					if (!hasShownToastRef.current.has(topicId)) {
						toast.info("This topic has already been completed");
						hasShownToastRef.current.add(topicId);
					}

					navigate("/learn");
					return;
				}

				console.debug("[useLearningFlow] Topic not previously completed, allowing access");
				setIsCheckingCompletionStatus(false);
			} catch (error) {
				console.error("[useLearningFlow] Error in checkIfTopicCompleted:", error);
				setIsCheckingCompletionStatus(false);
			}
		};

		checkIfTopicCompleted();
	}, [topicId, userId]);

	/**
	 * State update function for the utilities
	 *
	 * This function allows the centralized utilities (`activityFlowHandling`) to update our hook's state.
	 * The utilities call this function to update 'selectedAnswer', 'showFeedback', and 'isCorrect'.
	 */
	const updateState = useCallback(
		(updates: { selectedAnswer?: string; showFeedback?: boolean; isCorrect?: boolean }) => {
			if (updates.selectedAnswer !== undefined) setSelectedAnswer(updates.selectedAnswer);
			if (updates.showFeedback !== undefined) setShowFeedback(updates.showFeedback);
			if (updates.isCorrect !== undefined) setIsCorrect(updates.isCorrect);
		},
		[]
	);

	/**
	 * This is a callback function that is called (by the centralized utilities) after an answer is processed (core logic).
	 * It adds learning-specific functionality:
	 * - Play sound effects based on correctness
	 * - Deduct focus points for scoring activities
	 * - Update activity streaks
	 *
	 * @param isCorrect - Whether the answer was correct
	 * @param activity - The activity that was answered
	 */
	const onAnswer = async (isCorrect: boolean, activity: Activity) => {
		// Play sound based on correctness
		try {
			playSound(isCorrect);
		} catch (error) {
			console.error("[useLearningFlow] Error playing sound:", error);
		}

		if (shouldActivityCountForStreakAndFocus(activity)) {
			// Handle focus deduction for scoring activities
			try {
				await deductFocusPoints(isCorrect);
				console.log("[useLearningFlow] Focus points deducted successfully");
			} catch (error) {
				console.error(
					"[useLearningFlow] Failed to deduct focus points in learning:",
					error
				);
			}

			// Add activity to review system if it's a scoring activity
			try {
				await addActivityToReviewSystem(userId, activity.id, isCorrect);
				console.log("[useLearningFlow] Activity added to review system:", activity.id);
			} catch (error) {
				console.error("[useLearningFlow] Failed to add activity to review system:", error);
			}
		}

		// Update the user's learning progress [current topic and activity ID, next activity ID (if there is one)]
		if (activities && activities.length > 0 && topicId) {
			const nextActivityIndex = currentActivityIndex + 1;
			const nextActivity =
				nextActivityIndex < activities.length ? activities[nextActivityIndex] : null;

			try {
				await saveUserProgress({
					topicId: topicId,
					currentActivityId: activity.id,
					nextActivityId: nextActivity?.id || null,
					userId: userId,
				});
				console.log("[useLearningFlow] User progress saved successfully");
			} catch (error) {
				console.error("[useLearningFlow] Failed to save user progress:", error);
			}
		}

		// Handle activity streak (for all applicable activities)
		handleActivityResult(isCorrect, activity);
	};

	/**
	 * This is the main handler for when the user answers an activity.
	 *
	 * It uses the centralized utility to handle core answering logic:
	 * - Answer validation
	 * - State updates via 'updateState'
	 * - Correctness checking
	 *
	 * It then adds the learning-specific functionality via the 'onAnswer' callback.
	 */
	const handleAnswerActivity = createAnswerHandler(
		activities,
		currentActivityIndex,
		showFeedback,
		updateState,
		onAnswer
	);

	/**
	 * This is a callback function that is called (by the centralized utilities) when the user advances to the next activity.
	 * It handles moving to the next activity (increments current index).
	 */
	const onAdvance = useCallback((nextIndex: number) => {
		setCurrentActivityIndex(nextIndex);
	}, []);

	/**
	 * This is a callback function that is called (by the centralized utilities) when all activities are finished.
	 * It handles marking the learning flow as completed and updating the topic progress.
	 *
	 * This function uses atomic database operations to ensure data integrity.
	 */
	const onComplete = useCallback(async () => {
		setLearningCompleted(true);

		// Mark the topic as completed and update progress
		if (topicId && userId) {
			try {
				console.log(
					`[useLearningFlow] Marking topic ${topicId} as completed with atomic transaction`
				);

				// This function performs all topic completion operations atomically:
				// - Marks topic as completed
				// - Updates user progress to next topic or level completion
				// - Handles all edge cases (already completed, level completion, etc.)
				// - Either succeeds completely or fails completely
				const success = await completeTopicAndProgress(topicId, userId);

				if (success) {
					console.log(
						`[useLearningFlow] Topic ${topicId} marked as completed successfully with atomic transaction`
					);
				} else {
					console.error(`[useLearningFlow] Failed to mark topic ${topicId} as completed`);
					// Note: No fallback needed - atomic operations either succeed completely or fail completely
				}
			} catch (error) {
				console.error(
					`[useLearningFlow] Error marking topic ${topicId} as completed:`,
					error
				);
				// Note: No fallback needed - atomic operations handle all edge cases
			}
		}
	}, [topicId, userId]);

	/**
	 * This is the main handler for when the user moves to the next activity.
	 *
	 * It uses the centralized utility to handle core advancment logic:
	 * - State reset (via 'updateState')
	 * - Move to next activity
	 * - Detect completion
	 *
	 * It then adds the learning-specific functionality via the 'onAdvance' and 'onComplete' callbacks.
	 */
	const handleAdvanceActivity = createAdvanceHandler(
		activities,
		currentActivityIndex,
		false, // isProcessingAdvance - not needed for learning flow
		updateState,
		onAdvance,
		onComplete
	);

	return {
		currentActivityIndex,
		selectedAnswer,
		showFeedback,
		isCorrect,
		learningCompleted,
		isCheckingCompletionStatus,
		handleAnswerActivity,
		handleAdvanceActivity,
	};
}
