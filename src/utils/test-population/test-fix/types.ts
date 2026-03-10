
/**
 * Type definitions for test fixing operations
 */

export interface TestFixResult {
  success: boolean;
  fixed: number;
  alreadyCorrect: number;
  failed: number;
  testDetails: Array<TestDetail>;
}

export interface TestDetail {
  id: string;
  title: string;
  activityCount: number;
  fixed: boolean;
}
