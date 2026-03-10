
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useActivityEdit = () => {
  const queryClient = useQueryClient();
  
  const { mutateAsync, isPending: isUpdating } = useMutation({
    mutationFn: async (payload: {
      activityId: string;
      updates: {
        main_text?: string;
        correct_answer?: string;
        explanation?: string;
        options?: any;
      };
    }) => {
      const { data, error } = await supabase
        .from("activities")
        .update({
          main_text: payload.updates.main_text,
          correct_answer: payload.updates.correct_answer,
          explanation: payload.updates.explanation,
          options: payload.updates.options,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payload.activityId)
        .select();

      if (error) {
        toast.error(`Error updating activity: ${error.message}`);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Activity updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-community-notes"] });
    },
    onError: (error) => {
      toast.error(`Failed to update activity: ${error}`);
    },
  });

  const updateActivity = async (
    activityId: string, 
    updates: {
      main_text?: string;
      correct_answer?: string;
      explanation?: string;
      options?: any;
    }
  ) => {
    return mutateAsync({ activityId, updates });
  };

  return {
    updateActivity,
    isUpdating,
  };
};
