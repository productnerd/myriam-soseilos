
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAdminCounts() {
  // Count pending activity submissions
  const pendingActivitiesQuery = useQuery({
    queryKey: ['pending-activity-submissions-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('new_activity_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error fetching pending activities count:', error);
        throw error;
      }
      return count || 0;
    }
  });

  // Count pending contributor applications
  const pendingContributorsQuery = useQuery({
    queryKey: ['pending-contributors-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contributor_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error fetching pending contributors count:', error);
        throw error;
      }
      return count || 0;
    }
  });

  // Count unread feedback (removed is_read field dependency)
  const unreadFeedbackQuery = useQuery({
    queryKey: ['user-feedback-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_feedback')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching feedback count:', error);
        throw error;
      }
      return count || 0;
    }
  });

  return {
    pendingActivitiesCount: pendingActivitiesQuery.data || 0,
    pendingContributorsCount: pendingContributorsQuery.data || 0,
    unreadFeedbackCount: unreadFeedbackQuery.data || 0,
    isLoading: pendingActivitiesQuery.isLoading || pendingContributorsQuery.isLoading || unreadFeedbackQuery.isLoading,
    error: pendingActivitiesQuery.error || pendingContributorsQuery.error || unreadFeedbackQuery.error
  };
}
