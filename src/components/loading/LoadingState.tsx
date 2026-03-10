import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import TriviaDisplay from "@/components/trivia/TriviaDisplay";

interface LoadingStateProps {
	showTrivia?: boolean;
	message?: string; // Re-add the message prop
}

const LoadingState: React.FC<LoadingStateProps> = ({
	showTrivia = false,
	message = "Loading...", // Default message
}) => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Ensure loading state shows for at least 5 seconds
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	// If we're still in the loading state (even if real loading is done)
	// we show the loading screen with trivia
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
				<Loader2 className="h-12 w-12 mb-8 animate-spin text-primary/70" />

				{/* Display the message if provided */}
				{message && <p className="text-center text-muted-foreground mb-6">{message}</p>}

				{showTrivia && (
					<div className="max-w-lg w-full mt-8">
						<TriviaDisplay />
					</div>
				)}
			</div>
		);
	}

	// This will only show if the component hasn't been unmounted within 5 seconds
	return null;
};

export default LoadingState;
