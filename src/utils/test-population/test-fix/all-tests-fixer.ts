
import { supabase } from '@/integrations/supabase/client';
import { fixTestActivities } from './single-test-fixer';
import { TestFixResult, TestDetail } from './types';
import { log } from './loggers';

/**
 * Fix activities for all tests to ensure they each have exactly 5 activities
 */
export async function fixAllTestsActivities(): Promise<TestFixResult> {
  try {
    // Get all tests
    const { data: tests, error } = await supabase
      .from('tests')
      .select('id, title, course_id');
      
    if (error) {
      log.error(`Error getting tests: ${error.message}`);
      return {
        success: false,
        fixed: 0,
        alreadyCorrect: 0,
        failed: 0,
        testDetails: []
      };
    }
    
    // Initialize counters and results
    let fixedCount = 0;
    let alreadyCorrectCount = 0;
    let failedCount = 0;
    const testDetails: TestDetail[] = [];
    
    // Process each test
    for (const test of tests) {
      log.info(`Processing test ${test.id} (${test.title || 'Unnamed Test'})`);
      
      // Get current activity count
      const { data: activities, error: countError } = await supabase
        .from('test_activities')
        .select('id')
        .eq('test_id', test.id);
        
      if (countError) {
        log.error(`Error counting activities for test ${test.id}: ${countError.message}`);
        failedCount++;
        testDetails.push({
          id: test.id,
          title: test.title || 'Unknown',
          activityCount: 0,
          fixed: false
        });
        continue;
      }
      
      const currentCount = activities?.length || 0;
      
      // If already has 5 activities, continue
      if (currentCount === 5) {
        log.info(`Test ${test.id} already has 5 activities, skipping`);
        alreadyCorrectCount++;
        testDetails.push({
          id: test.id,
          title: test.title || 'Unknown',
          activityCount: currentCount,
          fixed: true
        });
        continue;
      }
      
      // Attempt to fix the test
      const fixed = await fixTestActivities(test.id, test.course_id);
      
      if (fixed) {
        log.info(`Successfully fixed test ${test.id}`);
        fixedCount++;
        testDetails.push({
          id: test.id,
          title: test.title || 'Unknown',
          activityCount: 5, // It should now have 5
          fixed: true
        });
      } else {
        log.error(`Failed to fix test ${test.id}`);
        failedCount++;
        testDetails.push({
          id: test.id,
          title: test.title || 'Unknown',
          activityCount: currentCount,
          fixed: false
        });
      }
    }
    
    const result: TestFixResult = {
      success: failedCount === 0,
      fixed: fixedCount,
      alreadyCorrect: alreadyCorrectCount,
      failed: failedCount,
      testDetails
    };
    
    log.info(`Fix summary: ${fixedCount} fixed, ${alreadyCorrectCount} already correct, ${failedCount} failed`);
    return result;
    
  } catch (error) {
    log.error(`Unexpected error fixing tests: ${error}`);
    return {
      success: false,
      fixed: 0,
      alreadyCorrect: 0,
      failed: 0,
      testDetails: []
    };
  }
}

/**
 * Process a specific course's tests to fix activity counts
 */
export async function fixCourseTestsActivities(courseId: string): Promise<TestFixResult> {
  try {
    // Get all tests for this course
    const { data: tests, error } = await supabase
      .from('tests')
      .select('id, title')
      .eq('course_id', courseId);
      
    if (error) {
      log.error(`Error getting tests for course ${courseId}: ${error.message}`);
      return {
        success: false,
        fixed: 0,
        alreadyCorrect: 0,
        failed: 0,
        testDetails: []
      };
    }
    
    // Initialize counters and results
    let fixedCount = 0;
    let alreadyCorrectCount = 0;
    let failedCount = 0;
    const testDetails: TestDetail[] = [];
    
    // Process each test
    for (const test of tests) {
      log.info(`Processing test ${test.id} (${test.title || 'Unnamed Test'})`);
      
      // Get current activity count
      const { data: activities, error: countError } = await supabase
        .from('test_activities')
        .select('id')
        .eq('test_id', test.id);
        
      if (countError) {
        log.error(`Error counting activities for test ${test.id}: ${countError.message}`);
        failedCount++;
        testDetails.push({
          id: test.id,
          title: test.title || 'Unknown',
          activityCount: 0,
          fixed: false
        });
        continue;
      }
      
      const currentCount = activities?.length || 0;
      
      // If already has 5 activities, continue
      if (currentCount === 5) {
        log.info(`Test ${test.id} already has 5 activities, skipping`);
        alreadyCorrectCount++;
        testDetails.push({
          id: test.id,
          title: test.title || 'Unknown',
          activityCount: currentCount,
          fixed: true
        });
        continue;
      }
      
      // Attempt to fix the test
      const fixed = await fixTestActivities(test.id, courseId);
      
      if (fixed) {
        log.info(`Successfully fixed test ${test.id}`);
        fixedCount++;
        testDetails.push({
          id: test.id,
          title: test.title || 'Unknown',
          activityCount: 5, // It should now have 5
          fixed: true
        });
      } else {
        log.error(`Failed to fix test ${test.id}`);
        failedCount++;
        testDetails.push({
          id: test.id,
          title: test.title || 'Unknown',
          activityCount: currentCount,
          fixed: false
        });
      }
    }
    
    const result: TestFixResult = {
      success: failedCount === 0,
      fixed: fixedCount,
      alreadyCorrect: alreadyCorrectCount,
      failed: failedCount,
      testDetails
    };
    
    log.info(`Fix summary for course ${courseId}: ${fixedCount} fixed, ${alreadyCorrectCount} already correct, ${failedCount} failed`);
    return result;
    
  } catch (error) {
    log.error(`Unexpected error fixing tests for course ${courseId}: ${error}`);
    return {
      success: false,
      fixed: 0,
      alreadyCorrect: 0,
      failed: 0,
      testDetails: []
    };
  }
}
