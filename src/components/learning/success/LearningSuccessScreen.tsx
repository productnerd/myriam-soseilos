import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/interactive/Button";
import { ArrowRight } from "lucide-react";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import UnlockedQuestsList from "./UnlockedQuestsList";
import { useUnlockedQuests } from "@/hooks/learning/useUnlockedQuests";
import SuccessHeader from "./SuccessHeader";
import { Sidequest } from "@/types/quests";
import {
	COMPLETED_TOPIC_KEY,
	LAST_TOPIC_STATUS_KEY,
} from "@/hooks/learn/useTopicCompletionTracking";
import { getTopicById, getTopicsForLevel } from "@/utils/topic/topicData";

interface LearningSuccessScreenProps {
	topicId: string;
}

/**
 * Component that shows a success screen when a user completes a topic
 *
 * When a user completes a topic, this component:
 * 1. Stores the completed topic ID in localStorage
 * 2. Fetches all topics in the same level
 * 3. Creates optimistic statuses (marking the completed topic as "completed") so there's no delay when user navigates to roadmap
 * 4. Stores these statuses in localStorage for other components to use
 */
const LearningSuccessScreen: React.FC<LearningSuccessScreenProps> = ({ topicId }) => {
	const navigate = useNavigate();

	// Get user data from global context
	const { user } = useUserContext();

	const [pointsEarned, setPointsEarned] = useState<number | null>(null);
	const [darkPointsEarned, setDarkPointsEarned] = useState<number | null>(null); // TODO: Dark points are not set anywhere
	const [greyPointUnlockedQuests, setGreyPointUnlockedQuests] = useState<Sidequest[]>([]); // TODO: Grey point quests are not used anywhere
	const { data: fetchedQuests, isLoading: questsLoading } = useUnlockedQuests(
		topicId,
		user!.id // ProtectedRoute guarantees user is available
	);

	// Store completed topic ID and optimistic statuses for immediate UI updates
	useEffect(() => {
		if (topicId) {
			// Store completed topic ID for CourseRoadmap to detect
			localStorage.setItem(COMPLETED_TOPIC_KEY, topicId);

			// Fetch and cache optimistic topic statuses for immediate UI updates
			const fetchAndCacheTopicStatuses = async () => {
				try {
					// Get the topic's information (including level_id)
					const topicData = await getTopicById(topicId);

					if (topicData) {
						// Get all topics for this level
						const topics = await getTopicsForLevel(topicData.level_id);

						// Get completed topics for this level
						const { data: completedTopics } = await supabase
							.from("user_completed_topics")
							.select("topic_id")
							.eq("user_id", user!.id)
							.eq("level_id", topicData.level_id);

						if (topics && completedTopics) {
							// Create optimistic statuses for all topics in this level
							const topicStatuses = topics.reduce((acc, topic) => {
								// Mark topic as completed if it's in completedTopics OR if it's the current topic
								const isCompleted =
									completedTopics.some((ct) => ct.topic_id === topic.id) ||
									topic.id === topicId;

								acc[topic.id] = isCompleted ? "completed" : undefined;
								return acc;
							}, {} as Record<string, string | undefined>);

							// Store optimistic statuses for other components to use immediately
							localStorage.setItem(
								LAST_TOPIC_STATUS_KEY,
								JSON.stringify(topicStatuses)
							);
						}
					}
				} catch (error) {
					console.error("[LearningSuccessScreen] Error caching topic statuses:", error);
				}
			};

			fetchAndCacheTopicStatuses();
		}
	}, [topicId, user!.id]);

	// Calculate points earned for this topic completion
	useEffect(() => {
		const fetchTopicOrderNumber = async () => {
			if (!topicId) return;

			try {
				const topicData = await getTopicById(topicId);

				if (topicData) {
					// Apply algorithm: 29 - order_number, min 12
					const points = Math.max(29 - topicData.order_number, 12);
					setPointsEarned(points);
				}
			} catch (error) {
				console.error("[LearningSuccessScreen] Error fetching topic order:", error);
			}
		};

		fetchTopicOrderNumber();
	}, [topicId]);

	const handleContinue = () => {
		// Go back to learn page/roadmap in all cases
		navigate("/learn", { replace: true });
	};

	return (
		<div className="flex flex-col items-center justify-center py-6 space-y-8">
			<SuccessHeader
				title="Topic Completed!"
				subtitle="Great job completing this topic!"
				pointsEarned={pointsEarned}
				darkPointsEarned={darkPointsEarned}
			/>

			{/* If there are quests unlocked, show them */}
			{fetchedQuests && fetchedQuests.length > 0 && (
				<UnlockedQuestsList quests={fetchedQuests} isLoading={questsLoading} />
			)}

			{/* Single Continue button with secondary styling moved to the bottom */}
			<div className="flex flex-col w-full max-w-sm gap-3 mt-4">
				<Button
					onClick={handleContinue}
					variant="secondary"
					className="flex items-center gap-2"
				>
					Continue <ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};

export default LearningSuccessScreen;
