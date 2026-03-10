
import { SidequestCompletion } from './types';

/**
 * Process sidequest completion data from raw format
 */
export function processSidequestData(sidequestsData: any): SidequestCompletion[] {
  if (!Array.isArray(sidequestsData)) {
    try {
      sidequestsData = typeof sidequestsData === 'string'
        ? JSON.parse(sidequestsData)
        : [];
    } catch (e) {
      console.error("Error processing sidequest data:", e);
      return [];
    }
  }
  
  // Sort by completion rate in descending order
  if (Array.isArray(sidequestsData)) {
    return sidequestsData
      .sort((a: SidequestCompletion, b: SidequestCompletion) => b.completion_rate - a.completion_rate);
  }
  
  return [];
}
