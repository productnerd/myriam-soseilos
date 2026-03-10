import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/interactive/Button";
import { useCarousel } from "./Carousel";

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
	({ className, variant = "outline", size = "icon", ...props }, ref) => {
		const { scrollPrev, canScrollPrev } = useCarousel();

		return (
			<Button
				ref={ref}
				variant="ghost"
				size={size}
				className={cn(
					"h-8 w-8 rounded-full absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90",
					className
				)}
				onClick={scrollPrev}
				disabled={!canScrollPrev}
				{...props}
			>
				<ChevronLeft className="h-4 w-4 text-black" />
				<span className="sr-only">Previous slide</span>
			</Button>
		);
	}
);
CarouselPrevious.displayName = "CarouselPrevious";

export { CarouselPrevious };
