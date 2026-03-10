
import { PopularCourse } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Process popular courses data from raw format
 */
export function processPopularCoursesData(coursesData: any): PopularCourse[] {
  console.log("Raw popular courses:", coursesData);
  
  try {
    // Handle both array and non-array formats
    let coursesArray = coursesData;
    if (!Array.isArray(coursesArray)) {
      console.warn("Courses data is not an array, attempting to parse");
      try {
        // Try to parse if it's a JSON string
        if (typeof coursesArray === 'string') {
          coursesArray = JSON.parse(coursesArray);
        } else {
          coursesArray = [];
        }
      } catch (e) {
        console.error("Failed to parse courses data:", e);
        coursesArray = [];
      }
    }
    
    const processedCourses = coursesArray.map((course: any) => ({
      course_id: course.course_id || "",
      title: course.title || "Unknown Course",
      user_count: typeof course.user_count === 'number' ? course.user_count : parseInt(course.user_count || '0', 10),
      enrollment_percentage: typeof course.enrollment_percentage === 'number' ? course.enrollment_percentage : parseFloat(course.enrollment_percentage || '0'),
      average_score: typeof course.average_score === 'number' ? course.average_score : parseFloat(course.average_score || '0')
    }));
    
    console.log("Processed popular courses:", processedCourses);
    return processedCourses;
  } catch (e) {
    console.error("Error processing courses data:", e);
    return [];
  }
}

/**
 * Directly fetch popular courses from database
 */
export async function fetchPopularCourses(): Promise<PopularCourse[]> {
  console.log("Directly fetching popular courses data...");
  
  try {
    // Get total user count for percentage calculation
    const { data: totalUsersData } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' });
    
    const totalUsers = totalUsersData?.length || 0;
    
    if (totalUsers === 0) {
      return [];
    }
    
    // First, get course IDs and counts with progress status = 'INPROGRESS'
    const { data: courseData, error: courseError } = await supabase
      .from('user_progress')
      .select(`
        course_id,
        courses:course_id (
          id,
          title
        )
      `)
      .eq('status', 'INPROGRESS');
    
    if (courseError) {
      throw courseError;
    }
    
    // Count occurrences of each course_id
    const courseCounts: Record<string, { id: string, title: string, count: number }> = {};
    
    courseData.forEach(item => {
      if (item.course_id && item.courses) {
        if (!courseCounts[item.course_id]) {
          courseCounts[item.course_id] = {
            id: item.course_id,
            title: item.courses.title || "Unknown Course",
            count: 0
          };
        }
        courseCounts[item.course_id].count++;
      }
    });
    
    // Get course IDs for test scores
    const courseIds = Object.keys(courseCounts);
    
    if (courseIds.length === 0) {
      return [];
    }
    
    // Get average scores for these courses
    const { data: scoreData, error: scoreError } = await supabase
      .from('user_test_scores')
      .select(`
        test_id,
        score,
        tests:test_id (
          course_id
        )
      `)
      .in('tests.course_id', courseIds)
      .not('score', 'is', null);
    
    if (scoreError) {
      console.warn("Could not fetch test scores:", scoreError);
    }
    
    // Calculate average score by course
    const avgScores: Record<string, {sum: number, count: number}> = {};
    
    if (scoreData) {
      scoreData.forEach(item => {
        if (item.tests && item.tests.course_id && item.score !== null) {
          const courseId = item.tests.course_id;
          if (!avgScores[courseId]) {
            avgScores[courseId] = { sum: 0, count: 0 };
          }
          avgScores[courseId].sum += item.score;
          avgScores[courseId].count += 1;
        }
      });
    }
    
    // Build final result
    const popularCourses: PopularCourse[] = Object.values(courseCounts)
      .map(course => {
        const avgScore = avgScores[course.id] 
          ? Math.round((avgScores[course.id].sum / avgScores[course.id].count) * 100) / 100
          : 0;
          
        const enrollmentPercentage = totalUsers > 0 
          ? Math.round((course.count / totalUsers) * 100 * 100) / 100 
          : 0;
          
        return {
          course_id: course.id,
          title: course.title,
          user_count: course.count,
          enrollment_percentage: enrollmentPercentage,
          average_score: avgScore
        };
      })
      .sort((a, b) => b.enrollment_percentage - a.enrollment_percentage)
      .slice(0, 5); // Limit to 5 courses
    
    console.log("Direct popular courses result:", popularCourses);
    return popularCourses;
  } catch (e) {
    console.error("Error directly fetching popular courses:", e);
    return [];
  }
}
