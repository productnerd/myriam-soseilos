import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { UserSidequest } from "@/types/user";
import { pointTypes } from "@/lib/ui";

interface QuestRewardsCelebrationProps {
	quest: UserSidequest;
	onClose: () => void;
}

const QuestRewardsCelebration: React.FC<QuestRewardsCelebrationProps> = ({ quest, onClose }) => {
	const { grey, dark } = pointTypes;

	useEffect(() => {
		// Fire confetti on mount
		const duration = 3000;
		const end = Date.now() + duration;

		const launchConfetti = () => {
			confetti({
				particleCount: 3,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: ["#10b981", "#6366f1", "#f59e0b"],
			});

			confetti({
				particleCount: 3,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: ["#10b981", "#6366f1", "#f59e0b"],
			});

			if (Date.now() < end) {
				requestAnimationFrame(launchConfetti);
			}
		};

		launchConfetti();

		// Close celebration after certain time
		const timer = setTimeout(() => {
			onClose();
		}, 5000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
			onClick={onClose}
		>
			<div
				className="animate-bounce-in text-center max-w-lg px-6 py-8 bg-card rounded-lg shadow-lg border border-border"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-3xl font-bold mb-4">Rewards Claimed!</h2>

				<div className="my-6 flex justify-center gap-6">
					{quest.sidequest.grey_token_reward > 0 && (
						<div className="text-center">
							<div className="flex items-center justify-center mb-2">
								<grey.icon
									className={`h-16 w-16 ${grey.textColor} animate-pulse`}
								/>
							</div>
							<p className="text-xl font-semibold">
								+{quest.sidequest.grey_token_reward}
							</p>
							<p className="text-muted-foreground">Grey Points</p>
						</div>
					)}

					{quest.sidequest.dark_token_reward > 0 && (
						<div className="text-center">
							<div className="flex items-center justify-center mb-2">
								<dark.icon
									className={`h-16 w-16 ${dark.textColor} animate-pulse`}
								/>
							</div>
							<p className="text-xl font-semibold">
								+{quest.sidequest.dark_token_reward}
							</p>
							<p className="text-muted-foreground">Dark Points</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default QuestRewardsCelebration;
