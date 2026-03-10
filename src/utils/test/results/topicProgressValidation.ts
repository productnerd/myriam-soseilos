// The file now only re-exports functions from userProgressValidation.ts

// First import the functions for local use
import { validateUserProgress, fixUserProgress } from "./userProgressValidation";

export async function validateAndFixTopicProgress(
	userId: string,
	courseId: string
): Promise<boolean> {
	console.log("Validating user progress for course:", courseId);
	const isValid = await validateUserProgress(userId, courseId);

	if (!isValid) {
		console.log("Invalid user progress detected, attempting to repair");
		return await fixUserProgress(userId, courseId);
	}

	return true;
}

export async function validateAndCreateMissingTopicProgress(
	userId: string,
	courseId: string
): Promise<boolean> {
	console.log("Creating missing topic progress is now simplified to repair");
	return await fixUserProgress(userId, courseId);
}
