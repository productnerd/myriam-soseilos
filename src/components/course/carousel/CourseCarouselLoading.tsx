import React from "react";
import { Carousel } from "@/components/ui/carousel/Carousel";
import { CarouselContent } from "@/components/ui/carousel/CarouselContent";
import { CarouselItem } from "@/components/ui/carousel/CarouselItem";
import { CarouselNext } from "@/components/ui/carousel/CarouselNext";
import { CarouselPrevious } from "@/components/ui/carousel/CarouselPrevious";

const CourseCarouselLoading: React.FC = () => {
	return (
		<div className="w-full max-w-4xl mx-auto px-16 relative">
			<Carousel className="w-full">
				<CarouselContent className="-ml-2 md:-ml-4">
					{[1, 2, 3].map((i) => (
						<CarouselItem key={i} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
							<div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse w-[280px] mx-auto" />
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
				<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
			</Carousel>
		</div>
	);
};

export default CourseCarouselLoading;
