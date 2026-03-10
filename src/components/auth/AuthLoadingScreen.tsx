import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AuthLoadingScreenProps {
	redirectTo?: string;
}

const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ redirectTo = "/learn" }) => {
	const [isVisible, setIsVisible] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		// Fade in for 3 seconds, stay visible for 0.5 second, then fade out for 3 seconds
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 6500); // 3s fade in + 0.5s visible + 3s fade out

		return () => clearTimeout(timer);
	}, []);

	// After animation completes, redirect
	const handleAnimationComplete = () => {
		navigate(redirectTo, { replace: true });
	};

	return (
		<AnimatePresence onExitComplete={handleAnimationComplete}>
			{isVisible && (
				<motion.div
					className="fixed inset-0 bg-black flex items-center justify-center z-50"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 3 }}
				>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 3,
							times: [0, 0.5, 1],
							ease: "easeInOut",
						}}
						className="w-full max-w-sm"
					>
						<div className="flex flex-col items-center justify-center">
							<div className="w-64 h-64 flex items-center justify-center">
								{/* Logo would typically be an image, using text as placeholder */}
								<motion.div
									className="text-4xl font-bold text-primary text-center"
									initial={{ scale: 0.9 }}
									animate={{ scale: 1 }}
									transition={{ duration: 3 }}
								>
									Educational
									<br />
									Adventure
								</motion.div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default AuthLoadingScreen;
