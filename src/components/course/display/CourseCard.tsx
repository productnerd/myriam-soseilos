// TODO: There is CourseCard component in `components/learn/course-picker` - consider consolidation?

import React from "react";
import { Card, CardContent } from "@/components/ui/layout/Card";
import { Course } from "@/types/course";
import { Badge } from "@/components/ui/data/Badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CourseStatusBadge from "@/components/course/status/CourseStatusBadge";
import CourseFriends from "@/components/course/social/CourseFriends";
import { BookOpen, Code, Database, GraduationCap, Brain, Globe, Users } from "lucide-react";
import { useActiveUsersPerCourse } from "@/hooks/analytics/useActiveUsersPerCourse";
import { useUserContext } from "@/contexts/UserContext";

interface CourseCardProps {
	course: Course;
	isSelected?: boolean;
	onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isSelected = false, onClick }) => {
	const { data: activeUsersData } = useActiveUsersPerCourse();
	const { user } = useUserContext();
	const { data: courseStatus } = useQuery({
		queryKey: ["courseDirectProgress", course.id, user!.id],
		queryFn: async () => {
			try {
				const { data: progressData, error } = await supabase
					.from("user_progress")
					.select("status, current_level_id")
					.eq("course_id", course.id)
					.eq("user_id", user!.id)
					.maybeSingle();

				if (error) {
					console.error("Error fetching course progress:", error);
					return "NOT_STARTED";
				}

				if (!progressData) return "NOT_STARTED";

				// Return the full status object for INPROGRESS or COMPLETED
				return {
					status: progressData.status,
					current_level_id: progressData.current_level_id,
				};
			} catch (error) {
				console.error("Error in fetching course progress:", error);
				return "NOT_STARTED";
			}
		},
		refetchOnWindowFocus: false,
		staleTime: 60 * 1000, // 1 minute
		enabled: !!user!.id, // Only run when user is authenticated
	});

	// Function to update course color palette
	const getCourseColor = () => {
		// Same color palette: olive green, burgundy, and bright orange
		if (course.color === "#3B82F6") return "#556B2F"; // Olive green instead of blue
		if (course.color === "#EC4899") return "#800020"; // Burgundy instead of pink
		if (course.color === "#10B981") return "#F97316"; // Bright orange instead of green
		return course.color; // Keep any custom colors as they are
	};

	const courseColor = getCourseColor();

	// Function to render the appropriate icon based on the course.icon value
	const CourseIcon = () => {
		// Default to BookOpen if no icon is specified
		if (!course.icon) {
			return <BookOpen className="h-6 w-6 text-primary" />;
		}

		// Map icon names to components
		switch (course.icon) {
			case "book-open":
				return <BookOpen className="h-6 w-6 text-primary" />;
			case "code-json":
				return <Code className="h-6 w-6 text-primary" />;
			case "database":
				return <Database className="h-6 w-6 text-primary" />;
			case "brain":
				return <Brain className="h-6 w-6 text-primary" />;
			case "globe":
				return <Globe className="h-6 w-6 text-primary" />;
			default:
				return <GraduationCap className="h-6 w-6 text-primary" />;
		}
	};

	// Get active users count for this course
	const activeUsersCount =
		activeUsersData && activeUsersData[course.id] ? activeUsersData[course.id] : 0;

	return (
		<Card
			className={`hover:shadow-md transition-all cursor-pointer w-full relative ${
				isSelected ? "ring-2 ring-offset-2" : ""
			}`}
			onClick={onClick}
			style={{
				borderColor: courseColor,
				borderWidth: "2px",
				backgroundColor: isSelected ? `${courseColor}60` : undefined, // Increased opacity to 60 (60%)
				boxShadow: isSelected ? `0 0 20px ${courseColor}30` : undefined,
			}}
		>
			<CardContent className="p-6 flex flex-col items-start">
				<div className="mb-3 flex justify-between w-full">
					<CourseStatusBadge courseStatus={courseStatus} processedColor={courseColor} />
					<CourseIcon />
				</div>

				<div className="text-left">
					<h3 className="font-bold text-2xl mb-2">{course.title}</h3>

					{/* Skill tags */}
					{course.skill_tags && course.skill_tags.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-1 mb-2">
							{course.skill_tags.map((tag, index) => (
								<Badge key={index} variant="outline" className="text-xs uppercase">
									{tag}
								</Badge>
							))}
						</div>
					)}

					{/* Active Users and Friends taking this course */}
					<div className="mt-2 flex justify-between items-center">
						<div>
							{activeUsersCount > 0 && (
								<Badge
									variant="outline"
									className="flex items-center gap-1 text-xs py-1"
								>
									<Users className="h-3 w-3" />
									<span>{activeUsersCount}+ currently learning</span>
								</Badge>
							)}
						</div>

						{/* Friends taking this course */}
						<CourseFriends courseId={course.id} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CourseCard;
