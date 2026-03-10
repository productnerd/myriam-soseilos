import React from "react";
import { Badge } from "@/components/ui/data/Badge";
import { cn } from "@/lib/utils";

interface ShopItemHeaderProps {
	name: string;
	isNew: boolean;
	isComingSoon?: boolean;
}

const ShopItemHeader: React.FC<ShopItemHeaderProps> = ({ name, isNew, isComingSoon = false }) => {
	return (
		<div className="flex items-center gap-2 relative">
			<h1 className={cn(isComingSoon && "opacity-60")}>{name}</h1>
			{isNew && (
				<Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
					NEW
				</Badge>
			)}
		</div>
	);
};

export default ShopItemHeader;
