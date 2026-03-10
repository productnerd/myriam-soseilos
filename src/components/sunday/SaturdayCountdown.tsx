import React from "react";
import { useSundayCheck } from "@/hooks/activity/useSundayCheck";
import { toast } from "sonner";

const SaturdayCountdown: React.FC = () => {
	const { isSaturdayNight, countdown } = useSundayCheck();

	React.useEffect(() => {
		// Show a toast notification if it's Saturday night approaching Sunday
		if (isSaturdayNight && countdown) {
			const toastId = "saturday-night-warning";

			// Show persistent toast that updates with the countdown
			toast.warning(`App closing in ${countdown}. The app is closed on Sundays.`, {
				id: toastId,
				duration: Infinity, // Keep it visible
				position: "bottom-center",
			});

			return () => {
				toast.dismiss(toastId);
			};
		}
	}, [isSaturdayNight, countdown]);

	return null;
};

export default SaturdayCountdown;
