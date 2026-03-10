import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserSelfExplorationQuest, SelfExplorationQuestion } from "@/types/self-exploration";

/**
 * Hook for fetching user self-exploration quests
 *
 * @param userId - The ID of the authenticated user
 * @returns The self-exploration quests data
 */
export const useSelfExplorationQuestsQuery = (userId: string) => {
	const queryResult = useQuery({
		queryKey: ["selfExplorationQuests", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("user_self_exploration_quests")
				.select(
					`
          *,
          self_exploration_quest:self_exploration_quests(
            *,
            topic:topics(
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
            )
          )
        `
				)
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;

			// Transform the data to match our TypeScript types
			const transformedData =
				data?.map((quest) => ({
					...quest,
					self_exploration_quest: {
						...quest.self_exploration_quest,
						questions: Array.isArray(quest.self_exploration_quest?.questions)
							? (quest.self_exploration_quest.questions as SelfExplorationQuestion[])
							: [],
					},
				})) || [];

			return transformedData as UserSelfExplorationQuest[];
		},
		enabled: !!userId, // Only run when userId is authenticated
	});

	return queryResult;
};
