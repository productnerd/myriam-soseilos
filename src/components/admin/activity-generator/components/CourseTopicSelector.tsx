import React from "react";
import { Label } from "@/components/ui/form/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { useCourses } from "@/hooks/courses/useCourses";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CourseTopicSelectorProps {
	selectedCourse: string;
	selectedLevel: string; // Keep for compatibility but not used
	selectedTopic: string;
	onCourseChange: (courseId: string) => void;
	onLevelChange: (levelId: string) => void; // Keep for compatibility but not used
	onTopicChange: (topicId: string) => void;
}

export const CourseTopicSelector: React.FC<CourseTopicSelectorProps> = ({
	selectedCourse,
	selectedTopic,
	onCourseChange,
	onTopicChange,
}) => {
	const { data: courses } = useCourses();

	// Fetch topics directly by course
	const { data: topics } = useQuery({
		queryKey: ["topics-by-course", selectedCourse],
		queryFn: async () => {
			if (!selectedCourse) return [];

			const { data, error } = await supabase
				.from("topics")
				.select(
					`
          id,
          title,
          order_number,
          levels!inner(course_id)
        `
				)
				.eq("levels.course_id", selectedCourse)
				.order("order_number");

			if (error) throw error;
			return data;
		},
		enabled: !!selectedCourse,
	});

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label>Course</Label>
				<Select value={selectedCourse} onValueChange={onCourseChange}>
					<SelectTrigger>
						<SelectValue placeholder="Select course" />
					</SelectTrigger>
					<SelectContent>
						{courses?.map((course) => (
							<SelectItem key={course.id} value={course.id}>
								{course.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label>Topic</Label>
				<Select
					value={selectedTopic}
					onValueChange={onTopicChange}
					disabled={!selectedCourse}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select topic" />
					</SelectTrigger>
					<SelectContent>
						{topics?.map((topic) => (
							<SelectItem key={topic.id} value={topic.id}>
								{topic.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
