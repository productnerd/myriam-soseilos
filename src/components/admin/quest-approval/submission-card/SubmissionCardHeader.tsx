
import React from "react";
import { QuestSubmission } from "@/types/quests";

interface SubmissionCardHeaderProps {
  submission: QuestSubmission;
}

const SubmissionCardHeader: React.FC<SubmissionCardHeaderProps> = ({ submission }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h3 className="font-semibold">{submission.sidequest?.title}</h3>
        <p className="text-sm text-muted-foreground">
          Submitted by {submission.user?.name || submission.user?.email}
        </p>
      </div>
      <div className="text-sm text-muted-foreground">
        {new Date(submission.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default SubmissionCardHeader;
