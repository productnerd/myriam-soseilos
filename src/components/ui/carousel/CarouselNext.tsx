import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/interactive/Button";
import { useCarousel } from "./Carousel";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
	({ className, variant = "outline", size = "icon", ...props }, ref) => {
		const { scrollNext, canScrollNext } = useCarousel();

		return (
			<Button
				ref={ref}
				variant="ghost"
				size={size}
				className={cn(
					"h-8 w-8 rounded-full absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90",
					className
				)}
				onClick={scrollNext}
				disabled={!canScrollNext}
				{...props}
			>
				<ChevronRight className="h-4 w-4 text-black" />
				<span className="sr-only">Next slide</span>
			</Button>
		);
	}
);
CarouselNext.displayName = "CarouselNext";

export { CarouselNext };
