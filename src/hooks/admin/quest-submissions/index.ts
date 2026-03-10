
import { useState } from 'react';
import { useQuestSubmissionsQuery } from './useQuestSubmissionsQuery';
import { useQuestSubmissionsMutation } from './useQuestSubmissionsMutation';

/**
 * Main hook for managing quest submissions
 */
export function useQuestSubmissions() {
  const [selectedSidequest, setSelectedSidequest] = useState<string | null>(null);
  const { submissionGroups, selectedSubmissions, isLoading, error } = useQuestSubmissionsQuery(selectedSidequest);
  const { approveSubmission, rejectSubmission } = useQuestSubmissionsMutation();

  return {
    submissionGroups,
    selectedSubmissions,
    selectedSidequest,
    setSelectedSidequest,
    isLoading,
    error,
    approveSubmission,
    rejectSubmission
  };
}
