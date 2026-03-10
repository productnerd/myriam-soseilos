import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
	children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{
				duration: 0.8, // Slower fade in for better effect
				delay: 0.2, // Small delay to make sure loading has faded out
			}}
			className="page-transition"
		>
			{children}
		</motion.div>
	);
};

export default PageTransition;
