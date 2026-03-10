
// Quest states
export const QUEST_STATES = {
  LIVE: 'LIVE',
  COMPLETED: 'COMPLETED',
  IN_REVIEW: 'IN_REVIEW',
  EXPIRED: 'EXPIRED',
  LOCKED: 'LOCKED'
} as const;

// Condition types
export const CONDITION_TYPES = {
  GREY_POINTS: 'grey_points',
  DARK_POINTS: 'dark_points',
  STREAK: 'streak',
  ACTIVITIES_COMPLETED: 'activities_completed',
  TOPICS_COMPLETED: 'topics_completed'
} as const;

// Operators
export const OPERATORS = {
  GREATER_THAN_OR_EQUAL: '>=',
  GREATER_THAN: '>',
  LESS_THAN_OR_EQUAL: '<=',
  LESS_THAN: '<',
  EQUAL: '='
} as const;

// Quest condition types
export const QUEST_CONDITION_TYPES = {
  SIMPLE_CONDITIONS: 'SIMPLE_CONDITIONS',
  CUSTOM_CODE: 'CUSTOM_CODE',
  ADMIN_CHECK: 'ADMIN_CHECK'
} as const;
