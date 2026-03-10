import { Button } from "@/components/ui/interactive/Button";
import { toast } from "@/hooks/ui/useToast";
import { AlertTriangle, Bell, CheckCircle2 } from "lucide-react";

const ToastPositionDemo = () => {
	const showBottomRightToast = () => {
		toast({
			title: "System Update",
			description: "The system has been updated successfully",
			icon: CheckCircle2,
			iconProps: { className: "text-green-500" },
		});
	};

	const showTopRightToast = () => {
		toast.topRight({
			title: "Points Earned!",
			description: "You've earned 50 dark points for completing a quest",
			icon: Bell,
			iconProps: { className: "text-purple-500" },
		});
	};

	const showTopCenterToast = () => {
		toast.topCenter({
			title: "Achievement Unlocked",
			description: "You've reached a new milestone!",
			icon: AlertTriangle,
			iconProps: { className: "text-amber-500" },
		});
	};

	return (
		<div className="space-y-8 p-8">
			<h2 className="text-2xl font-bold mb-4">Toast Position Demo</h2>
			<div className="flex flex-col space-y-4">
				<div className="p-4 bg-card rounded-lg shadow-sm">
					<h3 className="text-lg font-medium mb-2">Bottom Right Toast (Default)</h3>
					<p className="text-muted-foreground mb-4">
						System updates and general notifications
					</p>
					<Button onClick={showBottomRightToast}>Show Bottom Right Toast</Button>
				</div>

				<div className="p-4 bg-card rounded-lg shadow-sm">
					<h3 className="text-lg font-medium mb-2">Top Right Toast</h3>
					<p className="text-muted-foreground mb-4">
						Quests, points, and reward notifications
					</p>
					<Button onClick={showTopRightToast}>Show Top Right Toast</Button>
				</div>

				<div className="p-4 bg-card rounded-lg shadow-sm">
					<h3 className="text-lg font-medium mb-2">Top Center Toast</h3>
					<p className="text-muted-foreground mb-4">
						Important announcements and achievements
					</p>
					<Button onClick={showTopCenterToast}>Show Top Center Toast</Button>
				</div>
			</div>
		</div>
	);
};

export default ToastPositionDemo;
