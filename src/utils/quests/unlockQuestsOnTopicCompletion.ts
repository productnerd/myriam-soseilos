
import { supabase } from "@/integrations/supabase/client";

/**
 * Unlock quests (change LOCKED to LIVE) when a topic is completed
 */
export async function unlockQuestsOnTopicCompletion(userId: string, topicId: string): Promise<void> {
  try {
    console.log(`Unlocking quests for user ${userId} who completed topic ${topicId}`);

    // Update real-life sidequests from LOCKED to LIVE
    // Use a more defensive approach that works with or without state column
    const { data: unlockedSidequests, error: sidequestsError } = await supabase
      .from("user_sidequests")
      .update({ 
        state: "LIVE",
        // Also update any existing records that might not have explicit state
        ...(process.env.NODE_ENV === 'development' && { updated_at: new Date().toISOString() })
      })
      .eq("user_id", userId)
      .in("sidequest_id", 
        supabase
          .from("sidequests")
          .select("id")
          .eq("topic_id", topicId)
          .eq("status", "ACTIVE")
      )
      .select();

    if (sidequestsError) {
      console.error("Error unlocking sidequests:", sidequestsError);
    } else if (unlockedSidequests && unlockedSidequests.length > 0) {
      console.log(`Unlocked ${unlockedSidequests.length} sidequests for topic completion`);
    }

    // Update self-exploration quests from LOCKED to LIVE
    const { data: unlockedSelfExplorationQuests, error: selfExplorationError } = await supabase
      .from("user_self_exploration_quests")
      .update({ 
        state: "LIVE",
        ...(process.env.NODE_ENV === 'development' && { updated_at: new Date().toISOString() })
      })
      .eq("user_id", userId)
      .in("self_exploration_quest_id",
        supabase
          .from("self_exploration_quests")
          .select("id")
          .eq("topic_id", topicId)
          .eq("status", "ACTIVE")
      )
      .select();

    if (selfExplorationError) {
      console.error("Error unlocking self-exploration quests:", selfExplorationError);
    } else if (unlockedSelfExplorationQuests && unlockedSelfExplorationQuests.length > 0) {
      console.log(`Unlocked ${unlockedSelfExplorationQuests.length} self-exploration quests for topic completion`);
    }

    console.log(`Successfully processed quest unlocking for topic completion`);
  } catch (error) {
    console.error("Error in unlockQuestsOnTopicCompletion:", error);
  }
}
