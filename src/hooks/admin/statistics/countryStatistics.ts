
import { supabase } from '@/integrations/supabase/client';
import { CountryStatistic } from './types';

export async function fetchCountryStatistics(): Promise<CountryStatistic[]> {
  console.log("Fetching country statistics...");
  
  try {
    // Use raw SQL query instead of the group method since it's not available
    const { data, error } = await supabase
      .from('profiles')
      .select('country')
      .not('country', 'is', null);
    
    if (error) {
      console.error('Error fetching country statistics:', error);
      return [];
    }
    
    // Manually count country occurrences since group is not available
    const countryCounts: Record<string, number> = {};
    data.forEach((profile: any) => {
      const country = profile.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    // Convert to array and sort
    const result = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    console.log("Country statistics data:", result);
    
    return result;
  } catch (err) {
    console.error('Error in fetchCountryStatistics:', err);
    return [];
  }
}
