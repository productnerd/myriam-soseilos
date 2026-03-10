
export interface SelfExplorationQuest {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  grey_token_reward: number;
  dark_token_reward: number;
  grey_unlock?: number;
  topic_id?: string;
  completion_count?: number;
  created_at: string;
  personalised_result?: string;
  // New fields for self-exploration
  custom_prompt?: string;
  questions: SelfExplorationQuestion[];
  show_quest_social_stats: boolean;
  quest_type: 'general' | 'grouping';
}

export interface SelfExplorationQuestion {
  type: 'MULTIPLE_CHOICE' | 'TEXT_POLL' | 'IMAGE_POLL';
  question: string;
  options?: string[];
  show_social_stats: boolean;
}

export interface UserSelfExplorationQuest {
  id: string;
  user_id: string;
  self_exploration_quest_id: string;
  state: 'LIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  progress?: number;
  completed_at?: string;
  is_hidden?: boolean;
  created_at: string;
  current_question_index: number;
  session_id?: string;
  self_exploration_quest: SelfExplorationQuest & {
    topic?: {
      id: string;
      title: string;
      level: {
        id: string;
        title: string;
        course: {
          id: string;
          title: string;
          color: string;
        };
      };
    };
  };
}

export interface SelfExplorationResponse {
  id: string;
  user_id: string;
  quest_id: string;
  question_index: number;
  question_text: string;
  response_value: string;
  created_at: string;
  session_id: string;
}

export interface SelfExplorationResult {
  id: string;
  user_id: string;
  quest_id: string;
  ai_response: string;
  prompt_used: string;
  responses_data: Record<string, any>;
  version_number: number;
  created_at: string;
  session_id: string;
}

export interface SelfExplorationRetake {
  id: string;
  user_id: string;
  quest_id: string;
  retake_date: string;
  retake_count: number;
}

export interface SelfExplorationQuestStats {
  id: string;
  quest_id: string;
  result_category: string;
  user_count: number;
  updated_at: string;
}
