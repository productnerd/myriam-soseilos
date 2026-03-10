
// Context passed to quest evaluators
export interface QuestEvaluationContext {
  userId: string;
  eventType: string;
  eventData: {
    greyPoints: number;
    darkPoints: number;
    streak: number;
    [key: string]: any;
  };
}

// Quest condition from database
export interface QuestCondition {
  condition_type: string;
  operator: string;
  target_value: string;
}

// Result of quest evaluation
export interface QuestEvaluationResult {
  questId: string;
  userId: string;
  isCompleted: boolean;
  error?: string;
}
