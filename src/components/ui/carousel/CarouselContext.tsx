import * as React from "react";

export interface CarouselContextProps {
	currentIndex: number;
}

export const CarouselContext = React.createContext<CarouselContextProps | null>({
	currentIndex: 0,
});

export function useCarousel() {
	const context = React.useContext(CarouselContext);

	if (!context) {
		throw new Error("useCarousel must be used within a <Carousel />");
	}

	return context;
}
