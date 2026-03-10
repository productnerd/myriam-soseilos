import { supabase } from "@/integrations/supabase/client";
import { Activity, ActivityType } from "@/types/activity";
import { VALID_ACTIVITY_TYPES } from "./activityDefinitions";

/**
 * Normalizes activity types to their canonical lowercase form.
 * This handles:
 * 1. Case normalization (uppercase -> lowercase)
 * 2. Legacy type conversion (e.g., 'TEXT' -> 'text_input')
 * 3. Standardization of variations
 *
 * @param type - The activity type to normalize
 * @returns The canonical form of the activity type
 */
export function normalizeActivityType(type: string): string {
	const upperType = type.toUpperCase();

	// Handle legacy/deprecated types - all text variants become text_input
	const legacyMappings: Record<string, string> = {
		TEXT: "text_input",
		TEXT_ANSWER: "text_input",
		MYTH_NOT: "myth_or_reality",
		POLL_IMAGES: "image_poll",
	};

	if (legacyMappings[upperType]) {
		return legacyMappings[upperType];
	}

	// Convert to lowercase and return
	return type.toLowerCase();
}

/**
 * Runtime validation function to check if a string is a valid activity type.
 * This is needed because TypeScript types are removed at runtime.
 *
 * @param type - The activity type to validate
 * @returns boolean indicating if the type is valid
 */
export function isValidActivityType(type: string): boolean {
	const normalizedType = normalizeActivityType(type);
	return VALID_ACTIVITY_TYPES.includes(normalizedType);
}

/**
 * Fetches activities for a test
 * @param testId The ID of the test to fetch activities for
 * @returns Promise resolving to an array of Activity objects
 */
export const getTestActivities = async (testId: string): Promise<Activity[]> => {
	try {
		console.debug("[activityOperations] Fetching activities for test:", testId);

		// Fetch activities directly from the activities table using test_id foreign key
		const { data, error } = await supabase
			.from("activities")
			.select("*")
			.eq("test_id", testId)
			.order("order_number", { ascending: true });

		if (error) {
			console.error(
				`[activityOperations] Error fetching test activities for test ${testId}:`,
				error
			);
			throw error;
		}

		if (!data || data.length === 0) {
			console.debug(`[activityOperations] No test activities found for test ${testId}`);
			return [];
		}

		console.debug(
			`[activityOperations] Successfully fetched ${data.length} activities for test ${testId}`
		);

		// Map raw data to Activity objects
		return data.map((item) => {
			const normalizedType = normalizeActivityType(item.type);
			return {
				...item,
				type: normalizedType as ActivityType,
				order_number: item.order_number || 0, // Ensure order_number has a default value
			} as Activity;
		});
	} catch (err) {
		console.error("[activityOperations] Failed to fetch test activities:", err);
		throw err;
	}
};

/**
 * Determines if an activity type should have a null correct_answer (poll types)
 * @param activityType The type of activity to check
 * @returns Boolean indicating if the correct_answer should be null
 */
export const isPollActivityType = (activityType: string): boolean => {
	const lowerType = activityType.toLowerCase();
	return ["poll", "image_poll", "text_poll"].includes(lowerType);
};

/**
 * Prepares the explanation text for an activity based on the current state
 * @param activity The activity object or explanation data
 * @param selectedAnswer Optional selected answer for personalized explanation
 * @returns The appropriate explanation string
 */
export const prepareActivityExplanation = (
	activity: Activity | Record<string, string> | string | null,
	selectedAnswer?: string
): string => {
	// Handle null/undefined
	if (!activity) return "";

	// If it's a string, return it directly
	if (typeof activity === "string") {
		return activity;
	}

	// Handle full activity object
	if ("explanation" in activity) {
		const explanation = activity.explanation;

		// If explanation is a string, return it directly
		if (typeof explanation === "string") {
			return explanation;
		}

		// If it's an object, check if we have a specific explanation for the selected answer
		if (
			explanation &&
			typeof explanation === "object" &&
			selectedAnswer &&
			selectedAnswer in explanation
		) {
			return explanation[selectedAnswer];
		}

		// Default explanation or general explanation
		if (explanation && typeof explanation === "object" && "default" in explanation) {
			return explanation.default;
		}
	}
	// Handle direct explanation object
	else if (typeof activity === "object") {
		// If we have a specific explanation for the selected answer
		if (selectedAnswer && selectedAnswer in activity) {
			return activity[selectedAnswer];
		}

		// Default explanation or first value as fallback
		if ("default" in activity) {
			return activity.default;
		}

		// Fallback to first value
		const values = Object.values(activity);
		if (values.length > 0) {
			return values[0];
		}
	}

	// Fallback to empty string if no explanation is available
	return "";
};

/**
 * Get the explanation text for a specific answer
 * @param explanation The explanation from an activity (string or object)
 * @param selectedAnswer The selected answer
 * @returns The explanation text
 */
export const getExplanationForAnswer = (
	explanation: Record<string, string> | string | null,
	selectedAnswer?: string
): string => {
	return prepareActivityExplanation(explanation, selectedAnswer);
};

/**
 * Normalizes an explanation that could be a string or object
 * @param explanation The explanation from an activity (string or object)
 * @returns A string representation of the explanation
 */
export const normalizeExplanation = (
	explanation: string | Record<string, string> | null
): string => {
	if (!explanation) return "";

	if (typeof explanation === "string") {
		return explanation;
	}

	// If it's an object, try to get the default explanation
	if (typeof explanation === "object") {
		if ("default" in explanation) {
			return explanation.default;
		}

		// If no default, just return the first value
		const values = Object.values(explanation);
		return values.length > 0 ? values[0] : "";
	}

	return "";
};
