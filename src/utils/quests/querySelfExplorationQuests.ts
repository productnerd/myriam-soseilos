import { supabase } from "@/integrations/supabase/client";
import { UserSelfExplorationQuest } from "@/types/self-exploration";

// Service for fetching user self-exploration quests
export async function fetchUserSelfExplorationQuests(
	userId: string | null
): Promise<UserSelfExplorationQuest[]> {
	console.debug("fetchUserSelfExplorationQuests - Starting quest fetch");

	try {
		if (!userId) {
			console.debug("fetchUserSelfExplorationQuests - No authenticated user found");
			return [];
		}

		console.debug("fetchUserSelfExplorationQuests - Fetching quests for user:", userId);

		const { data: userQuests, error } = await supabase
			.from("user_self_exploration_quests")
			.select(
				`
        *,
        self_exploration_quest:self_exploration_quests!inner(
          *
        )
      `
			)
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("fetchUserSelfExplorationQuests - Database error:", error);
			throw error;
		}

		console.debug("fetchUserSelfExplorationQuests - Raw quest data from database:", {
			totalQuests: userQuests?.length || 0,
			questsWithDetails:
				userQuests?.map((q) => ({
					id: q.id,
					title: q.self_exploration_quest?.title,
					state: q.state,
					questStatus: q.self_exploration_quest?.status,
					questionsCount: q.self_exploration_quest?.questions?.length || 0,
					hasQuestions: !!q.self_exploration_quest?.questions,
					questions: q.self_exploration_quest?.questions,
				})) || [],
		});

		// Filter out quests where the self_exploration_quest itself is not ACTIVE
		const activeQuests =
			userQuests?.filter((q) => {
				const isActive = q.self_exploration_quest?.status === "ACTIVE";
				if (!isActive) {
					console.debug("Filtering out inactive self-exploration quest:", {
						title: q.self_exploration_quest?.title,
						status: q.self_exploration_quest?.status,
					});
				}
				return isActive;
			}) || [];

		// If there are quests with topic_id, fetch the topic details separately
		const questsWithTopics = await Promise.all(
			activeQuests.map(async (quest) => {
				if (quest.self_exploration_quest?.topic_id) {
					try {
						const { data: topicData } = await supabase
							.from("topics")
							.select(
								`
                id,
                title,
                level:levels(
                  id,
                  title,
                  course:courses(
                    id,
                    title,
                    color
                  )
                )
              `
							)
							.eq("id", quest.self_exploration_quest.topic_id)
							.single();

						if (topicData) {
							return {
								...quest,
								self_exploration_quest: {
									...quest.self_exploration_quest,
									topic: topicData,
								},
							};
						}
					} catch (topicError) {
						console.debug("Could not fetch topic for quest:", quest.id, topicError);
					}
				}
				return quest;
			})
		);

		console.debug("fetchUserSelfExplorationQuests - FINAL ACTIVE QUESTS:", {
			activeQuestsCount: questsWithTopics.length,
			questsWithQuestions: questsWithTopics.map((q) => ({
				id: q.id,
				title: q.self_exploration_quest?.title,
				questionsCount: q.self_exploration_quest?.questions?.length || 0,
				questions: q.self_exploration_quest?.questions,
			})),
		});

		return questsWithTopics as UserSelfExplorationQuest[];
	} catch (error) {
		console.error("fetchUserSelfExplorationQuests - Failed to fetch quests:", error);
		throw error;
	}
}
