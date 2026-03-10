import { supabase } from "@/integrations/supabase/client";

// Calculate active users per course
export async function calculateActiveUsersPerCourse() {
	const { data: courses, error: coursesError } = await supabase
		.from("courses")
		.select("id, title");

	if (coursesError) {
		console.error("Error fetching courses:", coursesError);
		return [];
	}

	const activeUsers = await Promise.all(
		courses.map(async (course) => {
			const { data: users, error: usersError } = await supabase
				.from("user_progress")
				.select("user_id")
				.eq("course_id", course.id)
				.gte("updated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

			if (usersError) {
				console.error(`Error fetching active users for course ${course.id}:`, usersError);
				return {
					courseId: course.id,
					title: course.title,
					activeUsers: 0,
				};
			}

			return {
				courseId: course.id,
				title: course.title,
				activeUsers: users.length,
			};
		})
	);

	return activeUsers;
}
