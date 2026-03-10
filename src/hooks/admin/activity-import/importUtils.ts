import { ActivityValidationData } from "@/utils/activities/activityValidation";
import { getNextOrderNumber, insertActivity } from "./supabaseOperations";
import { ActivityImportData, ActivityImportResult } from "./types";

/**
 * Group activities by topic_id for efficient processing
 */
export const groupActivitiesByTopic = (
	activities: ActivityValidationData[]
): { [key: string]: ActivityValidationData[] } => {
	const topicGroups: { [key: string]: ActivityValidationData[] } = {};

	activities.forEach((activity) => {
		if (!topicGroups[activity.topic_id]) {
			topicGroups[activity.topic_id] = [];
		}
		topicGroups[activity.topic_id].push(activity);
	});

	return topicGroups;
};

/**
 * Process a batch of activities for import
 */
export const processActivitiesImport = async (
	data: ActivityImportData,
	// `Partial` makes all properties of `ActivityImportResult` optional
	onStatusUpdate: (status: Partial<ActivityImportResult>) => void
): Promise<ActivityImportResult> => {
	const result: ActivityImportResult = {
		totalActivities: data.activities.length,
		successCount: 0,
		failureCount: 0,
		success: false,
		errors: [],
	};

	try {
		// Group activities by topic_id to get order numbers efficiently
		const topicGroups = groupActivitiesByTopic(data.activities);

		// Process each topic group
		for (const [topicId, activities] of Object.entries(topicGroups)) {
			// Get next order number for this topic
			let nextOrderNumber = await getNextOrderNumber(topicId);

			for (const activity of activities) {
				try {
					// Insert the activity
					const success = await insertActivity(activity, nextOrderNumber);

					if (success) {
						// Increment success count and order number
						result.successCount++;
						nextOrderNumber++;
					} else {
						throw new Error("Failed to insert activity");
					}

					// Update status periodically
					if (
						result.successCount % 5 === 0 ||
						result.successCount === result.totalActivities
					) {
						onStatusUpdate({
							successCount: result.successCount,
							failureCount: result.totalActivities - result.successCount,
							success: result.successCount === result.totalActivities,
						});
					}
				} catch (err) {
					console.error("Error importing activity:", err);
					const errorMessage = err instanceof Error ? err.message : "Unknown error";
					result.errors.push(`Error importing activity: ${errorMessage}`);
					result.failureCount++;

					onStatusUpdate({
						failureCount: result.failureCount,
						errors: [...result.errors],
					});
				}
			}
		}

		// Set final success flag
		result.success = result.successCount === result.totalActivities;

		return result;
	} catch (err) {
		console.error("Import processing error:", err);
		const errorMessage = err instanceof Error ? err.message : "Unknown processing error";
		result.errors.push(errorMessage);
		result.failureCount = result.totalActivities - result.successCount;
		result.success = false;

		return result;
	}
};
