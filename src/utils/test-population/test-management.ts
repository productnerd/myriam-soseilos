
import { supabase } from '@/integrations/supabase/client';
import { CourseType } from './types';
import { createActivitiesForTest } from './activities';

/**
 * Creates or gets a test for a specific course
 */
export const getOrCreateTest = async (courseId: string, courseType: CourseType): Promise<string | null> => {
  try {
    // First get the test ID for this course
    const { data: tests, error: testError } = await supabase
      .from('tests')
      .select('id')
      .eq('course_id', courseId)
      .limit(1);

    if (testError) {
      console.error('Error fetching tests:', testError);
      return null;
    }
    
    let testId: string;
    
    // If no test exists, create one
    if (!tests || tests.length === 0) {
      console.log('No test found for course, creating a new one');
      
      // Create a test for this course
      const { data: newTest, error: createTestError } = await supabase
        .from('tests')
        .insert({
          course_id: courseId,
          test_type: 'entry',
          title: courseType === 'career' ? 'Career Development Assessment' : 'Personal Finance Assessment'
        })
        .select();

      if (createTestError || !newTest || newTest.length === 0) {
        console.error('Error creating test:', createTestError);
        return null;
      }
      
      console.log('Created new test:', newTest[0]);
      testId = newTest[0].id;
    } else {
      testId = tests[0].id;
    }
    
    return testId;
  } catch (error) {
    console.error('Error getting or creating test:', error);
    return null;
  }
};

/**
 * Deletes existing activities for a test
 */
export const deleteExistingActivities = async (testId: string): Promise<boolean> => {
  try {
    // Check if test already has activities
    const { data: existingActivities, error: activityError } = await supabase
      .from('test_activities')
      .select('*')
      .eq('test_id', testId);
      
    if (activityError) {
      console.error('Error checking for existing activities:', activityError);
      return false;
    }
    
    if (existingActivities && existingActivities.length > 0) {
      console.log('Test already has activities, deleting them before repopulating');
      
      // Delete existing activities
      const { error: deleteError } = await supabase
        .from('test_activities')
        .delete()
        .eq('test_id', testId);
        
      if (deleteError) {
        console.error('Error deleting existing activities:', deleteError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting existing activities:', error);
    return false;
  }
};

/**
 * Links activities to a test
 */
export const linkActivitiesToTest = async (testId: string, activities: any[]): Promise<boolean> => {
  try {
    console.log(`Created ${activities.length} activities, now linking them to test ${testId}`);
    
    // Link activities to the test
    for (let i = 0; i < activities.length; i++) {
      const { error: linkError } = await supabase
        .from('test_activities')
        .insert({
          test_id: testId,
          activity_id: activities[i].id,
          order_number: i + 1
        });
        
      if (linkError) {
        console.error('Error linking activity to test:', linkError);
        return false;
      }
    }
    
    console.log('Successfully created and linked activities for test');
    return true;
  } catch (error) {
    console.error('Error linking activities to test:', error);
    return false;
  }
};
