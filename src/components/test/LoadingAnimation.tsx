import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TriviaDisplay from "@/components/trivia/TriviaDisplay";

interface LoadingAnimationProps {
	message?: string;
	showTrivia?: boolean;
	onLoadComplete?: () => void;
	children?: React.ReactNode;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
	message = "Loading...",
	showTrivia = true,
	onLoadComplete,
	children,
}) => {
	const [showLoading, setShowLoading] = useState(true);

	useEffect(() => {
		// Minimum loading time of 5 seconds
		const timer = setTimeout(() => {
			setShowLoading(false);
			if (onLoadComplete) {
				onLoadComplete();
			}
		}, 5000);

		return () => clearTimeout(timer);
	}, [onLoadComplete]);

	return (
		<AnimatePresence mode="wait">
			{showLoading ? (
				<motion.div
					key="loading"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.8 }}
					className="w-full flex flex-col items-center justify-center min-h-[70vh]"
				>
					<div className="flex flex-col items-center justify-center">
						<Loader2 className="w-12 h-12 animate-spin text-primary" />

						{message && (
							<p className="text-center text-muted-foreground mt-4">{message}</p>
						)}

						{showTrivia && <TriviaDisplay />}
					</div>

					{children}
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};

export default LoadingAnimation;
