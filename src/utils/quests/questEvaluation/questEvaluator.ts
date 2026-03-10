import { supabase } from "@/integrations/supabase/client";
import { simpleConditionEvaluator } from "./simpleConditionEvaluator";
import { customConditionHandlers } from "./customConditionHandlers";
import { QuestEvaluationContext, QuestEvaluationResult } from "./types";
import { QUEST_STATES, QUEST_CONDITION_TYPES } from "./constants";
import { unlockDependentQuests } from "./unlockDependentQuests";

/**
 * Main quest evaluator that checks all LIVE user sidequests for completion
 * Excludes ADMIN_CHECK quests as they require manual review
 */
export async function evaluateUserQuests(context: QuestEvaluationContext): Promise<QuestEvaluationResult[]> {
  console.log('🎯 Starting quest evaluation for user:', context.userId, 'event:', context.eventType);

  const results: QuestEvaluationResult[] = [];

  try {
    console.log('📋 Fetching user LIVE sidequests (excluding ADMIN_CHECK)...');
    const userSidequests = await fetchUserLiveSidequests(context.userId);
    
    if (!userSidequests || userSidequests.length === 0) {
      console.log('📝 No evaluable LIVE sidequests found for user');
      return results;
    }

    console.log(`📊 Found ${userSidequests.length} evaluable LIVE sidequests:`, 
      userSidequests.map(us => ({
        id: us.id,
        sidequestId: us.sidequest_id,
        title: us.sidequests?.title,
        conditionType: us.sidequests?.condition_type,
        customHandler: us.sidequests?.custom_handler
      }))
    );

    // Evaluate each sidequest
    for (const userSidequest of userSidequests) {
      console.log(`🔍 Evaluating sidequest "${userSidequest.sidequests?.title}" for user ${context.userId}`);
      const result = await evaluateSingleQuest(userSidequest, context);
      results.push(result);
      
      console.log(`📈 Quest evaluation result:`, result);
      
      if (result.isCompleted && !result.error) {
        console.log(`✅ Quest completed, marking in database...`);
        await markQuestCompleted(userSidequest.id);
        
        // Unlock any dependent quests
        console.log(`🔓 Checking for dependent quests to unlock...`);
        await unlockDependentQuests(userSidequest.sidequest_id, context.userId);
      }
    }
  } catch (error) {
    console.error('❌ Error in quest evaluation:', error);
    throw error;
  }

  console.log(`🎯 Quest evaluation complete. Results:`, results);
  return results;
}

async function fetchUserLiveSidequests(userId: string) {
  console.log(`📋 Fetching LIVE sidequests for user: ${userId} (excluding ADMIN_CHECK)`);
  
  const { data, error } = await supabase
    .from('user_sidequests')
    .select(`
      id,
      sidequest_id,
      state,
      sidequests!inner(
        id,
        condition_type,
        custom_handler,
        title
      )
    `)
    .eq('user_id', userId)
    .eq('state', QUEST_STATES.LIVE)
    .neq('sidequests.condition_type', QUEST_CONDITION_TYPES.ADMIN_CHECK);

  if (error) {
    console.error('❌ Error fetching user sidequests:', error);
    throw error;
  }

  console.log(`📊 Fetched ${data?.length || 0} evaluable LIVE sidequests for user ${userId}`);
  return data;
}

async function evaluateSingleQuest(userSidequest: any, context: QuestEvaluationContext): Promise<QuestEvaluationResult> {
  const sidequest = userSidequest.sidequests;
  
  try {
    console.log(`🔍 Evaluating single quest: "${sidequest.title}" (${sidequest.id})`);
    console.log(`📋 Quest condition type: ${sidequest.condition_type}`);
    console.log(`🔧 Custom handler: ${sidequest.custom_handler}`);
    
    let isCompleted = false;

    if (sidequest.condition_type === QUEST_CONDITION_TYPES.SIMPLE_CONDITIONS) {
      console.log(`⚙️ Evaluating simple conditions for quest: ${sidequest.id}`);
      isCompleted = await simpleConditionEvaluator.evaluate(sidequest.id, context);
      console.log(`📊 Simple condition evaluation result: ${isCompleted}`);
    } else if (sidequest.condition_type === QUEST_CONDITION_TYPES.CUSTOM_CODE) {
      console.log(`⚙️ Evaluating custom condition for quest: ${sidequest.id}`);
      isCompleted = await evaluateCustomCondition(sidequest.custom_handler, context);
      console.log(`📊 Custom condition evaluation result: ${isCompleted}`);
    } else if (sidequest.condition_type === QUEST_CONDITION_TYPES.ADMIN_CHECK) {
      console.log(`⚠️ Skipping ADMIN_CHECK quest: ${sidequest.title} - requires manual review`);
      isCompleted = false;
    } else {
      console.warn(`⚠️ Unknown condition type: ${sidequest.condition_type}`);
    }

    if (isCompleted) {
      console.log(`✅ Quest "${sidequest.title}" completed!`);
    } else {
      console.log(`❌ Quest "${sidequest.title}" not completed`);
    }

    return {
      questId: sidequest.id,
      userId: context.userId,
      isCompleted
    };
  } catch (error) {
    console.error(`❌ Error evaluating quest ${sidequest.title}:`, error);
    return {
      questId: sidequest.id,
      userId: context.userId,
      isCompleted: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Evaluate custom condition using registered handlers
 */
async function evaluateCustomCondition(handlerName: string | null, context: QuestEvaluationContext): Promise<boolean> {
  if (!handlerName) {
    console.warn('⚠️ Custom condition quest has no handler specified');
    return false;
  }

  console.log(`🔧 Looking for custom handler: ${handlerName}`);
  const handler = customConditionHandlers[handlerName];
  if (!handler) {
    console.warn(`⚠️ Custom condition handler "${handlerName}" not found`);
    console.log(`📋 Available handlers:`, Object.keys(customConditionHandlers));
    return false;
  }

  console.log(`⚙️ Executing custom handler: ${handlerName}`);
  const result = await handler(context);
  console.log(`📊 Custom handler result: ${result}`);
  return result;
}

/**
 * Mark a user sidequest as completed
 */
async function markQuestCompleted(userSidequestId: string) {
  console.log(`✅ Marking quest as completed: ${userSidequestId}`);
  
  const { error } = await supabase
    .from('user_sidequests')
    .update({
      state: QUEST_STATES.COMPLETED,
      completed_at: new Date().toISOString()
    })
    .eq('id', userSidequestId);

  if (error) {
    console.error('❌ Error marking quest as completed:', error);
    throw error;
  }

  console.log('✅ Quest marked as completed successfully:', userSidequestId);
}
