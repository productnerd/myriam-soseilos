
import { QuestEvaluationContext } from "./types";

/**
 * Registry of custom condition handlers for quests with CUSTOM_CODE condition type
 * Each handler receives the evaluation context and returns a boolean indicating completion
 */
export const customConditionHandlers: Record<string, (context: QuestEvaluationContext) => Promise<boolean>> = {
  
  /**
   * Example custom handler - can be used as a template for other custom logic
   */
  async checkSpecialQuestLogic(context: QuestEvaluationContext): Promise<boolean> {
    console.log('🔧 Executing checkSpecialQuestLogic for user:', context.userId);
    
    // Custom logic goes here - this is just an example
    // You can access user data via context.eventData or make additional database queries
    
    // Example: Check if user has specific combination of points and streak
    const hasEnoughPoints = context.eventData.greyPoints >= 1000 && context.eventData.darkPoints >= 100;
    const hasGoodStreak = context.eventData.streak >= 7;
    
    return hasEnoughPoints && hasGoodStreak;
  },

  /**
   * Add more custom handlers here as needed
   * Format: handlerName: async (context) => boolean
   */
  
};

/**
 * Register a new custom condition handler
 */
export function registerCustomHandler(name: string, handler: (context: QuestEvaluationContext) => Promise<boolean>) {
  customConditionHandlers[name] = handler;
  console.log(`📋 Registered custom handler: ${name}`);
}
