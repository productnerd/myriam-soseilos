import React, { useState } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Dialog, DialogTitle, DialogContent, DialogTrigger } from "@/components/ui/overlay/Dialog";
import CourseCarousel from "@/components/course/carousel/CourseCarousel";
import { Course } from "@/types/course";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Code, Database, GraduationCap, Brain, Globe } from "lucide-react";
import { useCourseContext } from "@/contexts/CourseContext";
import { useCourses } from "@/hooks/courses";

const CoursePickerButton: React.FC = () => {
	const { selectedCourseId, showCoursePicker, setShowCoursePicker } = useCourseContext();
	const { data: courses, isLoading, error } = useCourses();
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const refreshCourseStatuses = () => {
		console.info("Refreshing course statuses");
		setRefreshTrigger((prev) => prev + 1);
	};

	/**
	 * Handle dialog closing with course status refresh
	 * This ensures course statuses are updated after selection
	 */
	const handleDialogClose = () => {
		setShowCoursePicker(false);
		refreshCourseStatuses();
	};

	const { data: activeCourse } = useQuery({
		queryKey: ["activeCourse", selectedCourseId, refreshTrigger],
		queryFn: async () => {
			if (!selectedCourseId) return null;
			if (courses) {
				const foundCourse = courses.find((c) => c.id === selectedCourseId);
				if (foundCourse) return foundCourse;
			}
			const { data, error } = await supabase
				.from("courses")
				.select("*")
				.eq("id", selectedCourseId)
				.single();
			if (error) {
				console.error("Error fetching active course:", error);
				return null;
			}
			return data as Course;
		},
		enabled: !!selectedCourseId,
	});

	const CourseIcon = () => {
		if (!activeCourse || !activeCourse.icon) {
			return <BookOpen className="h-5 w-5" />;
		}
		switch (activeCourse.icon) {
			case "book-open":
				return <BookOpen className="h-5 w-5" />;
			case "code-json":
				return <Code className="h-5 w-5" />;
			case "database":
				return <Database className="h-5 w-5" />;
			case "brain":
				return <Brain className="h-5 w-5" />;
			case "globe":
				return <Globe className="h-5 w-5" />;
			default:
				return <GraduationCap className="h-5 w-5" />;
		}
	};

	// Filter out DRAFT courses - only show ACTIVE and COMING_SOON courses
	const visibleCourses = courses?.filter(
		(course) => course.status === "ACTIVE" || course.status === "COMING_SOON"
	);

	if (isLoading) {
		return (
			<Dialog open={showCoursePicker} onOpenChange={setShowCoursePicker}>
				<DialogTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
						<CourseIcon />
						<span className="sr-only">Course picker</span>
					</Button>
				</DialogTrigger>
				<DialogContent
					className="sm:max-w-2xl w-[95vw] p-6 backdrop-blur-md bg-transparent border-transparent"
					onPointerDownOutside={() => setShowCoursePicker(false)}
				>
					<DialogTitle className="sr-only">Select a Course</DialogTitle>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-[300px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
							/>
						))}
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (error) {
		return (
			<Dialog open={showCoursePicker} onOpenChange={setShowCoursePicker}>
				<DialogTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
						<CourseIcon />
						<span className="sr-only">Course picker</span>
					</Button>
				</DialogTrigger>
				<DialogContent
					className="sm:max-w-2xl w-[95vw] p-6 backdrop-blur-md bg-transparent border-transparent"
					onPointerDownOutside={() => setShowCoursePicker(false)}
				>
					<DialogTitle className="sr-only">Select a Course</DialogTitle>
					<div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
						Failed to load courses. Please try again later.
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (!visibleCourses || visibleCourses.length === 0) {
		return (
			<Dialog open={showCoursePicker} onOpenChange={setShowCoursePicker}>
				<DialogTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
						<CourseIcon />
						<span className="sr-only">Course picker</span>
					</Button>
				</DialogTrigger>
				<DialogContent
					className="sm:max-w-2xl w-[95vw] p-6 backdrop-blur-md bg-transparent border-transparent"
					onPointerDownOutside={() => setShowCoursePicker(false)}
				>
					<DialogTitle className="sr-only">Select a Course</DialogTitle>
					<div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md text-gray-500 dark:text-gray-400">
						No courses available.
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={showCoursePicker} onOpenChange={setShowCoursePicker}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
					<CourseIcon />
					<span className="sr-only">Course picker</span>
				</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-6xl w-[95vw] p-6 backdrop-blur-md bg-transparent border-transparent flex items-center justify-center"
				onPointerDownOutside={() => setShowCoursePicker(false)}
			>
				<DialogTitle className="sr-only">Select a Course</DialogTitle>
				<CourseCarousel
					courses={visibleCourses}
					isLoading={false}
					error={null}
					selectedCourseId={selectedCourseId}
					onCardClick={handleDialogClose}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default CoursePickerButton;
