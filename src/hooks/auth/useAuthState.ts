import { useState, useRef, useEffect } from "react";

export function useAuthState() {
	const [isLoading, setIsLoading] = useState(false);
	const [showLoadingScreen, setShowLoadingScreen] = useState(false);
	const formSubmitTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (formSubmitTimeoutRef.current) {
				clearTimeout(formSubmitTimeoutRef.current);
			}
		};
	}, []);

	return {
		isLoading,
		setIsLoading,
		showLoadingScreen,
		setShowLoadingScreen,
		formSubmitTimeoutRef,
	};
}
