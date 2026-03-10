import React from "react";
import { Course } from "@/types/course";
import { Carousel } from "@/components/ui/carousel/Carousel";
import { CarouselNext } from "@/components/ui/carousel/CarouselNext";
import { CarouselPrevious } from "@/components/ui/carousel/CarouselPrevious";
import CourseCarouselContent from "./CourseCarouselContent";
import CourseCarouselLoading from "./CourseCarouselLoading";
import CourseCarouselError from "./CourseCarouselError";
import CourseCarouselEmpty from "./CourseCarouselEmpty";
import { useCourseCarousel } from "@/hooks/courses/useCourseCarousel";
import { useUserContext } from "@/contexts/UserContext";

interface CourseCarouselProps {
	courses: Course[] | undefined;
	isLoading: boolean;
	error: unknown;
	selectedCourseId: string | null;
	onCardClick?: () => void; // Optional callback for UI actions like closing dialogs
	refreshKey?: number;
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({
	courses,
	isLoading,
	error,
	selectedCourseId,
	onCardClick,
}) => {
	const { user } = useUserContext();

	// Keep userProgress data fetching for level display
	const { userProgress } = useCourseCarousel(selectedCourseId, user?.id || null);

	// Don't render if user details are not available yet or no course is selected
	if (!user || !selectedCourseId) {
		return null;
	}

	if (isLoading) {
		return <CourseCarouselLoading />;
	}

	if (error) {
		return <CourseCarouselError error={error} />;
	}

	if (!courses || courses.length === 0) {
		return <CourseCarouselEmpty />;
	}

	// Filter out DRAFT courses - only show ACTIVE and COMING_SOON courses
	const visibleCourses = courses.filter(
		(course) => course.status === "ACTIVE" || course.status === "COMING_SOON"
	);

	// Keep courses in their original order - don't reorder them
	const orderedCourses = visibleCourses;

	return (
		<div className="w-full max-w-4xl mx-auto px-16 relative">
			<Carousel className="w-full">
				<CourseCarouselContent
					courses={orderedCourses}
					selectedCourseId={selectedCourseId}
					userProgress={userProgress}
					onCardClick={onCardClick}
				/>
				<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
				<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
			</Carousel>
		</div>
	);
};

export default CourseCarousel;
