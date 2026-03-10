
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useNewTopicNotifications = () => {
  const queryClient = useQueryClient();

  const signUpForNotifications = useMutation({
    mutationFn: async ({ userId, courseId }: { userId: string; courseId: string }) => {
      console.log('🔔 Signing up for new topic notifications:', { userId, courseId });
      
      const { data, error } = await supabase
        .from('new_topic_notifications')
        .insert([{
          user_id: userId,
          course_id: courseId
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Error signing up for notifications:', error);
        throw error;
      }

      console.log('✅ Successfully signed up for notifications:', data);
      return data;
    },
    onSuccess: () => {
      toast.success('You\'ll be notified when new topics are added!');
      queryClient.invalidateQueries({ queryKey: ['new-topic-notifications'] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to sign up for notifications:', error);
      if (error.code === '23505') {
        toast.info('You\'re already signed up for notifications for this course!');
      } else {
        toast.error('Failed to sign up for notifications. Please try again.');
      }
    }
  });

  const checkNotificationStatus = async (userId: string, courseId: string) => {
    const { data, error } = await supabase
      .from('new_topic_notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error checking notification status:', error);
      return false;
    }

    return !!data;
  };

  return {
    signUpForNotifications,
    checkNotificationStatus,
    isLoading: signUpForNotifications.isPending
  };
};
