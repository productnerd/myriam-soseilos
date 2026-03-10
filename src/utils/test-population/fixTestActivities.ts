
/**
 * This file is now a re-export of the functionality from the test-fix subdirectory.
 * This maintains backward compatibility while improving code organization.
 */

export { 
  fixAllTestActivities,
  fixTestActivities,
  REQUIRED_ACTIVITIES_PER_TEST
} from './test-fix';
export type { TestFixResult, TestDetail } from './test-fix/types';
