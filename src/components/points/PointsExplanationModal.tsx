import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/overlay/Dialog";
import { Separator } from "@/components/ui/layout/Separator";
import { useFlowPoints } from "@/hooks/points/useFlowPoints";
import { pointTypes } from "@/lib/ui";
import { useUserContext } from "@/contexts/UserContext";

interface PointsExplanationModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const PointsExplanationModal: React.FC<PointsExplanationModalProps> = ({ isOpen, onClose }) => {
	const { user } = useUserContext();

	const { getTimeUntilReplenishment, config } = useFlowPoints(user?.id || null);

	const [timeUntilReplenishment, setTimeUntilReplenishment] = useState<number>(
		getTimeUntilReplenishment()
	);

	// Update countdown every second
	useEffect(() => {
		if (!isOpen) return;

		const interval = setInterval(() => {
			setTimeUntilReplenishment(getTimeUntilReplenishment());
		}, 1000);

		return () => clearInterval(interval);
	}, [isOpen, getTimeUntilReplenishment]);

	const formatCountdown = (milliseconds: number) => {
		if (milliseconds <= 0) return "0m 0s";

		const totalSeconds = Math.ceil(milliseconds / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		return `${minutes}m ${seconds}s`;
	};

	const { flow, grey, dark, streak } = pointTypes;

	// Don't render if user details are not available yet
	if (!user) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl">
				<div className="space-y-6">
					{/* Flow Points Section */}
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<flow.icon className={`h-6 w-6 ${flow.textColor}`} />
							<h3 className="text-lg font-semibold">Flow Points</h3>
						</div>
						<div className="space-y-3">
							{timeUntilReplenishment > 0 && (
								<div>
									<span className="text-sm text-foreground">
										Next Replenishment
									</span>
									<p className="text-xl font-bold">
										{formatCountdown(timeUntilReplenishment)}
									</p>
								</div>
							)}
							<ul className="text-sm space-y-0.5 text-foreground">
								<li>• Used for learning activities and tests</li>
								<li>
									• Replenishes {config.replenishAmount} points every{" "}
									{config.replenishIntervalHours} hours
								</li>
								<li>• Correct answers cost {config.correctAnswerCost} point</li>
								<li>
									• Incorrect answers cost {config.incorrectAnswerCost} points
								</li>
								<li>• Maximum capacity: {config.maxPoints} points</li>
							</ul>
						</div>
					</div>

					<Separator />

					{/* Grey Points Section */}
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<grey.icon className={`h-6 w-6 ${grey.textColor}`} />
							<h3 className="text-lg font-semibold">Wise Points</h3>
						</div>
						<ul className="text-sm space-y-0.5 text-foreground">
							<li>• Earned by completing topics and courses</li>
							<li>• Used to unlock advanced content</li>
							<li>• Permanent currency - never depletes</li>
							<li>• Shows your learning progress</li>
						</ul>
					</div>

					<Separator />

					{/* Dark Points Section */}
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<dark.icon className={`h-6 w-6 ${dark.textColor}`} />
							<h3 className="text-lg font-semibold">Coins</h3>
						</div>
						<ul className="text-sm space-y-0.5 text-foreground">
							<li>• Premium currency for special items</li>
							<li>• Earned through quests and achievements</li>
							<li>• Used in the store for exclusive content</li>
							<li>• More valuable than Wise Points</li>
						</ul>
					</div>

					<Separator />

					{/* Streak Points Section */}
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<streak.icon className={`h-6 w-6 ${streak.textColor}`} />
							<h3 className="text-lg font-semibold">Streak</h3>
						</div>
						<ul className="text-sm space-y-0.5 text-foreground">
							<li>• Increased by learning daily</li>
							<li>• Lost when missing a day of learning</li>
							<li>• Can be protected with streak shields</li>
							<li>• Shows your consistency and dedication</li>
						</ul>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PointsExplanationModal;
