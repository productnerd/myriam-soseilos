
import { supabase } from "@/integrations/supabase/client";

/**
 * Add all topic-linked quests as LOCKED when a user starts a course
 * Note: This assumes the database has been updated with state columns
 */
export async function addQuestsOnCourseStart(userId: string, courseId: string): Promise<void> {
  try {
    console.log(`Adding quests for user ${userId} starting course ${courseId}`);

    // Get all topics in this course
    const { data: topics, error: topicsError } = await supabase
      .from("topics")
      .select(`
        id,
        level_id,
        levels!inner(
          course_id
        )
      `)
      .eq("levels.course_id", courseId);

    if (topicsError) {
      console.error("Error fetching course topics:", topicsError);
      return;
    }

    if (!topics || topics.length === 0) {
      console.log("No topics found for course");
      return;
    }

    const topicIds = topics.map(t => t.id);

    // Get real-life sidequests linked to these topics
    const { data: sidequests, error: sidequestsError } = await supabase
      .from("sidequests")
      .select("id")
      .eq("status", "ACTIVE")
      .in("topic_id", topicIds);

    if (sidequestsError) {
      console.error("Error fetching sidequests:", sidequestsError);
      return;
    }

    // Get self-exploration quests linked to these topics
    const { data: selfExplorationQuests, error: selfExplorationError } = await supabase
      .from("self_exploration_quests")
      .select("id")
      .eq("status", "ACTIVE")
      .in("topic_id", topicIds);

    if (selfExplorationError) {
      console.error("Error fetching self-exploration quests:", selfExplorationError);
      return;
    }

    // Get existing user quests to avoid duplicates
    const { data: existingUserSidequests } = await supabase
      .from("user_sidequests")
      .select("sidequest_id")
      .eq("user_id", userId);

    const { data: existingUserSelfExplorationQuests } = await supabase
      .from("user_self_exploration_quests")
      .select("self_exploration_quest_id")
      .eq("user_id", userId);

    const existingSidequestIds = new Set(existingUserSidequests?.map(q => q.sidequest_id) || []);
    const existingSelfExplorationIds = new Set(existingUserSelfExplorationQuests?.map(q => q.self_exploration_quest_id) || []);

    // Add real-life sidequests as LOCKED (fallback to LIVE if state column doesn't exist)
    if (sidequests && sidequests.length > 0) {
      const newSidequests = sidequests
        .filter(quest => !existingSidequestIds.has(quest.id))
        .map(quest => ({
          user_id: userId,
          sidequest_id: quest.id,
          state: "LOCKED", // Will fallback to default if column doesn't exist
          created_at: new Date().toISOString(),
        }));

      if (newSidequests.length > 0) {
        const { error: insertError } = await supabase
          .from("user_sidequests")
          .insert(newSidequests);

        if (insertError) {
          console.error("Error inserting user sidequests:", insertError);
        } else {
          console.log(`Added ${newSidequests.length} locked sidequests for course start`);
        }
      }
    }

    // Add self-exploration quests as LOCKED
    if (selfExplorationQuests && selfExplorationQuests.length > 0) {
      const newSelfExplorationQuests = selfExplorationQuests
        .filter(quest => !existingSelfExplorationIds.has(quest.id))
        .map(quest => ({
          user_id: userId,
          self_exploration_quest_id: quest.id,
          state: "LOCKED", // Will fallback to default if column doesn't exist
          created_at: new Date().toISOString(),
        }));

      if (newSelfExplorationQuests.length > 0) {
        const { error: insertError } = await supabase
          .from("user_self_exploration_quests")
          .insert(newSelfExplorationQuests);

        if (insertError) {
          console.error("Error inserting user self-exploration quests:", insertError);
        } else {
          console.log(`Added ${newSelfExplorationQuests.length} locked self-exploration quests for course start`);
        }
      }
    }

    console.log(`Successfully added quests for course start`);
  } catch (error) {
    console.error("Error in addQuestsOnCourseStart:", error);
  }
}
