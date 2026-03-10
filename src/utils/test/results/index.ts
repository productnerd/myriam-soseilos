// Main entry point that re-exports everything for backward compatibility
export { saveTestResults } from "./saveTestResults";
export { updateUserProgressForInitialTest, updateUserProgress } from "./userProgressUtils";
export { updateTopicStatuses } from "./topicStatusUtils";
export { validateTopicBelongsToCourse } from "./validationUtils";
export {
	validateAndFixTopicProgress,
	validateAndCreateMissingTopicProgress,
} from "./topicProgressValidation";
export { validateUserProgress, fixUserProgress } from "./userProgressValidation";
export { handleTestTypeSpecificActions } from "./testTypeHandler";

// Export calculation functions from scoreUtils.ts
export {
	calculateScorePercentage,
	determinePassed,
	saveUserTestScores,
	createOrUpdateUserTestScore,
} from "./scoreUtils";

// Export test score storage functions
export { createOrUpdateTestScore } from "./testScoreStorage";
