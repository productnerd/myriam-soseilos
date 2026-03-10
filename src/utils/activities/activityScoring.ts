import { LearningActivity } from "@/types/activity";

/**
 * Activity types that don't have correct/incorrect answers and should not:
 * - Count toward activity streaks
 * - Cost focus points
 * - Be added to the review system
 */
const NON_SCORING_ACTIVITY_TYPES = ["poll", "image_poll", "text_poll", "eduntainment"];

/**
 * Determines if an activity type should count toward streaks and cost focus points
 */
export function shouldActivityCountForStreakAndFocus(activity: LearningActivity): boolean {
	return !NON_SCORING_ACTIVITY_TYPES.includes(activity.type);
}

/**
 * Determines if an activity has correct/incorrect answers
 */
export function hasCorrectIncorrectAnswers(activityType: string): boolean {
	return !NON_SCORING_ACTIVITY_TYPES.includes(activityType);
}
