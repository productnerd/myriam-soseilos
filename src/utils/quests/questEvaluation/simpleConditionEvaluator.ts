
import { supabase } from "@/integrations/supabase/client";
import { QuestEvaluationContext, QuestCondition } from "./types";
import { CONDITION_TYPES, OPERATORS } from "./constants";

/**
 * Evaluates simple quest conditions like grey_points >= 5000
 */
class SimpleConditionEvaluator {
  async evaluate(questId: string, context: QuestEvaluationContext): Promise<boolean> {
    console.log('🔍 Evaluating simple conditions for quest:', questId);
    
    try {
      // Get quest conditions from database
      console.log('📋 Fetching quest conditions from database...');
      const { data: conditions, error } = await supabase
        .from('quest_conditions')
        .select('condition_type, operator, target_value')
        .eq('sidequest_id', questId);

      if (error) {
        console.error('❌ Error fetching quest conditions:', error);
        return false;
      }

      if (!conditions || conditions.length === 0) {
        console.log('⚠️ No conditions found for quest, defaulting to false');
        return false;
      }

      console.log('📋 Quest conditions found:', conditions);

      // Evaluate all conditions (AND logic - all must be true)
      for (const condition of conditions) {
        console.log(`🔍 Evaluating condition: ${condition.condition_type} ${condition.operator} ${condition.target_value}`);
        const conditionMet = await this.evaluateCondition(condition, context);
        console.log(`📊 Condition result: ${conditionMet}`);
        
        if (!conditionMet) {
          console.log(`❌ Condition failed: ${condition.condition_type} ${condition.operator} ${condition.target_value}`);
          return false;
        }
      }

      console.log('✅ All conditions met for quest:', questId);
      return true;
    } catch (error) {
      console.error('❌ Error evaluating simple conditions:', error);
      return false;
    }
  }

  private async evaluateCondition(condition: QuestCondition, context: QuestEvaluationContext): Promise<boolean> {
    const { condition_type, operator, target_value } = condition;
    
    console.log(`🔍 Evaluating condition details:`, {
      condition_type,
      operator,
      target_value,
      contextData: context.eventData
    });
    
    let actualValue: number;
    
    // Get the actual value based on condition type
    switch (condition_type) {
      case CONDITION_TYPES.GREY_POINTS:
        actualValue = context.eventData.greyPoints || 0;
        console.log(`📊 Grey points: ${actualValue}`);
        break;
      case CONDITION_TYPES.DARK_POINTS:
        actualValue = context.eventData.darkPoints || 0;
        console.log(`📊 Dark points: ${actualValue}`);
        break;
      case CONDITION_TYPES.STREAK:
        actualValue = context.eventData.streak || 0;
        console.log(`📊 Streak: ${actualValue}`);
        break;
      default:
        console.warn(`⚠️ Unknown condition type: ${condition_type}`);
        return false;
    }

    const targetValue = parseInt(target_value);
    console.log(`📊 Comparing: ${actualValue} ${operator} ${targetValue}`);
    
    // Evaluate based on operator
    let result: boolean;
    switch (operator) {
      case OPERATORS.GREATER_THAN_OR_EQUAL:
      case '>=':
      case 'gte':
        result = actualValue >= targetValue;
        break;
      case OPERATORS.GREATER_THAN:
      case '>':
      case 'gt':
        result = actualValue > targetValue;
        break;
      case OPERATORS.LESS_THAN_OR_EQUAL:
      case '<=':
      case 'lte':
        result = actualValue <= targetValue;
        break;
      case OPERATORS.LESS_THAN:
      case '<':
      case 'lt':
        result = actualValue < targetValue;
        break;
      case OPERATORS.EQUAL:
      case '=':
      case '==':
      case 'eq':
        result = actualValue === targetValue;
        break;
      default:
        console.warn(`⚠️ Unknown operator: ${operator}`);
        return false;
    }
    
    console.log(`📊 Condition evaluation result: ${result}`);
    return result;
  }
}

export const simpleConditionEvaluator = new SimpleConditionEvaluator();
