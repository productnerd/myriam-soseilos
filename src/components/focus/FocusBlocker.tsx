// TODO: This component is not used anywhere

import React from "react";
import { useUserContext } from "@/contexts/UserContext";
import { useFlowPoints } from "@/hooks/points/useFlowPoints";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { Focus } from "lucide-react";
interface FocusBlockerProps {
	children: React.ReactNode;
}

const FocusBlocker: React.FC<FocusBlockerProps> = ({ children }) => {
	// TODO: If this component is planned to be used and will not be rendered from a protected route, need to have a '!user' check.
	const { user } = useUserContext();

	const { flowBalance, config, getTimeUntilReplenishment } = useFlowPoints(user?.id || null);

	const timeUntilReplenishment = getTimeUntilReplenishment();

	const formatTimeUntilReplenishment = (milliseconds: number): string => {
		const totalMinutes = Math.floor(milliseconds / (1000 * 60));
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	};

	// Don't render if user details are not available yet
	if (!user) {
		return null;
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
						<Focus className="h-8 w-8 text-purple-600" />
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">
						Out of Focus Points
					</CardTitle>
					<CardDescription className="text-gray-600">
						You need focus points to continue learning activities
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-lg bg-gray-50 p-4">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium text-gray-700">
								Current Balance
							</span>
							<span className="text-lg font-bold text-gray-900">{flowBalance}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-gray-700">Maximum</span>
							<span className="text-sm text-gray-600">{config.maxPoints}</span>
						</div>
					</div>

					{timeUntilReplenishment > 0 && (
						<div className="rounded-lg bg-purple-50 p-4">
							<div className="flex items-center gap-2 mb-2">
								<Focus className="h-4 w-4 text-purple-600" />
								<span className="text-sm font-medium text-purple-700">
									Next replenishment
								</span>
							</div>
							<span className="text-lg font-bold text-purple-900">
								{formatTimeUntilReplenishment(timeUntilReplenishment)}
							</span>
						</div>
					)}

					<div className="space-y-2 text-sm text-gray-600">
						<p>
							• You get {config.replenishAmount} focus points every{" "}
							{config.replenishIntervalHours} hours
						</p>
						<p>• Correct answers cost {config.correctAnswerCost} point</p>
						<p>• Incorrect answers cost {config.incorrectAnswerCost} points</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default FocusBlocker;
