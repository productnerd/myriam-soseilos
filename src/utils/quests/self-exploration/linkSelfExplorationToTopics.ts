
import { supabase } from "@/integrations/supabase/client";

export async function linkSelfExplorationQuestsToTopics() {
	try {
		// Get all self-exploration quests without topic links
		const { data: selfExplorationQuests, error: questError } = await supabase
			.from("self_exploration_quests")
			.select("id, title, description, topic_id")
			.eq("status", "ACTIVE")
			.is("topic_id", null);

		if (questError) {
			console.error("Error fetching self-exploration quests:", questError);
			return;
		}

		if (!selfExplorationQuests || selfExplorationQuests.length === 0) {
			console.log("No unlinked self-exploration quests found");
			return;
		}

		// Get all topics to link with
		const { data: topics, error: topicsError } = await supabase
			.from("topics")
			.select(`
				id,
				title,
				level:levels(
					id,
					title,
					course:courses(
						id,
						title
					)
				)
			`);

		if (topicsError) {
			console.error("Error fetching topics:", topicsError);
			return;
		}

		if (!topics || topics.length === 0) {
			console.log("No topics found");
			return;
		}

		// Link each quest to a random topic
		for (const quest of selfExplorationQuests) {
			const randomTopic = topics[Math.floor(Math.random() * topics.length)];
			
			const { error: updateError } = await supabase
				.from("self_exploration_quests")
				.update({ topic_id: randomTopic.id })
				.eq("id", quest.id);

			if (updateError) {
				console.error(`Error linking quest ${quest.id} to topic ${randomTopic.id}:`, updateError);
			} else {
				console.log(`Linked quest "${quest.title}" to topic "${randomTopic.title}"`);
			}
		}

		console.log("Finished linking self-exploration quests to topics");
	} catch (error) {
		console.error("Error in linkSelfExplorationQuestsToTopics:", error);
	}
}
