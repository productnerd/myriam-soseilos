import React from "react";
import LoadingAnimation from "@/components/test/LoadingAnimation";

interface TopicLearningLoadingProps {
	message?: string;
	onLoadComplete?: () => void;
}

const LearningLoading: React.FC<TopicLearningLoadingProps> = ({
	message = "Loading your learning session...",
	onLoadComplete,
}) => {
	return (
		<div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[70vh]">
			<div className="max-w-md mx-auto text-center">
				<LoadingAnimation
					message={message}
					showTrivia={true}
					onLoadComplete={onLoadComplete}
				/>
			</div>
		</div>
	);
};

export default LearningLoading;
