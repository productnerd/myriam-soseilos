
import React from "react";
import { Key } from "lucide-react";
import { SelfExplorationQuest } from "@/types/self-exploration";
import { pointTypes } from "@/lib/ui";

interface SelfExplorationQuestCardContentProps {
  quest: SelfExplorationQuest;
}

const SelfExplorationQuestCardContent: React.FC<SelfExplorationQuestCardContentProps> = ({
  quest,
}) => {
  // Check if we should show points (only if values are greater than 0)
  const hasRewards = quest.grey_token_reward > 0 || quest.dark_token_reward > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Main content area - takes up available space */}
      <div className="flex-1" />
      
      {/* Bottom content - always at bottom with consistent positioning */}
      <div className="mt-auto space-y-4">
        {/* PERSONALISED Report Section */}
        {quest.personalised_result && (
          <div className="border border-white/20 rounded-lg p-3 bg-white/5 backdrop-blur-md text-white">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-white/80" />
              <span className="text-sm font-medium text-white/90">PERSONALISED REPORT</span>
            </div>
            <p className="text-sm text-white/85">
              {quest.personalised_result}
            </p>
          </div>
        )}

        {/* Friends thumbnails and points row */}
        <div className="flex items-center justify-between">
          {/* Friends thumbnails on the left */}
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"></div>
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white"></div>
            <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white"></div>
          </div>

          {/* Points on the right - only show if rewards exist */}
          {hasRewards && (
            <div className="flex gap-2">
              {quest.grey_token_reward > 0 && (
                <div className={`flex items-center ${pointTypes.grey.bgLight} ${pointTypes.grey.borderLight} border rounded-full px-2 py-0.5`}>
                  <pointTypes.grey.icon className={`h-3.5 w-3.5 mr-1 ${pointTypes.grey.textColor}`} />
                  <span className={`text-xs font-medium ${pointTypes.grey.textColor}`}>
                    {quest.grey_token_reward}
                  </span>
                </div>
              )}
              {quest.dark_token_reward > 0 && (
                <div className={`flex items-center ${pointTypes.dark.bgLight} ${pointTypes.dark.borderLight} border rounded-full px-2 py-0.5`}>
                  <pointTypes.dark.icon className={`h-3.5 w-3.5 mr-1 ${pointTypes.dark.textColor}`} />
                  <span className={`text-xs font-medium ${pointTypes.dark.textColor}`}>
                    {quest.dark_token_reward}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfExplorationQuestCardContent;
