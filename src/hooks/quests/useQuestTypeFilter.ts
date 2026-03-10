
import { useMemo, useState } from 'react';
import { UserSidequest } from '@/types/user';
import { UserSelfExplorationQuest } from '@/types/self-exploration';
import { QuestType } from '@/types/quests';

export const useQuestTypeFilter = (
  userQuests: UserSidequest[] = [],
  selfExplorationQuests: UserSelfExplorationQuest[] = []
) => {
  // Default to real-life-task instead of "all"
  const [selectedType, setSelectedType] = useState<QuestType>("real-life-task");

  const questTypeCounts = useMemo(() => {
    const realLifeCount = userQuests?.length || 0;
    const selfExplorationCount = selfExplorationQuests?.length || 0;
    
    return {
      "all": realLifeCount + selfExplorationCount,
      "real-life-task": realLifeCount,
      "self-exploration-quiz": selfExplorationCount,
    };
  }, [userQuests, selfExplorationQuests]);

  const filteredQuestsByType = useMemo(() => {
    const allQuests: UserSidequest[] = [];
    
    // Add real-life quests
    if (userQuests) {
      allQuests.push(...userQuests);
    }
    
    // Add self-exploration quests (convert to UserSidequest format)
    if (selfExplorationQuests) {
      const convertedSelfExplorationQuests: UserSidequest[] = selfExplorationQuests.map(quest => ({
        id: quest.id,
        user_id: quest.user_id,
        sidequest_id: undefined,
        self_exploration_quest_id: quest.self_exploration_quest_id,
        state: quest.state,
        progress: quest.progress || 0,
        completed_at: quest.completed_at,
        is_hidden: quest.is_hidden || false,
        created_at: quest.created_at,
        current_question_index: quest.current_question_index,
        session_id: quest.session_id,
        sidequest: undefined,
        self_exploration_quest: quest.self_exploration_quest,
        // Add missing required fields with default values
        rewards_claimed: false,
      }));
      allQuests.push(...convertedSelfExplorationQuests);
    }

    // Filter based on selected type
    switch (selectedType) {
      case "real-life-task":
        return allQuests.filter(quest => !quest.self_exploration_quest_id);
      case "self-exploration-quiz":
        return allQuests.filter(quest => !!quest.self_exploration_quest_id);
      case "all":
      default:
        return allQuests;
    }
  }, [userQuests, selfExplorationQuests, selectedType]);

  return {
    selectedType,
    setSelectedType,
    filteredQuestsByType,
    questTypeCounts,
  };
};
