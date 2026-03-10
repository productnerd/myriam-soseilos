/**
 * Date utility functions
 */

export function getExpiryUrgencyLevel(expiryDate: string): "critical" | "high" | "medium" | "low" {
	const now = new Date().getTime();
	const expiry = new Date(expiryDate).getTime();
	const hoursUntilExpiry = (expiry - now) / (1000 * 60 * 60);

	if (hoursUntilExpiry < 6) return "critical";
	if (hoursUntilExpiry < 12) return "high";
	if (hoursUntilExpiry < 24) return "medium";
	return "low";
}

export function formatTimeUntilExpiry(expiryDate: string): string {
	const now = new Date().getTime();
	const expiry = new Date(expiryDate).getTime();
	const hoursUntilExpiry = (expiry - now) / (1000 * 60 * 60);

	if (hoursUntilExpiry < 1) {
		const minutesUntilExpiry = Math.floor((expiry - now) / (1000 * 60));
		return `${minutesUntilExpiry}m`;
	}

	if (hoursUntilExpiry < 24) {
		return `${Math.floor(hoursUntilExpiry)}h`;
	}

	const daysUntilExpiry = Math.floor(hoursUntilExpiry / 24);
	return `${daysUntilExpiry}d`;
}

// Format a date string to a readable format
export function formatDate(date: string | Date): string {
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
