import React from "react";
import { Dialog, DialogContent } from "@/components/ui/overlay/Dialog";
import { StoreItem } from "@/types/shop";
import { usePointsCheck } from "@/hooks/points/usePointsCheck";
import ShopItemImageCarousel from "./ShopItemImageCarousel";
import ShopItemHeader from "./ShopItemHeader";
import { Trophy, Award, DollarSign, Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { pointTypes } from "@/lib/ui";
import ShopItemStateBadge from "./ShopItemStateBadge";
import ReleaseDateBadge from "./ReleaseDateBadge";
import { Button } from "@/components/ui/interactive/Button";
import { useStoreItemNotification } from "@/hooks/shop/useStoreItemNotification";
import { useUserContext } from "@/contexts/UserContext";

interface ShopItemDetailDialogProps {
	item: StoreItem;
	isOpen: boolean;
	onClose: () => void;
}

const ShopItemDetailDialog: React.FC<ShopItemDetailDialogProps> = ({ item, isOpen, onClose }) => {
	const { user } = useUserContext();

	const { hasEnoughGreyPoints, hasEnoughDarkPoints } = usePointsCheck(item, user!.id);
	const {
		isSubscribed,
		isLoading: isNotificationLoading,
		isNotifying,
		toggleNotification,
	} = useStoreItemNotification(item.id, user!.id);

	const isDisabled = item.state === "COMING_SOON" || item.state === "SOLD_OUT";
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

	const handleNotifyClick = () => {
		toggleNotification();
	};

	const { grey, dark } = pointTypes;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-lg md:max-w-2xl p-0 overflow-hidden">
				<div className="flex flex-col">
					<div className="relative">
						<ShopItemImageCarousel
							images={item.images}
							itemName={item.name}
							isAvailable={isAvailable}
							state={item.state}
							showControls={false} // Let the component decide based on isDetailView
							isDetailView={true}
						/>

						{!isComingSoon && <ShopItemStateBadge state={item.state} />}
						{isComingSoon && (
							<ReleaseDateBadge releaseDate={item.release_date || null} />
						)}
					</div>

					<div className="px-6 py-4 space-y-4">
						<ShopItemHeader name={item.name} isNew={isNew()} />

						{item.story && (
							<div className="mt-4 font-handwritten text-lg">{item.story}</div>
						)}

						<div className="mt-6">
							<div className="flex flex-col w-full space-y-2 text-xs">
								<div className="flex items-center">
									<div
										className={cn(
											"bg-amber-800/30 text-white rounded-full py-1 px-3 flex items-center mr-1",
											item.grey_to_unlock &&
												(hasEnoughGreyPoints
													? `border ${grey.borderDark}`
													: `border ${grey.borderDark}`)
										)}
									>
										<Trophy className="h-3 w-3 text-amber-400 mr-1" />
										<span className="font-medium">
											{item.grey_to_unlock ?? "-"}
										</span>
										{item.grey_to_unlock !== null &&
											(hasEnoughGreyPoints ? (
												<span className="h-3 w-3 text-green-500 ml-1">
													✓
												</span>
											) : (
												<span className="h-3 w-3 text-red-500 ml-1">✗</span>
											))}
									</div>
									<span className="text-xs text-muted-foreground ml-1">
										to unlock
									</span>
								</div>

								<div className="flex items-center">
									<div
										className={cn(
											"bg-purple-900/30 text-white rounded-full py-1 px-3 flex items-center mr-1",
											item.dark_price &&
												(hasEnoughDarkPoints
													? `border ${dark.borderDark}`
													: `border ${dark.borderDark}`)
										)}
									>
										<Award className="h-3 w-3 text-purple-400 mr-1" />
										<span className="font-medium">
											{item.dark_price ?? "-"}
										</span>
										{item.dark_price !== null &&
											(hasEnoughDarkPoints ? (
												<span className="h-3 w-3 text-green-500 ml-1">
													✓
												</span>
											) : (
												<span className="h-3 w-3 text-red-500 ml-1">✗</span>
											))}
									</div>
									<span className="text-xs text-muted-foreground ml-1">
										to be spent
									</span>
								</div>

								<div className="flex items-center mb-[8px]">
									<div className="bg-gray-700 text-white border border-gray-600 rounded-full py-1 px-3 flex items-center mr-1">
										<DollarSign className="h-3 w-3 text-green-500 mr-1" />
										<span className="font-medium">{item.usd_price ?? "-"}</span>
									</div>
									<span className="text-xs text-muted-foreground ml-1">
										to be spent
									</span>
								</div>
							</div>
						</div>

						{isComingSoon && (
							<div className="mt-8">
								<Button
									variant={isSubscribed ? "outline" : "secondary"}
									className={cn(
										"w-full flex items-center justify-center gap-2",
										isSubscribed
											? "bg-gray-600 hover:bg-gray-700 text-white"
											: "bg-muted hover:bg-muted/90 text-muted-foreground"
									)}
									onClick={handleNotifyClick}
									disabled={isNotificationLoading || isNotifying}
								>
									{isSubscribed ? (
										<>
											<Check className="h-4 w-4" /> Notification set
										</>
									) : (
										<>
											<Bell className="h-4 w-4" /> Notify me when available
										</>
									)}
								</Button>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ShopItemDetailDialog;
