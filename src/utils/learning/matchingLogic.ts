import { MatchPair } from "@/types/learning";

export const createMatch = (
	matches: Record<string, string>,
	leftItem: string,
	rightItem: string
): Record<string, string> => {
	const newMatches = { ...matches };

	// Remove any existing match for this left item
	delete newMatches[leftItem];

	// Remove any existing match for the selected right item
	Object.keys(newMatches).forEach((key) => {
		if (newMatches[key] === rightItem) {
			delete newMatches[key];
		}
	});

	// Add new match
	newMatches[leftItem] = rightItem;
	return newMatches;
};

export const generateAnswerString = (
	matches: Record<string, string>,
	leftItems: string[]
): string => {
	return Object.entries(matches)
		.sort(([a], [b]) => leftItems.indexOf(a) - leftItems.indexOf(b))
		.map(([left, right]) => `${left}-${right}`)
		.join(",");
};

export const isAllPairsMatched = (
	matches: Record<string, string>,
	correctPairs: MatchPair[]
): boolean => {
	return Object.keys(matches).length === correctPairs.length;
};
