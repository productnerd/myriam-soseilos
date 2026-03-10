
import React from "react";
import { QuestSubmission } from "@/types/quests";

interface SubmissionCardContentProps {
  submission: QuestSubmission;
}

const SubmissionCardContent: React.FC<SubmissionCardContentProps> = ({ submission }) => {
  return (
    <div className="p-4">
      <div className="space-y-3">
        {submission.user_description && (
          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{submission.user_description}</p>
          </div>
        )}
        
        {submission.user_comment && (
          <div>
            <h4 className="font-medium mb-1">Comment</h4>
            <p className="text-sm text-muted-foreground">{submission.user_comment}</p>
          </div>
        )}
        
        {submission.image && (
          <div>
            <h4 className="font-medium mb-1">Image</h4>
            <img 
              src={submission.image} 
              alt="Submission" 
              className="max-w-xs rounded border"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionCardContent;
