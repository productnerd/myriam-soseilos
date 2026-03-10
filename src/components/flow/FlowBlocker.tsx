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
import { Clock } from "lucide-react";
interface FlowBlockerProps {
	children: React.ReactNode;
}

const FlowBlocker: React.FC<FlowBlockerProps> = ({ children }) => {
	// TODO: If this component is planned to be used and will not be rendered from a protected route, need to have a '!user' check.
	const { user } = useUserContext();

	const { flowBalance, config, getTimeUntilReplenishment } = useFlowPoints(user?.id || null);

	const timeUntilReplenishment = getTimeUntilReplenishment();

	// Don't render if user details are not available yet
	if (!user) {
		return null;
	}

	const formatTimeUntilReplenishment = (milliseconds: number): string => {
		const totalMinutes = Math.floor(milliseconds / (1000 * 60));
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
						<Clock className="h-8 w-8 text-blue-600" />
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">
						Out of Flow Points
					</CardTitle>
					<CardDescription className="text-gray-600">
						You need flow points to continue learning activities
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
						<div className="rounded-lg bg-blue-50 p-4">
							<div className="flex items-center gap-2 mb-2">
								<Clock className="h-4 w-4 text-blue-600" />
								<span className="text-sm font-medium text-blue-700">
									Next replenishment
								</span>
							</div>
							<span className="text-lg font-bold text-blue-900">
								{formatTimeUntilReplenishment(timeUntilReplenishment)}
							</span>
						</div>
					)}

					<div className="space-y-2 text-sm text-gray-600">
						<p>
							• You get {config.replenishAmount} flow points every{" "}
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

export default FlowBlocker;
