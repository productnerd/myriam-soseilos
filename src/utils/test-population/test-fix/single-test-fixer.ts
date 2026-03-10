
import { supabase } from '@/integrations/supabase/client';
import { createActivitiesForTest } from '../activities';
import { REQUIRED_ACTIVITIES_PER_TEST } from './constants';
import { log } from './loggers';

/**
 * Fixes the activities for a specific test to ensure it has exactly 5
 */
export async function fixTestActivities(testId: string, courseId?: string | null): Promise<boolean> {
  try {
    // Get the current activity count
    const { data: currentActivities, error: countError } = await supabase
      .from('test_activities')
      .select('id')
      .eq('test_id', testId);
      
    if (countError) {
      log.error(`Error counting activities for test ${testId}: ${countError.message}`);
      return false;
    }
    
    const currentCount = currentActivities?.length || 0;
    
    // If we have too many, remove extras
    if (currentCount > REQUIRED_ACTIVITIES_PER_TEST) {
      return await removeExtraActivities(testId, currentCount);
    }
    
    // If we have too few, add more
    if (currentCount < REQUIRED_ACTIVITIES_PER_TEST) {
      return await addMoreActivities(testId, courseId, currentCount);
    }
    
    // Already has the correct number
    return true;
    
  } catch (error) {
    log.error(`Error fixing activities for test ${testId}: ${error}`);
    return false;
  }
}

/**
 * Removes extra activities from a test to reach the required count
 */
async function removeExtraActivities(testId: string, currentCount: number): Promise<boolean> {
  log.info(`Test ${testId} has ${currentCount} activities, removing extras`);
  
  // Get all test_activities for this test, ordered by order_number
  const { data: testActivities, error: fetchError } = await supabase
    .from('test_activities')
    .select('*')
    .eq('test_id', testId)
    .order('order_number', { ascending: true });
    
  if (fetchError || !testActivities) {
    log.error(`Error fetching test activities for test ${testId}: ${fetchError}`);
    return false;
  }
  
  // Keep only the first REQUIRED_ACTIVITIES_PER_TEST activities
  const activitiesToKeep = testActivities.slice(0, REQUIRED_ACTIVITIES_PER_TEST);
  const activitiesToDelete = testActivities.slice(REQUIRED_ACTIVITIES_PER_TEST);
  
  // Delete the extra activities
  if (activitiesToDelete.length > 0) {
    const ids = activitiesToDelete.map(a => a.id);
    const { error: deleteError } = await supabase
      .from('test_activities')
      .delete()
      .in('id', ids);
      
    if (deleteError) {
      log.error(`Error deleting extra activities for test ${testId}: ${deleteError}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Adds more activities to a test to reach the required count
 */
async function addMoreActivities(testId: string, courseId: string | null | undefined, currentCount: number): Promise<boolean> {
  log.info(`Test ${testId} has only ${currentCount} activities, adding more`);
  
  // Get the test type to determine what kind of activities to create
  const { data: testData, error: testError } = await supabase
    .from('tests')
    .select('test_type')
    .eq('id', testId)
    .single();
    
  if (testError || !testData) {
    log.error(`Error fetching test data for test ${testId}: ${testError}`);
    return false;
  }
  
  // Determine course type based on test type or course ID
  let courseType: 'career' | 'finance' = 'career'; // Default
  
  if (courseId) {
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('title')
      .eq('id', courseId)
      .single();
      
    if (!courseError && courseData) {
      courseType = courseData.title.includes('Career') ? 'career' : 'finance';
    }
  }
  
  // Create new activities
  const newActivities = await createActivitiesForTest(courseType);
  
  if (!newActivities || newActivities.length === 0) {
    log.error(`Failed to create new activities for test ${testId}`);
    return false;
  }
  
  // Get the highest order number currently in use
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from('test_activities')
    .select('order_number')
    .eq('test_id', testId)
    .order('order_number', { ascending: false })
    .limit(1);
    
  const startOrderNumber = maxOrderData && maxOrderData.length > 0 ? 
    (maxOrderData[0].order_number + 1) : 1;
  
  // Link each new activity to the test
  const activitiesToAdd = newActivities.slice(0, REQUIRED_ACTIVITIES_PER_TEST - currentCount);
  
  for (let i = 0; i < activitiesToAdd.length; i++) {
    const { error: linkError } = await supabase
      .from('test_activities')
      .insert({
        test_id: testId,
        activity_id: activitiesToAdd[i].id,
        order_number: startOrderNumber + i
      });
      
    if (linkError) {
      log.error(`Error linking activity to test ${testId}: ${linkError}`);
      // Continue anyway, we'll add as many as we can
    }
  }
  
  return true;
}
