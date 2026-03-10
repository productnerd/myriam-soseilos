
import { evaluateUserQuests } from "./questEvaluator";
import { QuestEvaluationContext } from "./types";

/**
 * Event emitter for quest evaluation
 * Triggers quest completion checks when certain events occur
 */
export const questEventEmitter = {
  /**
   * Emit grey points change event
   */
  async emitGreyPointsChange(userId: string, newTotal: number) {
    console.log('🔔 Grey points changed for user:', userId, 'new total:', newTotal);
    
    const context: QuestEvaluationContext = {
      userId,
      eventType: 'grey_points_change',
      eventData: { newTotal }
    };

    await evaluateUserQuests(context);
  },

  // Future event emitters can be added here:
  // async emitTopicCompleted(userId: string, topicId: string) { ... },
  // async emitCourseCompleted(userId: string, courseId: string) { ... },
  // async emitStreakChanged(userId: string, newStreak: number) { ... },
};
