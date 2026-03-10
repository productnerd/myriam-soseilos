import React from "react";
import LoadingAnimation from "@/components/test/LoadingAnimation";

interface LevelTestLoadingProps {
	message?: string;
	onLoadComplete?: () => void;
}

const LevelTestLoading: React.FC<LevelTestLoadingProps> = ({
	message = "Updating your progress...",
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

export default LevelTestLoading;
