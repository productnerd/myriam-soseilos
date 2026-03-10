import * as React from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		const { carouselRef } = useCarousel();

		return (
			<div ref={carouselRef} className="overflow-hidden">
				<div ref={ref} className={cn("flex", className)} {...props}>
					{children}
				</div>
			</div>
		);
	}
);

CarouselContent.displayName = "CarouselContent";

export { CarouselContent };
