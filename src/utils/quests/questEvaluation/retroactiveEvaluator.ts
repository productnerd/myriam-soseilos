
import { supabase } from "@/integrations/supabase/client";
import { evaluateUserQuests } from "./questEvaluator";
import { QuestEvaluationContext } from "./types";
import { QUEST_STATES, QUEST_CONDITION_TYPES } from "./constants";

/**
 * Performs retroactive quest evaluation for existing users
 * This should be called when new quests are added to check if existing users already qualify
 * Excludes ADMIN_CHECK quests as they require manual review
 */
export async function performRetroactiveQuestCheck(sidequestId: string) {
  console.log('🔄 Starting retroactive quest evaluation for quest:', sidequestId);

  try {
    // First check if this quest requires admin review
    console.log('📋 Checking quest condition type...');
    const { data: questData, error: questCheckError } = await supabase
      .from('sidequests')
      .select('condition_type, title')
      .eq('id', sidequestId)
      .single();

    if (questCheckError) {
      console.error('❌ Error fetching quest data:', questCheckError);
      throw questCheckError;
    }

    if (questData.condition_type === QUEST_CONDITION_TYPES.ADMIN_CHECK) {
      console.log(`⚠️ Skipping retroactive evaluation for ADMIN_CHECK quest: ${questData.title} - requires manual review`);
      return;
    }

    console.log(`📋 Quest "${questData.title}" is evaluable, proceeding with retroactive check...`);

    // Get all users who have this quest in LIVE state
    console.log('📋 Fetching user quests in LIVE state...');
    const { data: userQuests, error: questError } = await supabase
      .from('user_sidequests')
      .select('id, user_id, sidequest_id, state')
      .eq('sidequest_id', sidequestId)
      .eq('state', 'LIVE');

    if (questError) {
      console.error('❌ Error fetching user quests:', questError);
      throw questError;
    }

    if (!userQuests || userQuests.length === 0) {
      console.log('📝 No LIVE user quests found for this sidequest');
      return;
    }

    console.log(`📊 Found ${userQuests.length} user quest entries for evaluation`);

    // Get unique user IDs to avoid processing the same user multiple times
    const uniqueUserIds = [...new Set(userQuests.map(uq => uq.user_id))];
    console.log(`👥 Unique users to process: ${uniqueUserIds.length}`);
    
    // Fetch profile data for unique users only
    console.log('📋 Fetching user profiles...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, grey_points, dark_points, streak')
      .in('id', uniqueUserIds);

    if (profileError) {
      console.error('❌ Error fetching user profiles:', profileError);
      throw profileError;
    }

    // Create a map for quick profile lookup
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });

    console.log('👥 Profile data fetched for users:', profiles?.map(p => ({
      userId: p.id,
      greyPoints: p.grey_points,
      darkPoints: p.dark_points,
      streak: p.streak
    })));

    let completedCount = 0;
    const evaluationErrors = [];

    // Process each unique user only once
    for (const userId of uniqueUserIds) {
      try {
        console.log(`🔍 Starting evaluation for user ${userId}`);
        
        const profile = profileMap.get(userId);
        if (!profile) {
          console.warn(`⚠️ No profile found for user ${userId}, skipping`);
          continue;
        }

        const context: QuestEvaluationContext = {
          userId: userId,
          eventType: 'retroactive_check',
          eventData: {
            greyPoints: profile.grey_points || 0,
            darkPoints: profile.dark_points || 0,
            streak: profile.streak || 0
          }
        };

        console.log(`📊 Evaluation context for user ${userId}:`, context);

        // Evaluate this specific quest for this user using the proper quest evaluator
        console.log(`⚙️ Calling evaluateUserQuests for user ${userId}...`);
        const results = await evaluateUserQuests(context);
        console.log(`📈 Quest evaluation results for user ${userId}:`, results);
        
        // Check if this specific quest was completed
        const questResult = results.find(result => 
          result.questId === sidequestId && result.isCompleted
        );

        console.log(`🎯 Specific quest result for user ${userId}:`, questResult);

        if (questResult && questResult.isCompleted) {
          console.log(`✅ User ${userId} meets quest conditions, updating all their quest entries...`);
          
          // Find all quest entries for this user and quest combination
          const userQuestEntries = userQuests.filter(uq => uq.user_id === userId);
          console.log(`📝 Found ${userQuestEntries.length} quest entries to update for user ${userId}`);
          
          // Mark all entries as completed
          for (const userQuest of userQuestEntries) {
            const { error: updateError } = await supabase
              .from('user_sidequests')
              .update({
                state: QUEST_STATES.COMPLETED,
                completed_at: new Date().toISOString(),
                rewards_claimed: false
              })
              .eq('id', userQuest.id);

            if (updateError) {
              console.error(`❌ Error updating quest entry ${userQuest.id} for user ${userId}:`, updateError);
              evaluationErrors.push({
                userId: userId,
                questEntryId: userQuest.id,
                error: `Database update failed: ${updateError.message}`
              });
            } else {
              console.log(`✅ Quest entry ${userQuest.id} for user ${userId} marked as completed`);
            }
          }
          
          completedCount++;
        } else {
          console.log(`❌ User ${userId} does not meet quest conditions yet`);
        }

      } catch (error) {
        console.error(`❌ Error processing user ${userId}:`, error);
        evaluationErrors.push({
          userId: userId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        continue;
      }
    }

    console.log(`🎯 Retroactive evaluation complete. ${completedCount} users completed the quest.`);
    
    if (evaluationErrors.length > 0) {
      console.error('❌ Evaluation errors encountered:', evaluationErrors);
      throw new Error(`Evaluation completed with ${evaluationErrors.length} errors. Check console for details.`);
    }
    
  } catch (error) {
    console.error('❌ Error in retroactive quest evaluation:', error);
    throw error;
  }
}

/**
 * Trigger retroactive evaluation for all active quests (excluding ADMIN_CHECK)
 */
export async function checkAllActiveQuestsRetroactively() {
  console.log('🔄 Starting full retroactive quest evaluation (excluding ADMIN_CHECK)');

  try {
    const { data: quests, error } = await supabase
      .from('sidequests')
      .select('id, title, condition_type')
      .eq('status', 'ACTIVE')
      .neq('condition_type', QUEST_CONDITION_TYPES.ADMIN_CHECK);

    if (error) {
      console.error('❌ Error fetching active quests:', error);
      return;
    }

    if (!quests || quests.length === 0) {
      console.log('📝 No evaluable active quests found');
      return;
    }

    console.log(`📊 Found ${quests.length} evaluable active quests to check retroactively`);

    for (const quest of quests) {
      console.log(`🔄 Checking quest: ${quest.title} (condition_type: ${quest.condition_type})`);
      await performRetroactiveQuestCheck(quest.id);
    }

    console.log('✅ Full retroactive evaluation complete');
    
  } catch (error) {
    console.error('❌ Error in full retroactive evaluation:', error);
  }
}
