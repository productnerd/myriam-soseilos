
import React from "react";
import { SelfExplorationResult } from "@/types/self-exploration";

interface SelfExplorationResultsContentProps {
  result: SelfExplorationResult;
}

const formatMarkdownText = (text: string): JSX.Element => {
  // Split text by lines to handle headings and other markdown
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  
  lines.forEach((line, index) => {
    if (line.startsWith('### ')) {
      // H3 heading
      elements.push(
        <h3 key={index} className="text-lg font-semibold mt-4 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      // H2 heading
      elements.push(
        <h2 key={index} className="text-xl font-semibold mt-4 mb-2">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      // H1 heading
      elements.push(
        <h1 key={index} className="text-2xl font-bold mt-4 mb-3">
          {line.replace('# ', '')}
        </h1>
      );
    } else {
      // Regular text with bold formatting
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formattedLine = (
        <p key={index} className="mb-2">
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const boldText = part.slice(2, -2);
              return <strong key={partIndex}>{boldText}</strong>;
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </p>
      );
      elements.push(formattedLine);
    }
  });
  
  return <>{elements}</>;
};

const SelfExplorationResultsContent: React.FC<SelfExplorationResultsContentProps> = ({
  result,
}) => {
  return (
    <div className="p-4 bg-muted rounded-lg mb-4">
      <div className="whitespace-pre-wrap">
        {result.ai_response ? formatMarkdownText(result.ai_response) : (
          <div className="text-center text-muted-foreground">
            <p>Your personalized report is being generated...</p>
            <p className="text-sm mt-2">This may take a moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfExplorationResultsContent;
