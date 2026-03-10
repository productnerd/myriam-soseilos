import React, { useState } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/overlay/Dialog";
import { useNewTopicNotifications } from "@/hooks/notifications/useNewTopicNotifications";
import { useUserContext } from "@/contexts/UserContext";

interface MentorPopupWithNotificationButtonsProps {
	isOpen: boolean;
	onClose: () => void;
	courseId: string;
	title?: string;
	message?: string;
}

const MentorPopupWithNotificationButtons: React.FC<MentorPopupWithNotificationButtonsProps> = ({
	isOpen,
	onClose,
	courseId,
	title = "Course Complete!",
	message = "You've completed all available topics in this course. Would you like to be notified when new topics are added?",
}) => {
	const [hasSignedUp, setHasSignedUp] = useState<boolean>(false);
	const { user } = useUserContext();
	const { signUpForNotifications, isLoading } = useNewTopicNotifications();

	const handleYes = async () => {
		try {
			await signUpForNotifications.mutateAsync({
				userId: user!.id,
				courseId: courseId,
			});
			setHasSignedUp(true);
		} catch (error) {
			console.error("❌ Failed to sign up for notifications:", error);
		}
	};

	const handleNo = () => {
		onClose();
	};

	const handleClose = () => {
		setHasSignedUp(false);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center">{title}</DialogTitle>
				</DialogHeader>

				<div className="text-center space-y-4">
					<p className="text-sm text-muted-foreground">{message}</p>

					{hasSignedUp ? (
						<div className="py-4">
							<p className="text-sm font-medium text-green-600">
								Alright. You got it.
							</p>
						</div>
					) : (
						<div className="flex justify-center space-x-3">
							<Button onClick={handleYes} disabled={isLoading} className="px-6">
								{isLoading ? "Signing up..." : "Yes"}
							</Button>
							<Button
								onClick={handleNo}
								variant="outline"
								disabled={isLoading}
								className="px-6"
							>
								No
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default MentorPopupWithNotificationButtons;
