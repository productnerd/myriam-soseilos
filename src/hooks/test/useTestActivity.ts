import { useState, useCallback } from "react";
import { Activity } from "@/types/activity";
import { useActivityStreak } from "@/hooks/activity/useActivityStreak";
import { useFlowPointsDeduction } from "@/hooks/flow/useFlowPointsDeduction";
import { saveUserProgress } from "@/utils/learning/saveUserProgress";
import { supabase } from "@/integrations/supabase/client";

interface TestActivityState {
	activity: Activity | null;
	selectedAnswers: string[];
	showCorrectAnswer: boolean;
	showFeedback: boolean;
	isCorrect: boolean;
	activityIndex: number;
	activities: Activity[];
	isLoading: boolean;
	error: Error | null;
	isSubmitting: boolean;
	isLastActivity: boolean;
}

interface TestActivityActions {
	fetchActivities: () => Promise<void>;
	selectAnswer: (answer: string) => void;
	submitAnswer: () => Promise<void>;
	nextActivity: () => void;
	resetTest: () => void;
}

/**
 * Hook for managing test activity state and logic
 *
 * @param topicId - The ID of the topic
 * @param levelId - The ID of the level
 * @param courseId - The ID of the course
 * @param userId - The ID of the authenticated user (always available via global context)
 * @returns Test activity state and management functions
 */
export function useTestActivity(
	topicId: string,
	levelId: string,
	courseId: string,
	userId: string
): TestActivityState & TestActivityActions {
	const [activity, setActivity] = useState<Activity | null>(null);
	const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
	const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
	const [showFeedback, setShowFeedback] = useState<boolean>(false);
	const [isCorrect, setIsCorrect] = useState<boolean>(false);
	const [activityIndex, setActivityIndex] = useState<number>(0);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isLastActivity, setIsLastActivity] = useState<boolean>(false);

	const { handleActivityResult } = useActivityStreak(userId);
	const { deductFlowPoints } = useFlowPointsDeduction(userId);

	const fetchActivities = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			if (!topicId) {
				throw new Error("Topic ID is missing");
			}

			const { data, error } = await supabase
				.from("activities")
				.select("*")
				.eq("topic_id", topicId);

			if (error) {
				throw new Error(`Error fetching activities: ${error.message}`);
			}

			if (!data || data.length === 0) {
				throw new Error("No activities found for this topic.");
			}

			// Ensure activities are properly typed as Activity[]
			const typedActivities: Activity[] = data as Activity[];

			setActivities(typedActivities);
			setActivity(typedActivities[0]);
			setActivityIndex(0);
			setIsLastActivity(typedActivities.length === 1);
		} catch (err: any) {
			setError(err instanceof Error ? err : new Error("An unexpected error occurred"));
			console.error("Error fetching activities:", err);
		} finally {
			setIsLoading(false);
		}
	}, [topicId]);

	const selectAnswer = useCallback((answer: string) => {
		setSelectedAnswers([answer]);
	}, []);

	const submitAnswer = useCallback(async () => {
		setIsSubmitting(true);
		setShowFeedback(false);
		setShowCorrectAnswer(false);

		try {
			if (!activity) {
				throw new Error("No activity loaded to submit.");
			}

			const isAnswerCorrect =
				activity.correct_answer &&
				selectedAnswers.length > 0 &&
				activity.correct_answer.toLowerCase() === selectedAnswers[0].toLowerCase();

			setIsCorrect(Boolean(isAnswerCorrect));
			setShowCorrectAnswer(true);
			setShowFeedback(true);

			if (isAnswerCorrect) {
				// Increment streak
				handleActivityResult(true, activity);
				await deductFlowPoints(true);

				// Save user progress
				if (userId && topicId && levelId && courseId) {
					await saveUserProgress({
						topicId: topicId,
						currentActivityId: activity.id,
						nextActivityId: null,
						userId: userId,
					});
				}
			} else {
				handleActivityResult(false, activity);
				await deductFlowPoints(false);
			}
		} catch (err: any) {
			setError(err instanceof Error ? err : new Error("An unexpected error occurred"));
			console.error("Error submitting answer:", err);
		} finally {
			setIsSubmitting(false);
		}
	}, [
		activity,
		selectedAnswers,
		handleActivityResult,
		deductFlowPoints,
		userId,
		topicId,
		levelId,
		courseId,
	]);

	const nextActivity = useCallback(() => {
		setShowFeedback(false);
		setShowCorrectAnswer(false);
		setSelectedAnswers([]);

		if (activities && activityIndex < activities.length - 1) {
			const nextIndex = activityIndex + 1;
			setActivity(activities[nextIndex]);
			setActivityIndex(nextIndex);
			setIsLastActivity(nextIndex === activities.length - 1);
		}
	}, [activityIndex, activities]);

	const resetTest = useCallback(() => {
		setActivity(null);
		setSelectedAnswers([]);
		setShowCorrectAnswer(false);
		setShowFeedback(false);
		setIsCorrect(false);
		setActivityIndex(0);
		setActivities([]);
		setIsLoading(false);
		setError(null);
		setIsSubmitting(false);
		setIsLastActivity(false);
	}, []);

	return {
		activity,
		selectedAnswers,
		showCorrectAnswer,
		showFeedback,
		isCorrect,
		activityIndex,
		activities,
		isLoading,
		error,
		isSubmitting,
		isLastActivity,
		fetchActivities,
		selectAnswer,
		submitAnswer,
		nextActivity,
		resetTest,
	};
}
