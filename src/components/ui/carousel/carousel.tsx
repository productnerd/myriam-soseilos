import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { CarouselApi } from "../../../types/carousel";

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useEmblaCarousel>[0];
	api: UseEmblaCarouselType[1];
	scrollPrev: () => void;
	scrollNext: () => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
} | null;

const CarouselContext = React.createContext<CarouselContextProps>(null);

// TODO: Add a 'useCarousel' hook
function useCarousel() {
	const context = React.useContext(CarouselContext);
	if (!context) {
		throw new Error("useCarousel must be used within a <Carousel />");
	}
	return context;
}

const Carousel = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		opts?: any;
		orientation?: "horizontal" | "vertical";
		setApi?: (api: CarouselApi) => void;
	}
>(({ className, children, opts, orientation = "horizontal", setApi, ...props }, ref) => {
	const [carouselRef, emblaApi] = useEmblaCarousel({
		...opts,
		axis: orientation === "horizontal" ? "x" : "y",
		loop: true, // Enable infinite scrolling
	});
	const [canScrollPrev, setCanScrollPrev] = React.useState(false);
	const [canScrollNext, setCanScrollNext] = React.useState(false);

	const onSelect = React.useCallback((api: UseEmblaCarouselType[1]) => {
		if (!api) return;

		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
	}, []);

	const scrollPrev = React.useCallback(() => {
		emblaApi?.scrollPrev();
	}, [emblaApi]);

	const scrollNext = React.useCallback(() => {
		emblaApi?.scrollNext();
	}, [emblaApi]);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				scrollPrev();
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				scrollNext();
			}
		},
		[scrollPrev, scrollNext]
	);

	React.useEffect(() => {
		if (!emblaApi || !setApi) return;

		setApi({
			selectedIndex: emblaApi.selectedScrollSnap(),
			scrollNext,
			scrollPrev,
			canScrollNext: () => canScrollNext,
			canScrollPrev: () => canScrollPrev,
		});
	}, [emblaApi, canScrollNext, canScrollPrev, scrollNext, scrollPrev, setApi]);

	React.useEffect(() => {
		if (!emblaApi) return;

		onSelect(emblaApi);
		emblaApi.on("reInit", () => onSelect(emblaApi));
		emblaApi.on("select", () => onSelect(emblaApi));

		return () => {
			emblaApi.off("select", () => onSelect(emblaApi));
			emblaApi.off("reInit", () => onSelect(emblaApi));
		};
	}, [emblaApi, onSelect]);

	return (
		<CarouselContext.Provider
			value={{
				carouselRef,
				api: emblaApi,
				scrollPrev,
				scrollNext,
				canScrollPrev,
				canScrollNext,
			}}
		>
			<div
				ref={ref}
				className={cn("relative overflow-hidden", className)}
				role="region"
				aria-roledescription="carousel"
				onKeyDownCapture={handleKeyDown}
				{...props}
			>
				{children}
			</div>
		</CarouselContext.Provider>
	);
});

Carousel.displayName = "Carousel";

export { Carousel, useCarousel };
