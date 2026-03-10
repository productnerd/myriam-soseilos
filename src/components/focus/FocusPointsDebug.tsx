// TODO: This component is not used anywhere

import React, { useEffect, useState } from "react";
import { useFocusPoints } from "@/hooks/focus/useFocusPoints";
import { useUserContext } from "@/contexts/UserContext";
import { Button } from "@/components/ui/interactive/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";

/**
 * Debug component for testing focus points functionality
 *
 * This component provides a debug interface for testing focus points functionality.

 */
export const FocusPointsDebug: React.FC = () => {
	// TODO: If this component is planned to be used and will not be rendered from a protected route, need to have a '!user' check.
	const { user } = useUserContext();

	const {
		focusPoints,
		isLoading,
		handleFocusPointReplenishment,
		deductFocusPoints,
		hasSufficientFocus,
		formatTimeUntilReplenishment,
		config,
	} = useFocusPoints(user!.id); // ProtectedRoute guarantees user is available

	// Force re-render every second for the countdown
	const [, setForceUpdate] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setForceUpdate((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	if (isLoading) {
		return <div>Loading focus points...</div>;
	}

	const handleDeduction = async (isCorrect: boolean) => {
		const newPoints = await deductFocusPoints(isCorrect);
		console.log(`Deducted points (correct: ${isCorrect}), new balance: ${newPoints}`);
	};

	const handleReplenish = async () => {
		const newPoints = await handleFocusPointReplenishment();
		console.log(`Replenished points, new balance: ${newPoints}`);
	};

	return (
		<Card className="max-w-md">
			<CardHeader>
				<CardTitle>Focus Points Debug</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between">
					<span>Current Focus Points:</span>
					<span className="font-medium">{focusPoints}</span>
				</div>

				<div className="flex justify-between">
					<span>Has Sufficient Focus:</span>
					<span className="font-medium">{hasSufficientFocus() ? "Yes" : "No"}</span>
				</div>

				<div className="flex justify-between">
					<span>Next Replenishment:</span>
					<span className="font-medium">{formatTimeUntilReplenishment()}</span>
				</div>

				<div className="flex justify-between">
					<span>Max Focus Points:</span>
					<span className="font-medium">{config.maxFocusPoints}</span>
				</div>

				<div className="flex justify-between">
					<span>Replenish Amount:</span>
					<span className="font-medium">{config.replenishAmount}</span>
				</div>

				<div className="flex justify-between">
					<span>Replenish Interval:</span>
					<span className="font-medium">
						{config.replenishIntervalHours}h (at 2,4,6,8...)
					</span>
				</div>

				<div className="flex flex-col gap-2 pt-4">
					<div className="flex gap-2">
						<Button
							onClick={() => handleDeduction(true)}
							variant="outline"
							size="sm"
							className="flex-1"
						>
							Deduct 1 (Correct)
						</Button>
						<Button
							onClick={() => handleDeduction(false)}
							variant="outline"
							size="sm"
							className="flex-1"
						>
							Deduct 5 (Wrong)
						</Button>
					</div>

					<Button onClick={handleReplenish} variant="default" size="sm">
						Force Replenish Points
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
