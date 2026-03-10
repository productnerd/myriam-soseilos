import { Course } from "@/types/course";
import { useEffect } from "react";
import CourseCarouselItem from "./CourseCarouselItem";
import { CarouselContent } from "@/components/ui/carousel/CarouselContent";
import { CarouselItem } from "@/components/ui/carousel/CarouselItem";
import { useCarousel } from "@/components/ui/carousel/Carousel";

const CourseCarouselContent: React.FC<{
	courses: Course[];
	selectedCourseId: string | null;
	userProgress: any;
	onCardClick?: () => void;
}> = ({ courses, selectedCourseId, userProgress, onCardClick }) => {
	const { api } = useCarousel();

	// Scroll to the active course when it changes
	useEffect(() => {
		if (api && selectedCourseId) {
			const activeIndex = courses.findIndex((course) => course.id === selectedCourseId);
			if (activeIndex !== -1) {
				api.scrollTo(activeIndex);
			}
		}
	}, [api, selectedCourseId, courses]);

	return (
		<CarouselContent className="-ml-2 md:-ml-4">
			{courses.map((course) => (
				<CarouselItem key={course.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
					<CourseCarouselItem
						course={course}
						selectedCourseId={selectedCourseId}
						userProgress={userProgress}
						onCardClick={onCardClick}
					/>
				</CarouselItem>
			))}
		</CarouselContent>
	);
};

export default CourseCarouselContent;
