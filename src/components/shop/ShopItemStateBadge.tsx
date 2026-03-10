import React from "react";
import { Badge } from "@/components/ui/data/Badge";

interface ShopItemStateBadgeProps {
	state: string;
}

const ShopItemStateBadge: React.FC<ShopItemStateBadgeProps> = ({ state }) => {
	if (state === "AVAILABLE" || state === "COMING_SOON") return null;

	if (state === "SOLD_OUT") {
		return (
			<Badge
				variant="outline"
				className="absolute top-2 right-2 z-10 bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
			>
				SOLD OUT
			</Badge>
		);
	}

	return null;
};

export default ShopItemStateBadge;
