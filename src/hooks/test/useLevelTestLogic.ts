import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { saveTestResults } from "@/utils/test/results";
import { toast } from "sonner";
import { handleLevelTestResult } from "@/utils/test/results/levelTestUtils";
import { createOrUpdateTestScore } from "@/utils/test/results/testScoreStorage";
import { createUserTestScore } from "@/utils/test/results/userTestScoreStorage";
import { useFocusPoints } from "@/hooks/focus/useFocusPoints";
import { useSoundEffect } from "@/hooks/ui/useSoundEffect";
import { calculateActivityTime } from "@/utils/date/readingTimeUtils";
import { useTestActivities } from "@/hooks/test/useTestActivities";
import { createAnswerHandler, createAdvanceHandler } from "@/utils/activities/activityFlowHandling";

/**
 * This hook manages the level test flow, including:
 * - Loading test activities from the database
 * - Activity progression and state management
 * - Answer handling and feedback display
 * - Timeout handling with dynamic time calculation
 * - Focus point deduction
 * - Test result saving and level unlocking
 * - Auto-advance with timeout
 *
 * It uses the centralized activityFlowHandling utilities for core logic, then wraps them with level test-specific functionality:
 * 1. Core Logic (from activityFlowHandling):
 *    - Answer validation and correctness checking
 *    - State updates (selected answer, feedback, correctness)
 *    - Activity advancement and completion detection
 *
 * 2. Level Test-Specific Logic (added by this hook):
 *    - Dynamic timeout calculation based on activity content
 *    - Focus point deduction for correct/incorrect answers
 *    - Test result saving to multiple tables
 *    - Level unlocking for passed tests
 *    - Sound effects
 *    - Processing state management (prevents rapid clicks)
 *
 * @param testId - The ID of the test
 * @param levelId - The ID of the level
 * @param userId - The ID of the authenticated user
 */
