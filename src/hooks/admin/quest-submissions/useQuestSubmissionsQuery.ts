
import { useSubmissionGroups } from './queries/useSubmissionGroups';
import { useSelectedSubmissions } from './queries/useSelectedSubmissions';
import { QuestSubmissionsQueryResult } from './types';

/**
 * Hook for fetching quest submissions data
 */
export function useQuestSubmissionsQuery(selectedSidequest: string | null): QuestSubmissionsQueryResult {
  // Query for all submissions grouped by sidequest
  const submissionsGroupsQuery = useSubmissionGroups();
  
  // Query for submissions for a specific sidequest
  const selectedSubmissionsQuery = useSelectedSubmissions(selectedSidequest);

  return {
    submissionGroups: submissionsGroupsQuery.data || [],
    selectedSubmissions: selectedSubmissionsQuery.data || [],
    isLoading: submissionsGroupsQuery.isLoading,
    error: submissionsGroupsQuery.error as Error | null
  };
}
