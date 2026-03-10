import { cn } from "@/lib/utils";
import { ItemState, MatchPair } from "@/types/learning";

export const getItemState = (
	item: string,
	side: "left" | "right",
	showFeedback: boolean,
	selectedLeft: string | null,
	selectedRight: string | null,
	matches: Record<string, string>,
	correctPairs: MatchPair[]
): ItemState => {
	if (!showFeedback) {
		if (side === "left") {
			if (selectedLeft === item) return "selected";
			if (matches[item]) return "matched";
			return "default";
		} else {
			if (selectedRight === item) return "selected";
			if (Object.values(matches).includes(item)) return "matched";
			return "default";
		}
	}

	// Show feedback
	if (side === "left") {
		const correctRight = correctPairs.find((pair) => pair.left === item)?.right;
		const userRight = matches[item];
		return userRight === correctRight ? "correct" : "incorrect";
	} else {
		const correctLeft = correctPairs.find((pair) => pair.right === item)?.left;
		const userLeft = Object.keys(matches).find((left) => matches[left] === item);
		return userLeft === correctLeft ? "correct" : "incorrect";
	}
};

export const getItemStyles = (state: ItemState): string => {
	const baseStyles =
		"p-3 border rounded-md transition-all duration-300 cursor-pointer min-h-[60px] flex items-center gap-2 text-left";

	switch (state) {
		case "selected":
			return cn(baseStyles, "border-primary bg-primary/10 text-primary");
		case "matched":
			return cn(
				baseStyles,
				"border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
			);
		case "correct":
			return cn(
				baseStyles,
				"border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
			);
		case "incorrect":
			return cn(
				baseStyles,
				"border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
			);
		default:
			return cn(baseStyles, "border-input hover:bg-accent/50 text-foreground");
	}
};
