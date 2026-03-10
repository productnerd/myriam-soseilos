import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/layout/Card";
import { StoreItem } from "@/types/shop";
import { usePointsCheck } from "@/hooks/points/usePointsCheck";
import { cn } from "@/lib/utils";
import ShopItemImageCarousel from "./ShopItemImageCarousel";
import ShopItemHeader from "./ShopItemHeader";
import ShopItemPointsInfo from "./ShopItemPointsInfo";
import ShopItemStateBadge from "./ShopItemStateBadge";
import ReleaseDateBadge from "./ReleaseDateBadge";
import ShopItemDetailDialog from "./ShopItemDetailDialog";
import { Button } from "@/components/ui/interactive/Button";
import { Bell, Check } from "lucide-react";
import { useStoreItemNotification } from "@/hooks/shop/useStoreItemNotification";
import { useUserContext } from "@/contexts/UserContext";

interface ShopItemCardProps {
	item: StoreItem;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ item }) => {
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const { user } = useUserContext();
	const { hasEnoughGreyPoints, hasEnoughDarkPoints } = usePointsCheck(item, user!.id);
	const { isSubscribed, isNotifying, toggleNotification } = useStoreItemNotification(
		item.id,
		user!.id
	);

	const isDisabled = item.state === "SOLD_OUT";
	const isAvailable = item.state === "AVAILABLE";
	const isComingSoon = item.state === "COMING_SOON";

	// Calculate if the item is new (created within the last 7 days)
	const isNew = () => {
		if (!item.created_at) return false;
		const createdDate = new Date(item.created_at);
		const now = new Date();
		const timeDiff = now.getTime() - createdDate.getTime();
		const daysDiff = timeDiff / (1000 * 3600 * 24);
		return daysDiff <= 7;
	};

	const handleCardClick = (e: React.MouseEvent) => {
		// Don't open the detail dialog if the user clicked on a button
		if (
			e.target instanceof Element &&
			(e.target.tagName === "BUTTON" || e.target.closest("button"))
		) {
			return;
		}
		setIsDetailOpen(true);
	};

	const handleNotifyClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		toggleNotification();
	};

	return (
		<>
			<Card
				className={cn(
					"overflow-hidden h-full flex flex-col cursor-pointer",
					// Only apply disabled styles to sold out items
					isDisabled && "opacity-60 saturate-50"
				)}
				onClick={handleCardClick}
			>
				<CardContent className="p-0 flex-grow">
					<div className="relative">
						<ShopItemImageCarousel
							images={item.images}
							itemName={item.name}
							isAvailable={isAvailable}
							state={item.state}
							showControls={!isComingSoon && item.images.length > 1}
						/>

						{!isComingSoon && <ShopItemStateBadge state={item.state} />}
						{isComingSoon && (
							<ReleaseDateBadge releaseDate={item.release_date || null} />
						)}
					</div>

					<div className="p-4 mt-0">
						<ShopItemHeader
							name={item.name}
							isNew={isNew()}
							isComingSoon={isComingSoon}
						/>
						<CardDescription
							className={cn(
								"mt-2 line-clamp-2 text-sm",
								isComingSoon && "opacity-60"
							)}
						>
							{item.description}
						</CardDescription>

						{/* Move points info right below description and always top-aligned */}
						<div className="mt-3">
							<ShopItemPointsInfo
								id={item.id}
								greyToUnlock={item.grey_to_unlock || null}
								darkPrice={item.dark_price || null}
								usdPrice={item.usd_price || null}
								purchaseLimit={item.purchase_limit || null}
								hasEnoughGreyPoints={hasEnoughGreyPoints}
								hasEnoughDarkPoints={hasEnoughDarkPoints}
								isAvailable={isAvailable}
								isComingSoon={isComingSoon}
							/>
						</div>
					</div>
				</CardContent>

				{isComingSoon && (
					<CardFooter className="px-4 pb-4 pt-0 flex flex-col items-start space-y-2">
						<Button
							variant={isSubscribed ? "outline" : "secondary"}
							size="sm"
							className={cn(
								"w-full flex items-center justify-center gap-1 text-xs",
								isSubscribed
									? "bg-gray-600 hover:bg-gray-700 text-white"
									: "bg-muted hover:bg-muted/90 text-muted-foreground"
							)}
							onClick={handleNotifyClick}
							disabled={isNotifying}
						>
							{isSubscribed ? (
								<>
									<Check className="h-3 w-3" /> Notification set
								</>
							) : (
								<>
									<Bell className="h-3 w-3" /> Notify me
								</>
							)}
						</Button>
					</CardFooter>
				)}
			</Card>

			<ShopItemDetailDialog
				item={item}
				isOpen={isDetailOpen}
				onClose={() => setIsDetailOpen(false)}
			/>
		</>
	);
};

export default React.memo(ShopItemCard);
