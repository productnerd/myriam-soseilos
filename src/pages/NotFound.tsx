import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/interactive/Button";
import PageTransition from "@/components/ui/PageTransition";
import { motion } from "framer-motion";
const NotFound = () => {
	const location = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		console.error("404 Error: User attempted to access non-existent route:", location.pathname);
	}, [location.pathname]);
	return (
		<PageTransition>
			<div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
				{/* Static background */}
				<div
					className="absolute inset-0 bg-gradient-to-br from-background to-background/80 z-0"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
						opacity: 0.05,
						mixBlendMode: "overlay",
					}}
				/>

				<div className="glass rounded-2xl p-8 max-w-md w-full text-center relative z-10">
					<motion.h1 /* Changed from text-primary to solid brown color */
						initial={{
							opacity: 0,
							y: -20,
						}}
						animate={{
							opacity: 1,
							y: 0,
						}}
						transition={{
							delay: 0.2,
							duration: 0.6,
						}}
						className="text-5xl md:text-5xl font-bold mb-6 text-orange-600"
					>
						Not all who wonder are lost.
					</motion.h1>

					<motion.p
						className="text-lg text-gray-600 dark:text-gray-400 mb-8"
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						transition={{
							delay: 0.4,
							duration: 0.6,
						}}
					>
						The page you're looking for doesn't exist.
					</motion.p>

					<motion.div
						initial={{
							opacity: 0,
							y: 20,
						}}
						animate={{
							opacity: 1,
							y: 0,
						}}
						transition={{
							delay: 0.6,
							duration: 0.6,
						}}
					>
						<Button
							className="bg-[#E64500] hover:bg-[#E64500]/90 text-white px-6 py-2 rounded-full btn-hover"
							onClick={() => navigate("/")}
						>
							Return to Home
						</Button>
					</motion.div>
				</div>
			</div>
		</PageTransition>
	);
};
export default NotFound;
