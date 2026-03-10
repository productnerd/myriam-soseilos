import React from "react";
import { Badge } from "@/components/ui/data/Badge";

interface DifficultyBadgeProps {
	difficulty: string | null;
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
	if (!difficulty || difficulty !== "hard") return null;

	return (
		<Badge className="bg-black text-orange-500 border border-orange-500 py-0 px-2 text-xs font-bold rounded-full mb-2">
			HARD MODE
		</Badge>
	);
};

export default DifficultyBadge;
