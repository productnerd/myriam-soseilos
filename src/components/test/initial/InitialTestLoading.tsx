import React from "react";
import LoadingAnimation from "@/components/test/LoadingAnimation";

interface InitialTestLoadingProps {
	message?: string;
	onLoadComplete?: () => void;
}

const InitialTestLoading: React.FC<InitialTestLoadingProps> = ({
	message = "Preparing your test...",
	onLoadComplete,
}) => {
	return (
		<div className="container mx-auto flex flex-col items-center justify-center h-full min-h-[70vh]">
			<div className="w-full max-w-md mx-auto text-center">
				<LoadingAnimation
					message={message}
					showTrivia={true}
					onLoadComplete={onLoadComplete}
				/>
			</div>
		</div>
	);
};

export default InitialTestLoading;
