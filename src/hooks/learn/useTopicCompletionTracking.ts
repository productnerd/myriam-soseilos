import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Constants
export const COMPLETED_TOPIC_KEY = "lastCompletedTopicId";
export const LAST_TOPIC_STATUS_KEY = "lastTopicStatuses";

export function useTopicCompletionTracking() {
	const navigate = useNavigate();

	useEffect(() => {
		const checkForTopicCompletion = () => {
			const lastCompletedTopicId = localStorage.getItem(COMPLETED_TOPIC_KEY);
			if (lastCompletedTopicId) {
				localStorage.removeItem(COMPLETED_TOPIC_KEY);
				localStorage.removeItem(LAST_TOPIC_STATUS_KEY);
			}
		};

		checkForTopicCompletion();
	}, [navigate]);

	return {}; // This hook primarily works through side effects
}