export function useLevelTestLogic(testId: string, levelId: string, userId: string) {
	const navigate = useNavigate();

	// Core test state - managed by this hook
	const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [showFeedback, setShowFeedback] = useState<boolean>(false);
	const [isCorrect, setIsCorrect] = useState<boolean>(false);
	const [testCompleted, setTestCompleted] = useState<boolean>(false);
	const [finalScore, setFinalScore] = useState<number>(0);
	const [timeRemaining, setTimeRemaining] = useState<number>(30); // Default 30 seconds
	const [completedActivities, setCompletedActivities] = useState<
		{ isCorrect: boolean; activityId: string }[]
	>([]);
	const [timeoutSource, setTimeoutSource] = useState<"answer" | "timeout" | null>(null);
	const [isProcessingAdvance, setIsProcessingAdvance] = useState<boolean>(false);

	// Related hooks for level test-specific functionality
	const { deductFocusPoints } = useFocusPoints(userId);
	const { playSound } = useSoundEffect();

	// Auto-advance after timeout or answer
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		if (completedActivities.length > 0 && timeoutSource) {
			// Different delay times for different timeout sources:
			// If the user completes an activity, wait 3 seconds
			// If the user runs out of time, wait 2 seconds
			const delay = timeoutSource === "answer" ? 3000 : 2000;

			timeoutId = setTimeout(() => {
				handleAdvanceActivity();
			}, delay);
		}
		return () => clearTimeout(timeoutId);
	}, [completedActivities, timeoutSource]);

	// Fetch test activities
	const { data, isLoading, error: activitiesError, refetch } = useTestActivities(testId);

	const testActivities = data || [];

	// Log when testActivities changes
	useEffect(() => {
		console.debug(`testActivities updated: ${testActivities.length} activities loaded`);
	}, [testActivities]);

	// Calculate the current activity's completion time
	// This runs every time the user moves to the next activity (i.e. currentActivityIndex changes)
	useEffect(() => {
		if (testActivities?.[currentActivityIndex]) {
			const currentActivity = testActivities[currentActivityIndex];
			const calculatedTime = calculateActivityTime(
				{
					main_text: currentActivity.main_text,
					options: currentActivity.options,
				},
				15 // Base reading speed in words per minute
			);
			setTimeRemaining(calculatedTime);
		}
	}, [testActivities, currentActivityIndex]);

	// Log errors
	useEffect(() => {
		if (activitiesError) {
			console.error("Error loading level test activities:", activitiesError);
			toast.error(
				"Error loading test: " +
					(activitiesError instanceof Error ? activitiesError.message : "Unknown error")
			);
		}
	}, [activitiesError]);

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
	 * Level test-specific answer processing logic
	 * This callback adds level test-specific functionality:
	 * - Sound effects
	 * - Focus point deduction
	 * - Completed activities tracking
	 * - Timeout source setting for auto-advance
	 */
	const onAnswer = useCallback(
		async (isCorrect: boolean, activity: any) => {
			// Play sound based on correctness
			try {
				playSound(isCorrect);
			} catch (error) {
				console.error("Error playing sound:", error);
			}

			// Deduct focus points based on correctness
			deductFocusPoints(isCorrect)
				.then((newBalance) => {
					console.debug("Focus points deducted, new balance:", newBalance);
				})
				.catch((err) => {
					console.error("Failed to deduct focus points:", err);
				});

			// Track completed activities for score calculation
			setCompletedActivities((prev) => [
				...prev,
				{
					isCorrect: isCorrect,
					activityId: activity.id,
				},
			]);

			// Set timeout source for auto-advance
			setTimeoutSource("answer");
		},
		[playSound, deductFocusPoints]
	);

	/**
	 * Answer handler using the centralized utility
	 * The utility handles core logic, and this callback adds level test-specific functionality
	 */
	const handleAnswerActivity = createAnswerHandler(
		testActivities,
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
		setSelectedAnswer("");
		setShowFeedback(false);
	}, []);

	/**
	 * Reset function to completely reset the level test state
	 * Used when restarting the test or returning to it later
	 */
	const resetLevelTestState = useCallback(() => {
		setCurrentActivityIndex(0);
		setSelectedAnswer("");
		setShowFeedback(false);
		setIsCorrect(false);
		setTestCompleted(false);
		setFinalScore(0);
		setCompletedActivities([]);
		setTimeoutSource(null);
		setIsProcessingAdvance(false);
	}, []);

	/**
	 * Completion function for the `activityFlowHandling` utilities
	 * This function handles marking the level test as completed
	 */
	const onComplete = useCallback(async () => {
		// CRITICAL FIX: Calculate score only after all activities are completed including the last one
		// This ensures we have processed the last answer before calculating the score
		const correctAnswers = completedActivities.filter((a) => a.isCorrect).length;
		const totalQuestions = testActivities?.length || 0;

		const score = Math.min(100, Math.round((correctAnswers / totalQuestions) * 100));

		console.log("Level test completed - calculating score:", {
			correctAnswers,
			totalQuestions,
			completedActivitiesCount: completedActivities.length,
			calculatedScore: score,
		});

		setFinalScore(score);
		setTestCompleted(true);

		// Only save results when we have a valid user session
		if (!userId) {
			console.error("No authenticated user found when trying to save level test results");
			toast.error("Failed to save test results - not authenticated");
			return;
		}

		console.log("Saving test results for authenticated user:", userId);

		// Always directly save to test_scores table
		console.log("Saving directly to test_scores table with:", {
			testId: testId,
			userId: userId,
			score,
			passed: score >= 80,
		});

		createOrUpdateTestScore(testId, userId, score, score >= 80).catch((err) => {
			console.error("Exception saving to test_scores:", err);
			toast.error("Error: Test score was not properly recorded. Please try again.", {
				id: "test-score-error",
			});
		});

		// Also create a record in user_test_scores table using the specialized function
		createUserTestScore(
			testId,
			userId,
			score,
			score >= 80,
			false // Not skipped
		)
			.then((success) => {
				if (success) {
					console.log(
						"Successfully saved to user_test_scores using createUserTestScore function"
					);
				} else {
					console.error("Failed to save to user_test_scores");
					toast.error("Error: User test score was not properly recorded.", {
						id: "user-test-score-error",
					});
				}
			})
			.catch((err) => {
				console.error("Exception saving to user_test_scores:", err);
			});

		// Only call saveTestResults if we have both a test ID and a level ID
		console.log("Calling saveTestResults with:", {
			testId: testId,
			levelId: levelId,
			correctAnswers,
			totalQuestions,
			passed: score >= 80,
		});

		try {
			saveTestResults({
				userId: userId,
				testId: testId,
				score,
				passed: score >= 80,
				answers: completedActivities.map((activity) => ({
					activityId: activity.activityId,
					selectedAnswer: "", // We don't track selected answers in level tests
					isCorrect: activity.isCorrect,
				})),
				isLevelTest: true,
			})
				.then((success) => {
					if (success) {
						console.log("Level test results saved successfully");

						if (score >= 80) {
							console.log("Test passed, triggering level unlock");
							handleLevelTestResult(userId, testId, levelId, true).catch((err) => {
								console.error("Failed to handle level test result:", err);
							});
						}
					} else {
						console.error("Failed to save level test results");
						toast.error("Failed to save test results. Please try again.", {
							id: "save-results-error",
						});
					}
				})
				.catch((err) => {
					console.error("Exception while saving level test results:", err);
				});
		} catch (err) {
			console.error("Exception in saveTestResults:", err);
		}

		// Reset level test state after completion to clean up memory
		// This prevents stale state if the user returns to the test later
		resetLevelTestState();

		// Navigate to learn page after completion
		navigate("/learn");
	}, [
		completedActivities,
		testActivities?.length,
		userId,
		testId,
		levelId,
		resetLevelTestState,
		navigate,
	]);

	/**
	 * Advance handler using the centralized utility with level test-specific processing
	 * The utility handles core advancement logic, and this wrapper adds processing state management
	 */
	const baseAdvanceHandler = createAdvanceHandler(
		testActivities,
		currentActivityIndex,
		isProcessingAdvance,
		updateState,
		onAdvance,
		onComplete
	);

	/**
	 * Level test-specific: Wrap the base advance handler with processing state management
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
	 * Handle timeout for current activity
	 * This is level test-specific functionality for handling timeouts
	 */
	const handleTimeout = useCallback(() => {
		if (!testActivities || currentActivityIndex >= testActivities.length) return;

		const currentActivity = testActivities[currentActivityIndex];

		setSelectedAnswer(""); // Clear the selected answer
		setIsCorrect(false); // Mark as incorrect (timeout = wrong answer)
		setShowFeedback(true); // Show feedback (so user sees they ran out of time)

		// Play incorrect sound for timeout
		try {
			playSound(false);
		} catch (error) {
			console.error("Error playing sound:", error);
		}

		// Deduct focus points for timeout (always wrong)
		deductFocusPoints(false)
			.then((newBalance) => {
				console.debug("Focus points deducted for timeout, new balance:", newBalance);
			})
			.catch((err) => {
				console.error("Failed to deduct focus points for timeout:", err);
			});

		// Record this activity as completed (incorrect)
		setCompletedActivities((prev) => [
			...prev,
			{
				isCorrect: false,
				activityId: currentActivity.id,
			},
		]);

		setTimeoutSource("timeout");
	}, [testActivities, currentActivityIndex, playSound, deductFocusPoints]);

	// TODO: This is not used anywhere
	const handleRetryTest = async () => {
		try {
			// Reset state
			resetLevelTestState();

			// Refetch activities
			await refetch();
		} catch (error) {
			console.error("Error restarting level test:", error);
			toast.error("Failed to restart the test");
		}
	};

	return {
		testActivities,
		isLoading,
		currentActivityIndex,
		selectedAnswer,
		showFeedback,
		isCorrect,
		testCompleted,
		finalScore,
		timeRemaining,
		handleTimeout,
		handleAnswerActivity,
		handleAdvanceActivity,
	};
}
