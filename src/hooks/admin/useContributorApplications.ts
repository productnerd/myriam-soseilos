
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useContributorApplications = () => {
  const queryClient = useQueryClient();

  const approveApplication = useMutation({
    mutationFn: async ({
      id,
      notes
    }: {
      id: string;
      notes: string;
    }) => {
      const { error: approvalError } = await supabase
        .from('contributor_applications')
        .update({
          status: 'approved',
          admin_notes: notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (approvalError) throw approvalError;

      // Get the welcome message template
      const { data: templateData, error: templateError } = await supabase
        .from('message_templates')
        .select('*')
        .eq('tag', 'Contributor')
        .single();

      if (templateError) {
        console.error('Error fetching welcome message template:', templateError);
        return;
      }

      // Get the user ID from the application
      const { data: applicationData } = await supabase
        .from('contributor_applications')
        .select('user_id')
        .eq('id', id)
        .single();

      if (applicationData?.user_id) {
        // Send welcome message using the template
        const { error: messageError } = await supabase
          .from('user_messages')
          .insert({
            user_id: applicationData.user_id,
            title: templateData.title,
            payload: templateData.payload,
            tag: templateData.tag,
            is_read: false
          });

        if (messageError) {
          console.error('Error sending welcome message:', messageError);
          toast.error('Error sending welcome message');
        }
      }
    },
    onSuccess: () => {
      toast.success('Application approved');
      queryClient.invalidateQueries({
        queryKey: ['contributor-applications']
      });
      queryClient.invalidateQueries({
        queryKey: ['pending-contributors-count']
      });
    }
  });

  const rejectApplication = useMutation({
    mutationFn: async ({
      id,
      notes
    }: {
      id: string;
      notes: string;
    }) => {
      const { error } = await supabase
        .from('contributor_applications')
        .update({
          status: 'rejected',
          admin_notes: notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Application rejected');
      queryClient.invalidateQueries({
        queryKey: ['contributor-applications']
      });
      queryClient.invalidateQueries({
        queryKey: ['pending-contributors-count']
      });
    }
  });

  return {
    approveApplication,
    rejectApplication
  };
};
