
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { performRetroactiveQuestCheck, checkAllActiveQuestsRetroactively } from "@/utils/quests/questEvaluation";

export function useRetroactiveQuestEvaluation() {
  const [isEvaluating, setIsEvaluating] = useState(false);

  const evaluateSpecificQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      setIsEvaluating(true);
      await performRetroactiveQuestCheck(questId);
    },
    onSuccess: () => {
      toast.success("Retroactive quest evaluation completed!");
    },
    onError: (error) => {
      console.error("Error in retroactive evaluation:", error);
      toast.error("Failed to complete retroactive evaluation");
    },
    onSettled: () => {
      setIsEvaluating(false);
    }
  });

  const evaluateAllQuestsMutation = useMutation({
    mutationFn: async () => {
      setIsEvaluating(true);
      await checkAllActiveQuestsRetroactively();
    },
    onSuccess: () => {
      toast.success("Full retroactive quest evaluation completed!");
    },
    onError: (error) => {
      console.error("Error in full retroactive evaluation:", error);
      toast.error("Failed to complete full retroactive evaluation");
    },
    onSettled: () => {
      setIsEvaluating(false);
    }
  });

  return {
    evaluateSpecificQuest: evaluateSpecificQuestMutation.mutate,
    evaluateAllQuests: evaluateAllQuestsMutation.mutate,
    isEvaluating,
  };
}
