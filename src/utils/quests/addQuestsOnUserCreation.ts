
import { supabase } from "@/integrations/supabase/client";

/**
 * Add all active sidequests to a new user, respecting prerequisites
 * Quests with prerequisites are added as LOCKED, others as LIVE
 */
export async function addQuestsOnUserCreation(userId: string) {
  console.log('🎯 Adding quests to new user:', userId);

  try {
    // Get all active sidequests
    const { data: sidequests, error: sidequestError } = await supabase
      .from('sidequests')
      .select('id, title, prerequisite_sidequest_id')
      .eq('status', 'ACTIVE');

    if (sidequestError) {
      console.error('❌ Error fetching active sidequests:', sidequestError);
      return;
    }

    if (!sidequests || sidequests.length === 0) {
      console.log('📝 No active sidequests found');
      return;
    }

    console.log(`📊 Found ${sidequests.length} active sidequests to add`);

    // Prepare user_sidequests records
    const userSidequestRecords = sidequests.map(sidequest => ({
      user_id: userId,
      sidequest_id: sidequest.id,
      // Set state based on whether it has a prerequisite
      state: sidequest.prerequisite_sidequest_id ? 'LOCKED' : 'LIVE',
      created_at: new Date().toISOString()
    }));

    // Insert all user_sidequests records
    const { error: insertError } = await supabase
      .from('user_sidequests')
      .insert(userSidequestRecords);

    if (insertError) {
      console.error('❌ Error adding quests to user:', insertError);
      return;
    }

    const liveQuests = userSidequestRecords.filter(record => record.state === 'LIVE').length;
    const lockedQuests = userSidequestRecords.filter(record => record.state === 'LOCKED').length;

    console.log(`✅ Successfully added ${sidequests.length} quests to user:`, {
      live: liveQuests,
      locked: lockedQuests
    });
  } catch (error) {
    console.error('❌ Error in addQuestsOnUserCreation:', error);
  }
}

/**
 * Add all active self-exploration quests to a new user, respecting prerequisites
 */
export async function addSelfExplorationQuestsOnUserCreation(userId: string) {
  console.log('🎯 Adding self-exploration quests to new user:', userId);

  try {
    // Get all active self-exploration quests
    const { data: selfExplorationQuests, error: questError } = await supabase
      .from('self_exploration_quests')
      .select('id, title')
      .eq('status', 'ACTIVE');

    if (questError) {
      console.error('❌ Error fetching active self-exploration quests:', questError);
      return;
    }

    if (!selfExplorationQuests || selfExplorationQuests.length === 0) {
      console.log('📝 No active self-exploration quests found');
      return;
    }

    console.log(`📊 Found ${selfExplorationQuests.length} active self-exploration quests to add`);

    // Prepare user_self_exploration_quests records (these don't have prerequisites yet)
    const userQuestRecords = selfExplorationQuests.map(quest => ({
      user_id: userId,
      self_exploration_quest_id: quest.id,
      state: 'LIVE', // Self-exploration quests start as LIVE for now
      created_at: new Date().toISOString()
    }));

    // Insert all user_self_exploration_quests records
    const { error: insertError } = await supabase
      .from('user_self_exploration_quests')
      .insert(userQuestRecords);

    if (insertError) {
      console.error('❌ Error adding self-exploration quests to user:', insertError);
      return;
    }

    console.log(`✅ Successfully added ${selfExplorationQuests.length} self-exploration quests to user`);
  } catch (error) {
    console.error('❌ Error in addSelfExplorationQuestsOnUserCreation:', error);
  }
}
