import { getExpiryUrgencyLevel } from "@/utils/date/dateUtils";

// Define the badge variants based on the urgency level
export const getExpiryBadgeVariant = (expiryDate: string) => {
	const urgencyLevel = getExpiryUrgencyLevel(expiryDate);

	switch (urgencyLevel) {
		case "critical": // Less than 6 hours - glowing red
			return {
				variant: "destructive" as const,
				className: "animate-pulse shadow-[0_0_5px_0px_rgba(239,68,68,0.9)]",
			};
		case "high": // Less than 12 hours - orange
			return {
				variant: "destructive" as const,
				className: "bg-orange-500 border-orange-600",
			};
		case "medium": // Less than 24 hours - yellow
			return {
				variant: "outline" as const,
				className: "bg-yellow-400/10 text-yellow-500 border-yellow-500",
			};
		default: // More than 24 hours - normal
			return {
				variant: "secondary" as const,
				className: "",
			};
	}
};
