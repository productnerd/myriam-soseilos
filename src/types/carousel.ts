export type CarouselApi = {
	selectedIndex: number;
	scrollNext: () => void;
	scrollPrev: () => void;
	canScrollNext: () => boolean;
	canScrollPrev: () => boolean;
};

export interface CarouselOptions {
	align?: "start" | "center" | "end";
	loop?: boolean;
	skipSnaps?: boolean;
	dragFree?: boolean;
	containScroll?: boolean | "trimSnaps" | "keepSnaps";
	draggable?: boolean;
}

export type CarouselProps = {
	orientation?: "horizontal" | "vertical";
	opts?: CarouselOptions;
};
