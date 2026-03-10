
import { supabase } from '@/integrations/supabase/client';
import { PopularSkill } from './types';

/**
 * Fetches and processes skill votes data to calculate popular skills
 */
export async function fetchPopularSkills(): Promise<PopularSkill[]> {
  console.log("Fetching skill votes data...");
  
  const { data: skillVotesData, error: skillVotesError } = await supabase
    .from('onboarding_skill_votes')
    .select('skills');
    
  if (skillVotesError) {
    console.error('Error fetching skill votes:', skillVotesError);
    return [];
  } else {
    console.log("Raw skill votes data:", skillVotesData);
  }
  
  // Calculate popular skills from the raw vote data
  let popularSkills: PopularSkill[] = [];
  if (skillVotesData && skillVotesData.length > 0) {
    const skillCounts: Record<string, number> = {};
    
    // Process each vote record
    skillVotesData.forEach(vote => {
      if (!vote.skills) {
        console.log("Found empty vote data:", vote);
        return;
      }
      
      // Handle various data structures that could contain skill data
      try {
        let skills: string[] = [];
        
        if (Array.isArray(vote.skills)) {
          // Array format: Extract strings from array
          skills = vote.skills.map(skill => String(skill));
        } else if (typeof vote.skills === 'string') {
          // Try to parse if it's a JSON string
          try {
            const parsed = JSON.parse(vote.skills);
            if (Array.isArray(parsed)) {
              skills = parsed.map(skill => String(skill));
            } else if (typeof parsed === 'object' && parsed !== null) {
              skills = Object.keys(parsed);
            }
          } catch (e) {
            // If not valid JSON, treat as a single skill
            skills = [vote.skills];
          }
        } else if (typeof vote.skills === 'object' && vote.skills !== null) {
          // Handle object format: use keys as skill names
          skills = Object.keys(vote.skills);
        }
        
        console.log("Extracted skills:", skills);
        
        // Count each skill
        skills.forEach(skill => {
          if (skill && typeof skill === 'string') {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
          }
        });
      } catch (e) {
        console.error("Error processing vote data:", e, vote);
      }
    });
    
    // Convert counts to array of PopularSkill objects
    popularSkills = Object.entries(skillCounts).map(([skill, count]) => ({
      skill,
      count
    }));
    
    console.log("Calculated popular skills:", popularSkills);
  }
  
  return popularSkills.sort((a, b) => b.count - a.count);
}
