import * as React from "react";
import { cn } from "@/lib/utils";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		return (
			<div ref={ref} className={cn("min-w-full shrink-0 grow-0", className)} {...props}>
				{children}
			</div>
		);
	}
);

CarouselItem.displayName = "CarouselItem";

export { CarouselItem };
