import { useState, useEffect } from "react";

interface SundayCheckResult {
	isSunday: boolean;
	isSaturdayNight: boolean;
	countdown: string | null;
	isSundayProtection: boolean;
}

export function useSundayCheck(): SundayCheckResult {
	const [state, setState] = useState<SundayCheckResult>({
		isSunday: false,
		isSaturdayNight: false,
		countdown: null,
		isSundayProtection: false,
	});

	useEffect(() => {
		// Function to check the day and time
		function checkDayAndTime() {
			// Get the current date in the user's local timezone
			const now = new Date();
			console.debug(
				`Current date/time: ${now.toISOString()}, Day: ${now.getDay()}, Hours: ${now.getHours()}`
			);

			const day = now.getDay(); // 0 is Sunday, 6 is Saturday
			const hours = now.getHours();
			const minutes = now.getMinutes();
			const seconds = now.getSeconds();

			// Check if it's Sunday (all day)
			const isSunday = day === 0;

			// Check if it's Saturday after 10pm
			const isSaturdayNight = day === 6 && hours >= 22;

			// Log the detected state for debugging
			console.debug(
				`isSunday: ${isSunday}, isSaturdayNight: ${isSaturdayNight}, day: ${day}, hours: ${hours}`
			);

			// Calculate countdown if it's Saturday night
			let countdown = null;
			if (isSaturdayNight) {
				// Calculate time until midnight
				const hoursLeft = 23 - hours;
				const minutesLeft = 59 - minutes;
				const secondsLeft = 59 - seconds;

				countdown = `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft
					.toString()
					.padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
			}

			// Streak is protected on Sunday
			const isSundayProtection = isSunday;

			setState({ isSunday, isSaturdayNight, countdown, isSundayProtection });
		}

		// Initial check as soon as component mounts
		checkDayAndTime();

		// Set up interval to update the countdown every second
		const intervalId = setInterval(checkDayAndTime, 1000);

		// For debugging purposes, log the current day on mount
		console.debug(`Initial day check: ${new Date().getDay()} (0=Sunday)`);

		return () => clearInterval(intervalId);
	}, []);

	return state;
}
