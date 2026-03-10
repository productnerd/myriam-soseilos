import React from "react";
import { getItemState, getItemStyles } from "@/utils/learning/itemStateUtils";
import { MatchPair } from "@/types/learning";

interface PairMatchingItemProps {
	item: string;
	index: number;
	side: "left" | "right";
	showFeedback: boolean;
	selectedLeft: string | null;
	selectedRight: string | null;
	matches: Record<string, string>;
	correctPairs: MatchPair[];
	onClick: (item: string) => void;
}

const PairMatchingItem: React.FC<PairMatchingItemProps> = ({
	item,
	index,
	side,
	showFeedback,
	selectedLeft,
	selectedRight,
	matches,
	correctPairs,
	onClick,
}) => {
	const state = getItemState(
		item,
		side,
		showFeedback,
		selectedLeft,
		selectedRight,
		matches,
		correctPairs
	);
	const styles = getItemStyles(state);

	return (
		<div className={styles} onClick={() => onClick(item)}>
			<span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border border-current text-sm font-medium">
				{side === "left" ? index + 1 : String.fromCharCode(65 + index)}
			</span>
			<span className="flex-1">{item}</span>
		</div>
	);
};

export default PairMatchingItem;
