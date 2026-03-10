
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MessageTemplate {
  id: string;
  title: string;
  payload: string;
  tag: string;
  description: string | null;
  image_url: string | null;
}

interface UpdateTemplateInput {
  id: string;
  title: string;
  payload: string;
  tag: string;
  description?: string;
  image_url?: string;
}

export const useMessageTemplates = () => {
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery<MessageTemplate[]>({
    queryKey: ['message-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const updateTemplate = useMutation({
    mutationFn: async (input: UpdateTemplateInput) => {
      const { error } = await supabase
        .from('message_templates')
        .update({
          title: input.title,
          payload: input.payload,
          tag: input.tag,
          description: input.description,
          image_url: input.image_url
        })
        .eq('id', input.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Template updated successfully');
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
    },
    onError: (error) => {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    }
  });

  return {
    templates,
    isLoading,
    updateTemplate
  };
};
