import { format, isValid, parseISO } from "date-fns";

/**
 * Format a date string to a readable format (e.g. "13th March")
 */
export function formatReleaseDate(dateString: string | null): string | null {
	if (!dateString) return null;

	const date = parseISO(dateString);
	if (!isValid(date)) return null;

	return format(date, "do MMMM");
}
