/**
 * This hook manages the complete review flow, including:
 * - Loading review activities from the database
 * - Activity progression and state management
 * - Answer handling and feedback display
 * - FSRS algorithm updates
 * - Focus points and activity streaks
 *
 * It uses the centralized activityFlowHandling utilities for core logic,
 * then wraps them with review-specific functionality:
 *
 * 1. Core Logic (from activityFlowHandling):
 *    - Answer validation and correctness checking
 *    - State updates (selected answer, feedback, correctness)
 *    - Activity advancement and completion detection
 *
 * 2. Review-Specific Logic (added by this hook):
 *    - Loading review activities from database
 *    - FSRS algorithm updates for spaced repetition
 *    - Focus point deduction (but no daily activity count increment)
 *    - Activity streak handling
 *    - Sound effects
 *    - Processing state management (prevents rapid clicks)
 */

import { useState, useEffect, useCallback } from "react";
import { LearningActivity } from "@/types/activity";
import {
	fetchReviewActivities,
	updateReviewActivity,
	markReviewActivitiesAsSkipped,
} from "@/utils/review/reviewUtils";
import { useSoundEffect } from "@/hooks/ui/useSoundEffect";
import { useFocusPoints } from "@/hooks/focus/useFocusPoints";
import { useActivityStreak } from "@/hooks/activity/useActivityStreak";
import { shouldActivityCountForStreakAndFocus } from "@/utils/activities/activityScoring";
import { createAnswerHandler, createAdvanceHandler } from "@/utils/activities/activityFlowHandling";

/**
 * Hook for managing the review flow
 *
 * This hook handles all review-specific functionality:
 * - Fetching review activities
 * - Answer processing
 * - Feedback display
 * - Advancing to the next activity
 * - Focus point deduction
 * - Activity streak handling
 *
 * @param userId - The ID of the authenticated user (always available via global context)
 * @returns The review flow state and functions
 */
