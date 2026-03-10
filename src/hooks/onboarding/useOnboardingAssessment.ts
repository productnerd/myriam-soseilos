import { useState, useCallback } from "react";
import { useSoundEffect } from "@/hooks/ui/useSoundEffect";
import { useOnboardingActivities } from "./useOnboardingActivities";
import { supabase } from "@/integrations/supabase/client";
import { createAnswerHandler, createAdvanceHandler } from "@/utils/activities/activityFlowHandling";

/**
 * This hook manages the onboarding assessment flow, including:
 * - Loading onboarding activities from the database
 * - Activity progression and state management
 * - Answer handling and feedback display
 * - Score tracking and assessment completion
 * - Auto-advance with timeout
 *
 * It uses the centralized activityFlowHandling utilities for core logic,
 * then wraps them with onboarding-specific functionality:
 *
 * 1. Core Logic (from activityFlowHandling):
 *    - Answer validation and correctness checking
 *    - State updates (selected answer, feedback, correctness)
 *    - Activity advancement and completion detection
 *
 * 2. Onboarding-Specific Logic (added by this hook):
 *    - Loading onboarding activities from database
 *    - Score tracking for correct answers
 *    - Auto-advance after 3 seconds
 *    - Assessment result saving to user profile
 *    - Sound effects
 *    - Processing state management (prevents rapid clicks)
 *
 * @param userId - The ID of the authenticated user
 */
export function useOnboardingAssessment(userId: string) {
	const { activities, isLoading, error } = useOnboardingActivities();

	// Core assessment state - managed by this hook
	const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [showFeedback, setShowFeedback] = useState<boolean>(false);
	const [isCorrect, setIsCorrect] = useState<boolean>(false);
	const [testCompleted, setTestCompleted] = useState<boolean>(false);
	const [score, setScore] = useState<number>(0);
	const [finalScore, setFinalScore] = useState<number>(0);
	const [isProcessingAdvance, setIsProcessingAdvance] = useState<boolean>(false);

	const { playSound } = useSoundEffect();

	/**
	 * State update function for the `activityFlowHandling` utilities
	 * This function allows the utilities to update our hook's state
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
	 * Onboarding-specific answer processing logic
	 * This callback adds onboarding-specific functionality:
	 * - Sound effects
	 * - Score tracking for correct answers
	 * - Auto-advance after 3 seconds
	 */
	const onAnswer = useCallback(
		async (isCorrect: boolean) => {
			// Play sound based on correctness
			try {
				playSound(isCorrect);
			} catch (error) {
				console.error("Error playing sound:", error);
			}

			// Update score for correct answers
			if (isCorrect) {
				setScore((prev) => prev + 1);
			}

			// Auto-advance after 3 seconds
			setTimeout(() => {
				handleAdvanceActivity();
			}, 3000);
		},
		[playSound]
	);

	/**
	 * Answer handler using the centralized utility
	 * The utility handles core logic, and this callback adds onboarding-specific functionality
	 */
	const handleAnswerActivity = createAnswerHandler(
		activities,
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
	 * Reset function to completely reset the assessment state
	 * Used when restarting the assessment or returning to it later
	 */
	const resetAssessmentState = useCallback(() => {
		setCurrentActivityIndex(0);
		setSelectedAnswer("");
		setShowFeedback(false);
		setIsCorrect(false);
		setScore(0);
		setTestCompleted(false);
		setFinalScore(0);
		setIsProcessingAdvance(false);
	}, []);

	/**
	 * Completion function for the `activityFlowHandling` utilities
	 * This function handles marking the assessment as completed
	 */
	const onComplete = useCallback(async () => {
		// Calculate final score percentage
		const totalQuestions = activities?.length || 0;
		const scorePercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
		setFinalScore(scorePercentage);
		setTestCompleted(true);

		// Save onboarding assessment result to user profile if authenticated

		await saveAssessmentResult(scorePercentage);

		// Reset assessment state after completion to clean up memory
		// This prevents stale state if the user returns to the assessment later
		resetAssessmentState();
	}, [activities?.length, score, userId, resetAssessmentState]);

	/**
	 * Advance handler using the centralized utility with onboarding-specific processing
	 * The utility handles core advancement logic, and this wrapper adds processing state management
	 */
	const baseAdvanceHandler = createAdvanceHandler(
		activities,
		currentActivityIndex,
		isProcessingAdvance,
		updateState,
		onAdvance,
		onComplete
	);

	/**
	 * Onboarding-specific: Wrap the base advance handler with processing state management
	 * This prevents multiple rapid clicks and provides visual feedback
	 */
	const handleAdvanceActivity = useCallback(() => {
		// Prevent multiple rapid clicks
		if (isProcessingAdvance) {
			return;
		}

		setIsProcessingAdvance(true);

		try {
			// Call the base advance handler
			baseAdvanceHandler();
		} catch (error) {
			console.error("Error in handleAdvance:", error);
		} finally {
			setTimeout(() => {
				setIsProcessingAdvance(false);
			}, 150);
		}
	}, [isProcessingAdvance, baseAdvanceHandler]);

	/**
	 * Save assessment result to user profile
	 */
	const saveAssessmentResult = async (scorePercentage: number) => {
		try {
			const { error } = await supabase.from("user_messages").insert({
				user_id: userId,
				title: "Onboarding Assessment Completed",
				payload: `You scored ${scorePercentage}% on your initial life skills assessment.`,
				tag: "assessment",
				is_read: false,
			});

			if (error) {
				console.error("Error saving assessment result:", error);
			}
		} catch (err) {
			console.error("Error in saveAssessmentResult:", err);
		}
	};

	return {
		activities,
		isLoading,
		error,
		currentActivityIndex,
		selectedAnswer,
		showFeedback,
		isCorrect,
		testCompleted,
		finalScore,
		handleAnswerActivity,
		handleAdvanceActivity,
	};
}
