
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toggleQuestHiddenStatus } from "@/utils/quests/toggleQuest";
import { submitQuestForReview } from "@/utils/quests/submitQuest";
import { completeQuest } from "@/utils/quests/completeQuest";

export function useQuestsMutation() {
  const queryClient = useQueryClient();

  const toggleQuestHiddenStatusMutation = useMutation({
    mutationFn: async ({ questId, isHidden, questType }: { questId: string; isHidden: boolean; questType?: string }) => {
      console.log('useQuestsMutation.toggleQuestHiddenStatus called with:', {
        questId,
        isHidden,
        questType
      });

      if (questType === "self-exploration-quiz") {
        // Handle self-exploration quest
        const { data, error } = await supabase
          .from("user_self_exploration_quests")
          .update({ is_hidden: isHidden })
          .eq("id", questId)
          .select();

        if (error) throw error;
        return data;
      } else {
        // Handle regular quest
        return await toggleQuestHiddenStatus(questId, isHidden);
      }
    },
    onSuccess: (data, variables) => {
      console.log('Quest hidden status updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["selfExplorationQuests"] });
      
      const actionText = variables.isHidden ? "hidden" : "shown";
      toast.success(`Quest ${actionText} successfully`);
    },
    onError: (error) => {
      console.error("Error toggling quest hidden status:", error);
      toast.error("Failed to update quest visibility");
    },
  });

  const submitQuestForReviewMutation = useMutation({
    mutationFn: submitQuestForReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      toast.success("Quest submitted for review!");
    },
    onError: (error) => {
      console.error("Error submitting quest:", error);
      toast.error("Failed to submit quest. Please try again.");
    },
  });

  const completeQuestMutation = useMutation({
    mutationFn: completeQuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      toast.success("Quest completed!");
    },
    onError: (error) => {
      console.error("Error completing quest:", error);
      toast.error("Failed to complete quest. Please try again.");
    },
  });

  return {
    toggleQuestHiddenStatus: toggleQuestHiddenStatusMutation,
    submitQuestForReview: submitQuestForReviewMutation,
    completeQuest: completeQuestMutation,
  };
}
