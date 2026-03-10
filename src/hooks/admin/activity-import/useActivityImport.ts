import { useState } from "react";
import { toast } from "sonner";
import { validateActivities } from "@/utils/activities/activityValidation";
import { processActivitiesImport } from "./importUtils";
import { ActivityImportData, ActivityImportResult } from "./types";

/**
 * Hook for importing activities from JSON data
 */
export const useActivityImport = () => {
	const [isImporting, setIsImporting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [importStatus, setImportStatus] = useState<ActivityImportResult>({
		totalActivities: 0,
		successCount: 0,
		failureCount: 0,
		success: false,
		errors: [],
	});

	const resetStatus = () => {
		setImportStatus({
			totalActivities: 0,
			successCount: 0,
			failureCount: 0,
			success: false,
			errors: [],
		});
		setError(null);
	};

	const importActivities = async (data: ActivityImportData) => {
		setIsImporting(true);
		setError(null);
		resetStatus();

		try {
			// Basic JSON validation
			if (!data || !data.activities) {
				throw new Error("Invalid JSON format: missing activities array");
			}

			// Comprehensive validation before processing
			const validation = await validateActivities(data.activities);
			if (!validation.isValid) {
				setImportStatus({
					totalActivities: data.activities.length,
					successCount: 0,
					failureCount: data.activities.length,
					success: false,
					errors: validation.errors,
				});
				throw new Error("Validation failed: " + validation.errors.join(", "));
			}

			// Set initial status
			setImportStatus((prevStatus) => ({
				...prevStatus,
				totalActivities: data.activities.length,
			}));

			// Process the import
			const result = await processActivitiesImport(data, (statusUpdate) => {
				setImportStatus((prevStatus) => ({
					...prevStatus,
					...statusUpdate,
				}));
			});

			// Set final status
			setImportStatus(result);

			// Show appropriate toast based on result
			if (result.success) {
				toast.success(`Successfully imported ${result.successCount} activities`);
			} else if (result.successCount > 0) {
				toast.info(
					`Partially imported ${result.successCount} of ${result.totalActivities} activities`
				);
			} else {
				toast.error("Failed to import activities");
			}
		} catch (err) {
			console.error("Import error:", err);
			const errorMessage = err instanceof Error ? err.message : "Unknown import error";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsImporting(false);
		}
	};

	return {
		importActivities,
		isImporting,
		importStatus,
		error,
		resetStatus,
	};
};
