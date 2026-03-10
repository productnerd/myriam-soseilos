// TODO: This component is not used anywhere

import React from "react";
import MobileCourseSelector from "../actions/MobileCourseSelector";
import CourseCard from "./CourseCard";
import { useCourses } from "@/hooks/courses";
import CourseRoadmap from "@/components/course/display/CourseRoadmap";

interface CourseListProps {
	selectedCourseId: string | null;
	onCourseSelect: (courseId: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ selectedCourseId, onCourseSelect }) => {
	// Move courses fetching logic inside this component
	const { data: courses, isLoading, error } = useCourses();

	// Find the selected course to get its color
	const selectedCourse = courses?.find((course) => course.id === selectedCourseId);
	const courseColor = selectedCourse?.color || "";

	return (
		<div className="glass rounded-2xl p-3 mb-6">
			{/* Mobile Course Selector */}
			<MobileCourseSelector
				courses={courses}
				isLoading={isLoading}
				selectedCourseId={selectedCourseId}
				onCourseSelect={onCourseSelect}
			/>

			{/* Desktop Course Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				{isLoading ? (
					// Loading skeleton
					Array(4)
						.fill(0)
						.map((_, i) => (
							<div
								key={i}
								className="border rounded-lg p-4 h-40 animate-pulse bg-muted/40"
							></div>
						))
				) : error || !courses ? (
					<div className="text-red-500">Error loading courses</div>
				) : (
					// Actual course cards
					courses.map((course) => (
						<CourseCard
							key={course.id}
							course={course}
							isSelected={course.id === selectedCourseId}
							onClick={() => onCourseSelect(course.id)}
						/>
					))
				)}
			</div>

			{/* Course Roadmap Section (Initial Test or Level Map) */}
			{selectedCourseId && (
				<CourseRoadmap selectedCourseId={selectedCourseId} courseColor={courseColor} />
			)}
		</div>
	);
};

export default CourseList;
