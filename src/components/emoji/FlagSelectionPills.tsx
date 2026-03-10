import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { motion } from "framer-motion";
import FlagGrid from "./FlagGrid";
import { COUNTRY_FLAGS } from "@/types/countryFlags";
import { ScrollArea } from "@/components/ui/layout/ScrollArea";

interface FlagSelectionPillsProps {
	onSubmit: (selectedFlag: string) => void;
}

const FlagSelectionPills: React.FC<FlagSelectionPillsProps> = ({ onSubmit }) => {
	const [selectedFlag, setSelectedFlag] = React.useState<string>("");

	const handleFlagSelect = (flagEmoji: string) => {
		setSelectedFlag(flagEmoji);
	};

	const handleSubmit = () => {
		if (selectedFlag) {
			onSubmit(selectedFlag);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col space-y-6 h-full"
		>
			<div className="text-center space-y-2">
				<h3 className="text-lg font-medium text-white">Where are you from?</h3>
				<p className="text-white/70 text-sm">Select your country or region</p>
			</div>

			<div className="flex-1 min-h-0">
				<ScrollArea className="h-64 w-full">
					<FlagGrid
						flags={COUNTRY_FLAGS}
						selectedFlag={selectedFlag}
						onSelectFlag={handleFlagSelect}
					/>
				</ScrollArea>
			</div>

			<div className="space-y-3">
				<Button
					onClick={handleSubmit}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
					disabled={!selectedFlag}
				>
					Continue
				</Button>
			</div>
		</motion.div>
	);
};

export default FlagSelectionPills;
