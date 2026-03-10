
import { supabase } from "@/integrations/supabase/client";

/**
 * Unlocks quests that have the completed quest as a prerequisite
 * Called after a quest is marked as completed
 */
export async function unlockDependentQuests(completedSidequestId: string, userId: string) {
  console.log('🔓 Checking for dependent quests to unlock after completing:', completedSidequestId);

  try {
    // Find all sidequests that have this completed quest as a prerequisite
    const { data: dependentSidequests, error: sidequestError } = await supabase
      .from('sidequests')
      .select('id, title')
      .eq('prerequisite_sidequest_id', completedSidequestId);

    if (sidequestError) {
      console.error('❌ Error fetching dependent sidequests:', sidequestError);
      return;
    }

    if (!dependentSidequests || dependentSidequests.length === 0) {
      console.log('📝 No dependent quests found for completed sidequest');
      return;
    }

    console.log(`🎯 Found ${dependentSidequests.length} dependent quests to potentially unlock:`, 
      dependentSidequests.map(sq => sq.title));

    // For each dependent sidequest, check if the user has it in LOCKED state and unlock it
    for (const dependentSidequest of dependentSidequests) {
      const { data: userSidequest, error: userSidequestError } = await supabase
        .from('user_sidequests')
        .select('id, state')
        .eq('user_id', userId)
        .eq('sidequest_id', dependentSidequest.id)
        .single();

      if (userSidequestError) {
        console.error(`❌ Error fetching user sidequest for ${dependentSidequest.title}:`, userSidequestError);
        continue;
      }

      if (userSidequest && userSidequest.state === 'LOCKED') {
        // Unlock the dependent quest
        const { error: updateError } = await supabase
          .from('user_sidequests')
          .update({ state: 'LIVE' })
          .eq('id', userSidequest.id);

        if (updateError) {
          console.error(`❌ Error unlocking dependent quest ${dependentSidequest.title}:`, updateError);
        } else {
          console.log(`✅ Successfully unlocked dependent quest: ${dependentSidequest.title}`);
        }
      } else {
        console.log(`📝 Quest ${dependentSidequest.title} is not in LOCKED state (current: ${userSidequest?.state})`);
      }
    }
  } catch (error) {
    console.error('❌ Error in unlockDependentQuests:', error);
  }
}
