import { useState } from "react";
import {
	useFocusPointsFetching,
	useFocusPointsReplenishment,
	useFocusPointsDeduction,
	useFocusPointsUtilities,
} from "@/hooks/focus";
import { FocusPointsConfig, useFocusPointsConfig } from "@/hooks/focus/useFocusPointsConfig";

// Define the return type explicitly to resolve type errors
export interface FocusPointsReturn {
	focusPoints: number;
	isLoading: boolean;
	handleFocusPointReplenishment: () => Promise<number>;
	handleFocusPointSpent: (isCorrect: boolean) => Promise<number>;
	focusBalance: number; // Alias for backward compatibility
	hasSufficientFocus: () => boolean;
	formatTimeUntilReplenishment: () => string;
	config: FocusPointsConfig;
	deductFocusPoints: (isCorrect: boolean) => Promise<number>;
	secondsUntilNextReplenishment: number;
}

/**
 * Main hook that composes all focus points related hooks
 *
 * @param userId - The ID of the authenticated user (always available via global context)
 * @returns Focus points state and management functions
 */
export function useFocusPoints(userId: string): FocusPointsReturn {
	// Get focus points and loading state from fetching hook
	const { focusPoints: fetchedFocusPoints, isLoading } = useFocusPointsFetching(userId);

	// State to manage focus points locally (for optimistic updates)
	const [focusPoints, setFocusPoints] = useState<number>(fetchedFocusPoints);

	// Update local state when fetched points change
	if (fetchedFocusPoints !== focusPoints && !isLoading) {
		setFocusPoints(fetchedFocusPoints);
	}

	// Get configuration
	const config = useFocusPointsConfig();

	// Get replenishment functionality
	const { handleFocusPointReplenishment } = useFocusPointsReplenishment(
		focusPoints,
		setFocusPoints,
		userId || ""
	);

	// Get deduction functionality
	const { deductFocusPoints } = useFocusPointsDeduction(
		focusPoints,
		setFocusPoints,
		userId || ""
	);

	// Get utility functions
	const { hasSufficientFocus, formatTimeUntilReplenishment, secondsUntilNextReplenishment } =
		useFocusPointsUtilities(focusPoints);

	// Return properly typed object with all required properties
	return {
		focusPoints,
		isLoading,
		handleFocusPointReplenishment,
		handleFocusPointSpent: deductFocusPoints, // Alias for backward compatibility
		focusBalance: focusPoints, // Alias for backward compatibility
		hasSufficientFocus,
		formatTimeUntilReplenishment,
		config,
		deductFocusPoints,
		secondsUntilNextReplenishment,
	};
}
