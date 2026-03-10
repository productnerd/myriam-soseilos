import React from "react";
import { AspectRatio } from "@/components/ui/layout/AspectRatio";
import { cn } from "@/lib/utils";
import { Carousel } from "@/components/ui/carousel/Carousel";
import { CarouselContent } from "@/components/ui/carousel/CarouselContent";
import { CarouselItem } from "@/components/ui/carousel/CarouselItem";
import { CarouselNext } from "@/components/ui/carousel/CarouselNext";
import { CarouselPrevious } from "@/components/ui/carousel/CarouselPrevious";

interface ShopItemImageCarouselProps {
	images: string[];
	itemName: string;
	isAvailable: boolean;
	state: "AVAILABLE" | "COMING_SOON" | "SOLD_OUT";
	showControls?: boolean;
	isDetailView?: boolean;
}

const ShopItemImageCarousel: React.FC<ShopItemImageCarouselProps> = ({
	images,
	itemName,
	isAvailable,
	state,
	showControls = false,
	isDetailView = false,
}) => {
	const isComingSoon = state === "COMING_SOON";
	const hasMultipleImages = images.length > 1;

	return (
		<div className="w-full overflow-hidden relative">
			<Carousel className="w-full">
				<CarouselContent className="m-0 p-0">
					{images.map((image, index) => (
						<CarouselItem key={index} className="p-0">
							<AspectRatio ratio={16 / 9} className="rounded-t-lg overflow-hidden">
								<img
									src={image}
									alt={`${itemName} - image ${index + 1}`}
									className={cn(
										"object-cover w-full h-full",
										isAvailable &&
											"transition-all duration-500 ease-&lsqb;cubic-bezier(0.87,0,0.13,1)&rsqb; hover:scale-105",
										// Only apply blur effect if it's coming soon AND not in detail view
										isComingSoon &&
											!isDetailView &&
											"filter blur-md scale-110 transition-all duration-1000 ease-&lsqb;cubic-bezier(0.87,0,0.13,1)&rsqb; hover:blur-0 hover:scale-100"
									)}
									loading="lazy"
									width="400"
									height="225"
								/>
							</AspectRatio>
						</CarouselItem>
					))}
				</CarouselContent>

				{/* Show controls if there are multiple images and either showControls is true or it's in detail view */}
				{hasMultipleImages && (showControls || isDetailView) && (
					<>
						<CarouselPrevious className="shadow-none bg-black/30 hover:bg-black/50 border-none" />
						<CarouselNext className="shadow-none bg-black/30 hover:bg-black/50 border-none" />
					</>
				)}
			</Carousel>
		</div>
	);
};

export default ShopItemImageCarousel;
