import React from "react";
import { Course } from "@/types/course";
import { useActiveUsersPerCourse } from "@/hooks/analytics/useActiveUsersPerCourse";
import { useCourseContext } from "@/contexts/CourseContext";
import CourseCardContent from "../picker/CourseCardContent";
import {
	getCourseColor,
	getCardStyle,
	isComingSoon,
	toRomanNumeral,
} from "@/utils/courses/courseCardUtils";

interface CourseCarouselItemProps {
	course: Course;
	selectedCourseId: string | null;
	userProgress?: Array<{ course_id: string; current_level_id: string | null; status: string }>;
	onCardClick?: () => void; // Optional callback for UI actions like closing dialogs
}

const CourseCarouselItem: React.FC<CourseCarouselItemProps> = ({
	course,
	selectedCourseId,
	userProgress,
	onCardClick,
}) => {
	const { data: activeUsersData } = useActiveUsersPerCourse();

	// Use the course context selection handler to set the selected course from the carousel
	const { handleCourseSelect } = useCourseContext();

	const courseColor = getCourseColor(course.color);
	const cardStyle = getCardStyle();
	const isComingSoonCourse = isComingSoon(course.status || "ACTIVE");
	const activeUsersCount = activeUsersData?.[course.id] || 0;
	const isSelected = course.id === selectedCourseId;

	// Get user progress for this course
	const courseProgress = userProgress?.find((p) => p.course_id === course.id);
	const shouldShowLevel =
		courseProgress?.status === "INPROGRESS" && courseProgress?.current_level_id;
	const levelRomanNumeral = shouldShowLevel ? toRomanNumeral(1) : undefined; // TODO: Simplified for now but should be dynamic

	// Determine tags
	const skillTags = course.skill_tags || [];
	const hasNewTag = course.status === "ACTIVE"; // Add NEW tag for ACTIVE courses
	const regularTags = skillTags;

	//Handle course selection with all necessary logic
	const handleCourseClick = () => {
		// Prevent clicking on 'Coming Soon' courses
		if (isComingSoonCourse) {
			console.debug("CourseCarouselItem: Cannot select 'Coming Soon' course:", course.id);
			return;
		}

		console.debug("CourseCarouselItem: Course clicked:", course.id);
		console.debug("CourseCarouselItem: Current selected course:", selectedCourseId);

		// Call the course context selection handler to set the selected course in local storage and in the course context
		handleCourseSelect(course.id);

		// Execute UI callback (e.g., close dialog)
		if (onCardClick) {
			onCardClick();
		}
	};

	return (
		<div
			className={`
        relative w-[320px] h-[414px] mx-auto transition-all duration-300 p-3
        ${isComingSoonCourse ? "cursor-not-allowed opacity-75" : "cursor-pointer hover:scale-102"}
      `}
			onClick={handleCourseClick}
		>
			{/* Background image if available */}
			{course.image && (
				<>
					<div
						className={`absolute inset-3 ${isSelected ? "ring-4 ring-orange-500" : ""}`}
						style={{
							backgroundImage: `url(${course.image})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							filter: isComingSoonCourse ? "grayscale(100%) brightness(0.5)" : "none",
							...cardStyle,
						}}
					/>
					<div
						className="absolute inset-3 z-10"
						style={{
							...cardStyle,
							background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8))",
							backdropFilter: "blur(2px)",
						}}
					/>
				</>
			)}

			{/* Course Content */}
			<CourseCardContent
				course={course}
				courseColor={courseColor}
				backgroundImage={course.image}
				isComingSoon={isComingSoonCourse}
				shouldShowLevel={Boolean(shouldShowLevel)}
				levelRomanNumeral={levelRomanNumeral}
				activeUsersCount={activeUsersCount}
				skillTags={skillTags}
				hasNewTag={hasNewTag}
				regularTags={regularTags}
			/>
		</div>
	);
};

export default CourseCarouselItem;
