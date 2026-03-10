import { formatDistanceToNow, isToday, format } from "date-fns";

export const formatCompletionDate = (dateString: string): string => {
	const date = new Date(dateString);

	if (isToday(date)) {
		return "Today";
	}

	const daysAgo = formatDistanceToNow(date, { addSuffix: true });
	return daysAgo;
};

// TODO: This is imported in `components/quests/self-exploration/results/SelfExplorationResultsScreen.tsx` but is not used
export const formatCompletionDateTime = (dateString: string): string => {
	const date = new Date(dateString);
	return format(date, "MMM d, yyyy 'at' h:mm a");
};
