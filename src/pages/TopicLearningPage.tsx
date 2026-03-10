import { useEffect, memo } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "@/components/ui/PageTransition";
import ActivityFlow from "@/components/activities/flow/ActivityFlow";
import LearningProgressBar from "@/components/learning/flow/LearningProgressBar";
import LearningLoading from "@/components/learning/loading/LearningLoading";

/**
 * This is the main page that renders when a user navigates to a specific topic.
 * It's accessed via the route `/learn/:topicId` where topicId comes from the URL.
 *
 * Flow:
 * 1. Gets 'topicId' from the URL parameter
 * 2. Renders `ActivityFlow` with the topicId
 * 3. Handles UI state (hiding tab bar, etc.)
 */
const TopicLearningPage = () => {
	// Extract 'topicId' from the URL parameters (e.g. /learn/123 -> topicId = "123")
	const { topicId } = useParams();

	/* Show loading state if 'topicId' is not available yet (i.e. undefined). This can happen for two reasons:
	1. React Router can't know at compile time if the router path actually includes 'topicId'  
	2. During initial render, the component can mount before routing is resolved
	*/
	if (!topicId) {
		return <LearningLoading />;
	}

	// UI Effect: Hide the TabBar when the component mounts and show it when it unmounts
	// This provides a cleaner learning experience
	useEffect(() => {
		const tabBar = document.querySelector('[data-testid="tab-bar"]');
		if (tabBar) {
			tabBar.classList.add("hidden");
		}

		return () => {
			const tabBar = document.querySelector('[data-testid="tab-bar"]');
			if (tabBar) {
				tabBar.classList.remove("hidden");
			}
		};
	}, []);

	return (
		<PageTransition>
			{/* Content with top padding to account for fixed progress bar */}
			<div className="pt-12 p-4 pb-24">
				<div className="glass rounded-2xl p-6 py-[24px] my-4 mx-3">
					{/* TODO: ActivityFlow also expects a 'initialActivityIndex' parameter but it is not passed here */}
					<ActivityFlow topicId={topicId} showTrivia={false} />
				</div>
			</div>
		</PageTransition>
	);
};

// Export a memoized version of the component for performance
export default memo(TopicLearningPage);
