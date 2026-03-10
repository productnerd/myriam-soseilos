import React, { useState, useEffect } from "react";
import MentorPopupWithNotificationButtons from "@/components/ui/MentorPopupWithNotificationButtons";
import { useNewTopicNotifications } from "@/hooks/notifications/useNewTopicNotifications";
import { useUserContext } from "@/contexts/UserContext";

interface CourseCompletionNotificationProps {
	courseId: string;
	isVisible: boolean;
	onClose: () => void;
}

const CourseCompletionNotification: React.FC<CourseCompletionNotificationProps> = ({
	courseId,
	isVisible,
	onClose,
}) => {
	const [shouldShow, setShouldShow] = useState<boolean>(false);
	const { user } = useUserContext();
	const { checkNotificationStatus } = useNewTopicNotifications();

	useEffect(() => {
		const checkIfShouldShow = async () => {
			if (isVisible) {
				// Check if user is already signed up for notifications
				const isAlreadySignedUp = await checkNotificationStatus(user!.id, courseId);
				setShouldShow(!isAlreadySignedUp);
			} else {
				setShouldShow(false);
			}
		};

		checkIfShouldShow();
	}, [isVisible, user!.id, courseId, checkNotificationStatus]);

	const handleClose = () => {
		setShouldShow(false);
		onClose();
	};

	if (!shouldShow) {
		return null;
	}

	return (
		<MentorPopupWithNotificationButtons
			isOpen={shouldShow}
			onClose={handleClose}
			courseId={courseId}
			title="Course Complete!"
			message="You've completed all available topics in this course. Would you like to be notified when new topics are added?"
		/>
	);
};

export default CourseCompletionNotification;
