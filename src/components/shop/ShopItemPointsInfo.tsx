import React from "react";
import { DollarSign, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { pointTypes } from "@/lib/ui";
import { Button } from "@/components/ui/interactive/Button";
import { ShopCheckoutModal } from "./ShopCheckoutModal";
import { toast } from "sonner";
import { useShopCheckout } from "@/hooks/shop/useShopCheckout";
import { usePurchaseLimit } from "@/hooks/shop/usePurchaseLimit";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";
import { useProfileData } from "@/hooks/profile/useProfileData";
import { useUserContext } from "@/contexts/UserContext";

interface ShopItemPointsInfoProps {
	id: string;
	greyToUnlock: number | null;
	darkPrice: number | null;
	usdPrice: number | null;
	purchaseLimit: number | null;
	hasEnoughGreyPoints?: boolean;
	hasEnoughDarkPoints?: boolean;
	isAvailable?: boolean;
	isComingSoon?: boolean;
}

const ShopItemPointsInfo: React.FC<ShopItemPointsInfoProps> = ({
	id,
	greyToUnlock,
	darkPrice,
	usdPrice,
	purchaseLimit,
	hasEnoughGreyPoints,
	hasEnoughDarkPoints,
	isAvailable = false,
	isComingSoon = false,
}) => {
	const { user } = useUserContext();
	const { profile } = useProfileData(user!.id);
	const { grey, dark } = pointTypes;
	const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
	const { initiateCheckout, isProcessing } = useShopCheckout();
	const {
		hasExceededLimit,
		remainingPurchases,
		isLoading: isPurchaseLimitLoading,
	} = usePurchaseLimit(id, purchaseLimit, user!.id);

	// If darkPrice or greyToUnlock is null, treat as having enough points
	const effectiveHasEnoughGreyPoints = greyToUnlock === null ? true : hasEnoughGreyPoints;
	const effectiveHasEnoughDarkPoints = darkPrice === null ? true : hasEnoughDarkPoints;
	const canClaim =
		isAvailable &&
		effectiveHasEnoughGreyPoints &&
		effectiveHasEnoughDarkPoints &&
		!hasExceededLimit;

	// Calculate remaining grey points needed
	const userGreyPoints = profile?.grey_points || 0;
	const greyPointsNeeded =
		greyToUnlock && !effectiveHasEnoughGreyPoints
			? greyToUnlock - userGreyPoints
			: greyToUnlock;

	const handleClaimClick = async (e: React.MouseEvent) => {
		// Prevent event bubbling
		e.stopPropagation();
		if (!canClaim) {
			if (hasExceededLimit) {
				toast.error("You have reached the purchase limit for this item");
			} else {
				toast.error("You don't have enough points to claim this item");
			}
			return;
		}
		try {
			const result = await initiateCheckout(id);
			if (result?.success) {
				toast.success("Checkout initiated successfully!");
			}
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error("Failed to start checkout process");
		}
	};

	// Check if we should show any badges
	const showGreyBadge = greyToUnlock !== null && greyToUnlock > 0;
	const showDarkBadge = darkPrice !== null && darkPrice > 0;
	const showUsdBadge = usdPrice !== null && usdPrice > 0;

	// Get button text and tooltip based on state
	const getButtonState = () => {
		if (hasExceededLimit) {
			const tooltipText =
				purchaseLimit === 1
					? "You have already purchased this item"
					: `Purchase limit reached (${purchaseLimit} max)`;
			return { text: "Unavailable", disabled: true, tooltipText };
		}

		if (!effectiveHasEnoughGreyPoints || !effectiveHasEnoughDarkPoints) {
			return { text: "Claim", disabled: true, tooltipText: "Not enough points" };
		}

		return { text: "Claim", disabled: false, tooltipText: null };
	};

	const buttonState = getButtonState();

	return (
		<TooltipProvider delayDuration={300}>
			<div className="flex flex-col w-full space-y-2 text-xs">
				{showGreyBadge && (
					<div className="flex items-center">
						<Tooltip>
							<TooltipTrigger asChild>
								<div
									className={cn(
										"bg-amber-800/30 text-white rounded-full py-1 px-3 flex items-center mr-1 cursor-help",
										greyToUnlock &&
											(effectiveHasEnoughGreyPoints
												? `border ${grey.borderDark}`
												: `border ${grey.borderDark}`),
										isComingSoon && "opacity-60"
									)}
								>
									<grey.icon className="h-3 w-3 text-amber-400 mr-1" />
									<span className="font-medium">{greyPointsNeeded ?? "-"}</span>
									{greyToUnlock !== null &&
										(effectiveHasEnoughGreyPoints ? (
											<Check className="h-3 w-3 text-green-500 ml-1" />
										) : (
											<X className="h-3 w-3 text-red-500 ml-1" />
										))}
								</div>
							</TooltipTrigger>
							<TooltipContent side="top" className="text-xs max-w-[200px]">
								Grey points needed to unlock this item. Keep learning to earn more!
							</TooltipContent>
						</Tooltip>
						<span
							className={cn(
								"text-xs text-muted-foreground ml-1",
								isComingSoon && "opacity-60"
							)}
						>
							{effectiveHasEnoughGreyPoints ? "" : "more to unlock"}
						</span>
					</div>
				)}

				<div className={cn("flex items-center", isComingSoon && "opacity-60")}>
					{showDarkBadge && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div
									className={cn(
										"bg-purple-900/30 text-white rounded-full py-1 px-3 flex items-center mr-1 cursor-help",
										darkPrice &&
											(effectiveHasEnoughDarkPoints
												? `border ${dark.borderDark}`
												: `border ${dark.borderDark}`)
									)}
								>
									<dark.icon className="h-3 w-3 text-purple-400 mr-1" />
									<span className="font-medium">{darkPrice}</span>
									{effectiveHasEnoughDarkPoints ? (
										<Check className="h-3 w-3 text-green-500 ml-1" />
									) : (
										<X className="h-3 w-3 text-red-500 ml-1" />
									)}
								</div>
							</TooltipTrigger>
							<TooltipContent side="top" className="text-xs max-w-[200px]">
								Dark points that will be spent to purchase this item. Complete
								special quests to earn more!
							</TooltipContent>
						</Tooltip>
					)}

					{showUsdBadge && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="bg-gray-700 text-white border border-gray-600 rounded-full py-1 px-3 flex items-center mx-1 cursor-help">
									<DollarSign className="h-3 w-3 text-green-500 mr-1" />
									<span className="font-medium">{usdPrice}</span>
								</div>
							</TooltipTrigger>
							<TooltipContent side="top" className="text-xs max-w-[200px]">
								USD price that will be charged for this item.
							</TooltipContent>
						</Tooltip>
					)}

					{(showDarkBadge || showUsdBadge) && (
						<span
							className={cn(
								"text-xs text-muted-foreground ml-1",
								isComingSoon && "opacity-60"
							)}
						>
							to be spent
						</span>
					)}
				</div>

				{/* Show purchase limit info if applicable */}
				{purchaseLimit !== null && !isComingSoon && (
					<div className="text-xs text-muted-foreground">
						{hasExceededLimit ? (
							<span className="text-red-400">Purchase limit reached</span>
						) : (
							<span>
								{remainingPurchases} of {purchaseLimit} purchases remaining
							</span>
						)}
					</div>
				)}

				{isAvailable && (
					<div className="mt-4">
						{buttonState.tooltipText ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="w-full">
										<Button
											disabled={
												buttonState.disabled ||
												isProcessing ||
												isPurchaseLimitLoading
											}
											onClick={handleClaimClick}
											variant={buttonState.disabled ? "secondary" : "default"}
											className="w-full h-8 font-medium text-xs py-0"
										>
											{isProcessing ? "Processing..." : buttonState.text}
										</Button>
									</div>
								</TooltipTrigger>
								<TooltipContent side="top" className="text-xs max-w-[200px]">
									{buttonState.tooltipText}
								</TooltipContent>
							</Tooltip>
						) : (
							<Button
								disabled={
									buttonState.disabled || isProcessing || isPurchaseLimitLoading
								}
								onClick={handleClaimClick}
								variant={buttonState.disabled ? "secondary" : "default"}
								className="w-full h-8 font-medium text-xs py-0"
							>
								{isProcessing ? "Processing..." : buttonState.text}
							</Button>
						)}
					</div>
				)}

				{isComingSoon && <div className="mt-6"></div>}

				{showCheckoutModal && darkPrice !== null && usdPrice !== null && (
					<ShopCheckoutModal
						open={showCheckoutModal}
						onOpenChange={setShowCheckoutModal}
						darkPrice={darkPrice}
						usdPrice={usdPrice}
					/>
				)}
			</div>
		</TooltipProvider>
	);
};

export default ShopItemPointsInfo;