export function useReviewFlow(userId: string) {
	// Core review state - managed by this hook
	const [reviewActivities, setReviewActivities] = useState<LearningActivity[]>([]);
	const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [showFeedback, setShowFeedback] = useState<boolean>(false);
	const [isCorrect, setIsCorrect] = useState<boolean>(false);
	const [reviewCompleted, setReviewCompleted] = useState<boolean>(false);
	const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);

	// Loading and error states
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isProcessingAdvance, setIsProcessingAdvance] = useState<boolean>(false);

	// Related hooks for review-specific functionality
	const { playSound } = useSoundEffect();
	const { deductFocusPoints } = useFocusPoints(userId);
	const { handleActivityResult } = useActivityStreak(userId);

	/**
	 * Review-specific: Load review activities when the component mounts
	 * This fetches all activities that are due for review using the FSRS algorithm
	 */
	useEffect(() => {
		const loadReviewActivities = async () => {
			try {
				setIsLoading(true);
				console.log("[useReviewFlow] 🔄 Loading review activities");

				const activities = await fetchReviewActivities(userId);
				console.log("[useReviewFlow] 🔄 Loaded", activities.length, "review activities");

				// Set the review activities in state
				setReviewActivities(activities);
			} catch (err) {
				console.error("[useReviewFlow] Error loading review activities:", err);
				setError(err instanceof Error ? err.message : String(err));
				setReviewCompleted(false);
			} finally {
				setIsLoading(false);
			}
		};

		loadReviewActivities();
	}, [userId]);

	/**
	 * State update function for the `activityFlowHandling` utilities
	 * This function allows the utilities to update the hook's state
	 */
	const updateState = useCallback(
		(updates: { selectedAnswer: string; showFeedback: boolean; isCorrect?: boolean }) => {
			if (updates.selectedAnswer !== undefined) setSelectedAnswer(updates.selectedAnswer);
			if (updates.showFeedback !== undefined) setShowFeedback(updates.showFeedback);
			if (updates.isCorrect !== undefined) setIsCorrect(updates.isCorrect);
		},
		[]
	);

	const onAnswer = async (isCorrect: boolean, activity: LearningActivity) => {
		// Play sound based on correctness
		try {
			playSound(isCorrect);
		} catch (error) {
			console.error("[useReviewFlow] Error playing sound:", error);
		}

		// Handle focus deduction for scoring activities (but don't increment daily activity count for review)
		if (shouldActivityCountForStreakAndFocus(activity)) {
			try {
				await deductFocusPoints(isCorrect);
				console.log("[useReviewFlow] Focus points deducted successfully");
			} catch (error) {
				console.error("[useReviewFlow] Failed to deduct focus points in review:", error);
			}
		}

		// Handle activity streak (for all applicable activities)
		handleActivityResult(isCorrect, activity);

		// Track completed activities for proper skip handling
		setCompletedActivityIds((prev) => [...prev, activity.id]);

		// Review-specific: Update the review state in the database using FSRS algorithm
		try {
			await updateReviewActivity(userId, activity.id, isCorrect);
			console.log("[useReviewFlow] Review activity updated successfully");
		} catch (err) {
			console.error("[useReviewFlow] Error updating review activity:", err);
		}
	};

	/**
	 * Answer handler using the centralized utility
	 * The utility handles core logic, and this callback adds review-specific functionality:
	 * - Sound effects
	 * - Focus point deduction (but no daily activity count increment)
	 * - Activity streak handling
	 * - FSRS algorithm updates
	 */
	const handleAnswerActivity = createAnswerHandler(
		reviewActivities,
		currentActivityIndex,
		showFeedback,
		updateState,
		onAnswer
	);

	/**
	 * Advance function for the `activityFlowHandling` utilities
	 * This function handles moving to the next activity
	 */
	const onAdvance = useCallback((nextIndex: number) => {
		setCurrentActivityIndex(nextIndex);
	}, []);

	/**
	 * Completion function for the `activityFlowHandling` utilities
	 * This function handles marking the review flow as completed
	 */
	const onComplete = useCallback(() => {
		console.log("[useReviewFlow] 🔄 Review completion triggered");
		setReviewCompleted(true);
	}, []);

	/**
	 * Advance handler using the centralized utility with review-specific processing
	 * The utility handles core advancement logic, and this wrapper adds processing state management
	 */
	const baseAdvanceHandler = createAdvanceHandler(
		reviewActivities,
		currentActivityIndex,
		isProcessingAdvance,
		updateState,
		onAdvance,
		onComplete
	);

	/**
	 * Review-specific: Wrap the base advance handler with processing state management
	 * This prevents multiple rapid clicks and provides visual feedback
	 */
	const handleAdvanceActivity = useCallback(() => {
		if (isProcessingAdvance) return; // Prevent multiple rapid clicks

		setIsProcessingAdvance(true);

		try {
			// Call the base advance handler
			baseAdvanceHandler();
		} catch (error) {
			console.error("[useReviewFlow] Error in handleAdvance:", error);
		} finally {
			setTimeout(() => {
				setIsProcessingAdvance(false);
			}, 150);
		}
	}, [isProcessingAdvance, baseAdvanceHandler]);

	// Skip review handler
	const handleSkipReview = useCallback(async () => {
		console.log("[useReviewFlow] 🔍 Marking review as skipped for this session");

		try {
			const skippedActivities = reviewActivities.filter(
				(activity) => !completedActivityIds.includes(activity.id)
			);
			await markReviewActivitiesAsSkipped(userId, skippedActivities);
			console.log("[useReviewFlow] ✅ Activities were marked as skipped");
		} catch (error) {
			console.error("[useReviewFlow] ❌ Error marking activities as skipped:", error);
		}
	}, [userId, completedActivityIds]);

	/**
	 * Reset function to completely reset the review state
	 * Used when returning to normal learning after review
	 */
	const resetReviewState = useCallback(() => {
		setCurrentActivityIndex(0);
		setSelectedAnswer("");
		setShowFeedback(false);
		setIsCorrect(false);
		setReviewCompleted(false);
		setError(null);
		setIsProcessingAdvance(false);
		setCompletedActivityIds([]);
	}, []);

	/**
	 * Cleanup effect: Reset review state when component unmounts or user changes
	 * This ensures clean state for future review sessions
	 */
	useEffect(() => {
		return () => {
			// Reset state when component unmounts or user changes
			resetReviewState();
		};
	}, [userId, resetReviewState]);

	return {
		reviewActivities,
		currentActivityIndex,
		selectedAnswer,
		showFeedback,
		isCorrect,
		reviewCompleted,
		isLoading,
		error,
		completedActivityIds,
		handleAnswerActivity,
		handleAdvanceActivity,
		handleSkipReview,
	};
}
