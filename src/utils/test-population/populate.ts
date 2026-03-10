
import { supabase } from '@/integrations/supabase/client';
import { CourseType, PopulationResult } from './types';
import { createActivitiesForTest } from './activities';
import { getOrCreateTest, deleteExistingActivities, linkActivitiesToTest } from './test-management';

// Minimum number of activities required per test
const REQUIRED_ACTIVITIES_PER_TEST = 5;

/**
 * Creates test activities for a specific course
 */
export const populateTestActivities = async (courseId: string, courseType: CourseType): Promise<boolean> => {
  try {
    console.log(`Attempting to populate activities for course ${courseId} (${courseType})`);
    
    // Get or create a test for this course
    const testId = await getOrCreateTest(courseId, courseType);
    if (!testId) {
      return false;
    }
    
    // Delete existing activities if any
    const deleted = await deleteExistingActivities(testId);
    if (!deleted) {
      return false;
    }
    
    // Create activities for this test
    const activities = await createActivitiesForTest(courseType);
    
    if (!activities || activities.length === 0) {
      console.error('Failed to create activities');
      return false;
    }
    
    // Ensure we have exactly 5 activities
    if (activities.length < REQUIRED_ACTIVITIES_PER_TEST) {
      console.log(`Only generated ${activities.length} activities, duplicating to reach the minimum of ${REQUIRED_ACTIVITIES_PER_TEST}`);
      
      // If we have fewer than 5, duplicate some existing ones to reach 5
      while (activities.length < REQUIRED_ACTIVITIES_PER_TEST) {
        // Clone an existing activity (pick from index % original length to cycle through them)
        const originalIndex = activities.length % Math.min(activities.length, 3);
        const activityToClone = {...activities[originalIndex]};
        
        // Add a small variation to the cloned activity's text to make it unique
        activityToClone.main_text = `${activityToClone.main_text} (Variant ${activities.length + 1})`;
        
        // Add variation to options if they exist
        if (activityToClone.options) {
          activityToClone.options = JSON.parse(JSON.stringify(activityToClone.options));
        }
        
        // Create the new activity in the database
        const { data: newActivity, error } = await supabase
          .from('activities')
          .insert({
            ...activityToClone,
            id: undefined // Let the database generate a new ID
          })
          .select()
          .single();
        
        if (error || !newActivity) {
          console.error('Error duplicating activity:', error);
          continue;
        }
        
        activities.push(newActivity);
      }
    } else if (activities.length > REQUIRED_ACTIVITIES_PER_TEST) {
      // If we have more than 5, truncate the array
      console.log(`Generated ${activities.length} activities, truncating to ${REQUIRED_ACTIVITIES_PER_TEST}`);
      activities.splice(REQUIRED_ACTIVITIES_PER_TEST);
    }
    
    console.log(`Final activity count: ${activities.length}`);
    
    // Link activities to the test
    return await linkActivitiesToTest(testId, activities);
    
  } catch (error) {
    console.error('Error populating test activities:', error);
    return false;
  }
};

/**
 * Populates missing test activities for all relevant courses
 */
export const populateAllMissingTestActivities = async (): Promise<PopulationResult[]> => {
  try {
    const results: PopulationResult[] = [];
    
    // First get course IDs for Career Development and Personal Finance 2
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title')
      .or('title.eq.Career Development,title.eq.Personal Finance 2');
      
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    
    if (!courses || courses.length === 0) {
      console.log('No matching courses found');
      return [];
    }
    
    for (const course of courses) {
      const courseType = course.title.includes('Career') ? 'career' : 'finance';
      const success = await populateTestActivities(course.id, courseType);
      console.log(`Populated ${course.title} activities: ${success ? 'success' : 'failed'}`);
      results.push({
        course: course.title,
        success
      });
    }
    
    console.log('Finished populating all missing test activities');
    return results;
  } catch (error) {
    console.error('Error in populateAllMissingTestActivities:', error);
    return [];
  }
};
