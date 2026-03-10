import React from "react";
import FlagButton from "./FlagButton";
import { CountryFlag } from "@/types/countryFlags";

interface FlagGridProps {
	flags: CountryFlag[];
	selectedFlag: string;
	onSelectFlag: (emoji: string) => void;
}

const FlagGrid: React.FC<FlagGridProps> = ({ flags, selectedFlag, onSelectFlag }) => {
	return (
		<div className="flex flex-wrap gap-3 mb-6">
			{flags.map((flag) => (
				<FlagButton
					key={flag.name}
					flag={flag}
					isSelected={selectedFlag === flag.emoji}
					onSelect={onSelectFlag}
				/>
			))}
		</div>
	);
};

export default FlagGrid;
