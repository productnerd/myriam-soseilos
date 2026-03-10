
import React from "react";
import { SelfExplorationQuest } from "@/types/self-exploration";
import { supabase } from "@/integrations/supabase/client";

interface SelfExplorationResultsHeaderProps {
  quest: SelfExplorationQuest;
}

const SelfExplorationResultsHeader: React.FC<SelfExplorationResultsHeaderProps> = ({
  quest,
}) => {
  // Get proper storage URL for background image
  const getStorageUrl = (fileName: string, bucketName: string) => {
    if (!fileName) return null;
    if (fileName.startsWith('http')) return fileName;
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Get proper storage URL for quest icon
  const getIconStorageUrl = (fileName: string) => {
    if (!fileName) return null;
    if (fileName.startsWith('http')) return fileName;
    const { data } = supabase.storage.from('icon-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const backgroundImage = quest.image ? getStorageUrl(quest.image, 'background-images') : null;
  const iconUrl = quest.icon ? getIconStorageUrl(quest.icon) : null;

  if (!backgroundImage) return null;

  return (
    <div className="relative w-full h-48 bg-cover bg-center rounded-lg overflow-hidden">
      <img 
        src={backgroundImage} 
        alt="Quest banner" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
        {iconUrl && (
          <img 
            src={iconUrl} 
            alt="Quest icon" 
            className="w-16 h-16 object-contain mb-4" 
            onError={(e) => {
              console.error("Failed to load quest icon:", iconUrl);
              e.currentTarget.style.display = 'none';
            }} 
          />
        )}
        <h1 className="text-3xl font-bold text-white text-center px-4">
          {quest.title}
        </h1>
      </div>
    </div>
  );
};

export default SelfExplorationResultsHeader;
