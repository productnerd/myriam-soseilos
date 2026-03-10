import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { cn } from "@/lib/utils";
import { CountryFlag } from "@/types/countryFlags";

interface FlagButtonProps {
	flag: CountryFlag;
	isSelected: boolean;
	onSelect: (emoji: string) => void;
}

const FlagButton: React.FC<FlagButtonProps> = ({ flag, isSelected, onSelect }) => {
	return (
		<Button
			variant={isSelected ? "default" : "outline"}
			size="sm"
			className={cn(
				"rounded-full transition-all p-2",
				isSelected
					? "bg-orange-500 text-white border-orange-400 hover:bg-orange-600"
					: "bg-white/10 text-white border-white/20 hover:bg-white/20"
			)}
			onClick={() => onSelect(flag.emoji)}
			title={flag.name} // Show name as tooltip
		>
			<span className="text-lg">{flag.emoji}</span>
		</Button>
	);
};

export default FlagButton;
