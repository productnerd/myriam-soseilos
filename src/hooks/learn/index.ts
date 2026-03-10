// Export all hooks from the learn directory
export { useLearnPageState } from "./useLearnPageState";
export { useInitialTestState } from "./useInitialTestState";
export {
	useTopicCompletionTracking,
	COMPLETED_TOPIC_KEY,
	LAST_TOPIC_STATUS_KEY,
} from "./useTopicCompletionTracking";
export { useLastVisitedTopic } from "./useLastVisitedTopic";
export { useLevelCompletionStatus } from "./useLevelCompletionStatus";
export { useUserProgressValidation } from "./useUserProgressValidation";

// Add re-export for useLevelsByCourse to make it more discoverable
export { useLevelsByCourse } from "../courses";
