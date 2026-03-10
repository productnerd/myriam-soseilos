import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getNextTopicInLevel, getTopicById } from "@/utils/topic/topicData";

/**
 * Hook to determine what content to be shown to the user after they complete a topic.
 * This can be either:
 * - The next topic to learn in that level
 * - The level test for that level (if all topics in that level are completed)
 * - Nothing (if all topics and tests in all levels are completed, i.e. the course is completed)
 */
export function useNextContent(topicId: string | undefined) {
	const [nextTopic, setNextTopic] = useState<{ id: string; title: string } | null>(null);
	const [nextLevelTest, setNextLevelTest] = useState<{ id: string; title: string } | null>(null);

	useEffect(() => {
		const fetchNextTopic = async () => {
			if (!topicId) return;

			try {
				// Get the next topic in the same level (if there is one)
				const nextTopicData = await getNextTopicInLevel(topicId);

				// Set the next topic to learn (or null if there are no more topics in the same level)
				setNextTopic(nextTopicData);

				// If there's no other topic in the same level, check for a level test
				if (!nextTopicData) {
					// Get the current topic's information
					const currentTopicData = await getTopicById(topicId);

					if (currentTopicData) {
						// Check for a level test
						const { data: testData } = await supabase
							.from("tests")
							.select("id, title")
							.eq("level_id", currentTopicData.level_id)
							.eq("test_type", "level")
							.maybeSingle(); // TODO: Is it possible for a level to NOT have a level test?

						// Set the next level test (or null if there's no level test)
						setNextLevelTest(testData);
					}
				}
			} catch (error) {
				console.error("[useNextContent] Error fetching next topic:", error);
			}
		};

		fetchNextTopic();
	}, [topicId]);

	return { nextTopic, nextLevelTest };
}
