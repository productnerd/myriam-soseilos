import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TestModalProps {
	isOpen: boolean;
	onClose: () => void;
	testId: string;
	onComplete: (skipped: boolean) => void;
	courseId: string;
	isLevelTest?: boolean;
}

const TestModal: React.FC<TestModalProps> = ({
	isOpen,
	onClose,
	testId,
	courseId,
	isLevelTest = false,
}) => {
	const navigate = useNavigate();

	// When the modal is opened, navigate to the test page with query parameters
	useEffect(() => {
		if (isOpen && testId) {
			console.log(
				`Navigating to test page: /test/${testId} with courseId: ${courseId}, isLevelTest: ${isLevelTest}`
			);
			// Use clear navigation with all necessary parameters
			const url = `/test/${testId}?returnUrl=/learn&courseId=${courseId}&isLevelTest=${isLevelTest}`;
			navigate(url);
		}
	}, [isOpen, testId, navigate, courseId, isLevelTest]);

	// No need to render anything as we're navigating away
	return null;
};

export default TestModal;
