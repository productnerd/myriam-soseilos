
/**
 * This is the main entry point for test fixing functionality.
 * It exports all the functions needed by other modules.
 */

export { fixAllTestsActivities as fixAllTestActivities } from './all-tests-fixer';
export { fixTestActivities } from './single-test-fixer';
export { REQUIRED_ACTIVITIES_PER_TEST } from './constants';
export type { TestFixResult, TestDetail } from './types';
