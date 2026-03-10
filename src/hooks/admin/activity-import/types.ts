import { ActivityValidationData } from "@/utils/activities/activityValidation";

export interface ActivityImportData {
	activities: ActivityValidationData[];
}

export interface ActivityImportResult {
	totalActivities: number;
	successCount: number;
	failureCount: number;
	success: boolean;
	errors: string[];
}
