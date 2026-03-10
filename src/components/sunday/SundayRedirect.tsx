import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSundayCheck } from "@/hooks/activity/useSundayCheck";

const SundayRedirect: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isSunday, isSaturdayNight } = useSundayCheck();

	// Force redirect to Sunday page if it's Sunday, no matter which page user tries to access
	useEffect(() => {
		if (isSunday && location.pathname !== "/sunday") {
			console.debug(`It's Sunday! Redirecting from ${location.pathname} to /sunday`);
			navigate("/sunday", { replace: true });
		}
	}, [isSunday, location.pathname, navigate]);

	// For debugging purposes
	useEffect(() => {
		console.debug(
			`SundayRedirect component mounted. isSunday: ${isSunday}, current path: ${location.pathname}`
		);

		// Check if Date object returns expected values in this environment
		const now = new Date();
		console.debug(
			`Environment date check: Day: ${now.getDay()}, Date string: ${now.toString()}`
		);

		return () => {
			console.debug("SundayRedirect component unmounted");
		};
	}, [isSunday, location.pathname]);

	return null;
};

export default SundayRedirect;
