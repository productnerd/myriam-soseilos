import { supabase } from "@/integrations/supabase/client";
import { ActivityType } from "@/types/activity";
import { isPollActivityType, isValidActivityType } from "@/utils/activities/activityOperations";

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export interface ActivityOption {
	text: string;
	value?: string;
	image?: string;
	feedback?: string;
}

export interface ActivityValidationData {
	topic_id: string;
	type: string;
	main_text: string;
	correct_answer?: string | null;
	explanation?: string | null;
	options?: string[] | ActivityOption[];
	embed_url?: string;
	order_number?: number;
}

/**
 * Validates a single activity object
 */
export async function validateActivity(
	activity: ActivityValidationData,
	index: number
): Promise<ValidationResult> {
	const errors: string[] = [];

	// Check required fields
	if (!activity.topic_id) {
		errors.push(`Activity ${index + 1}: Missing topic_id`);
	}

	if (!activity.type) {
		errors.push(`Activity ${index + 1}: Missing activity type`);
	} else if (!isValidActivityType(activity.type)) {
		errors.push(`Activity ${index + 1}: Invalid activity type "${activity.type}"`);
	}

	if (!activity.main_text && activity.type !== "eduntainment") {
		errors.push(`Activity ${index + 1}: Missing main_text`);
	}

	// Check activity type specific validation
	const activityType = activity.type as ActivityType;

	// For poll types, correct_answer should be null
	if (isPollActivityType(activityType) && activity.correct_answer) {
		errors.push(`Activity ${index + 1}: Poll activities should not have a correct_answer`);
	}

	// For non-poll types (except eduntainment), correct_answer is required
	if (
		!isPollActivityType(activityType) &&
		activityType !== "eduntainment" &&
		!activity.correct_answer
	) {
		errors.push(`Activity ${index + 1}: Missing correct_answer`);
	}

	// For multiple choice and image multiple choice, need at least 2 options
	if (["multiple_choice", "image_multiple_choice", "poll", "image_poll"].includes(activityType)) {
		if (!activity.options || !Array.isArray(activity.options) || activity.options.length < 2) {
			errors.push(`Activity ${index + 1}: ${activityType} requires at least 2 options`);
		}
	}

	// For eduntainment, embed_url is required
	if (activityType === "eduntainment" && !activity.embed_url) {
		errors.push(`Activity ${index + 1}: Eduntainment activities require an embed_url`);
	}

	// Validate topic_id exists in database
	if (activity.topic_id) {
		const topicExists = await validateTopicExists(activity.topic_id);
		if (!topicExists) {
			errors.push(`Activity ${index + 1}: Topic ID "${activity.topic_id}" does not exist`);
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

/**
 * Validates a batch of activities
 */
export async function validateActivities(
	activities: ActivityValidationData[]
): Promise<ValidationResult> {
	const errors: string[] = [];

	if (!Array.isArray(activities)) {
		return { isValid: false, errors: ["Invalid JSON format: activities must be an array"] };
	}

	if (activities.length === 0) {
		return { isValid: false, errors: ["No activities to import"] };
	}

	// Validate each activity
	for (let i = 0; i < activities.length; i++) {
		const result = await validateActivity(activities[i], i);
		errors.push(...result.errors);
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

/**
 * Check if a topic exists in the database
 */
async function validateTopicExists(topicId: string): Promise<boolean> {
	try {
		const { data, error } = await supabase
			.from("topics")
			.select("id")
			.eq("id", topicId)
			.single();

		if (error) {
			console.error("[activityValidation] Error validating topic:", error);
			return false;
		}

		return !!data;
	} catch (error) {
		console.error("[activityValidation] Error in validateTopicExists:", error);
		return false;
	}
}
