import React, { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthRedirect } from "@/hooks/auth-redirect/useAuthRedirect";
import MentorPopup from "@/components/ui/MentorPopup";
import Logo from "@/components/ui/Logo";

const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [showMentor, setShowMentor] = useState(true);

	// Use the auth redirect hook
	useAuthRedirect();

	// Prepare the welcome message
	const getWelcomeMessage = () => {
		return "Welcome stranger.\nLet me show you around.";
	};

	return (
		<div className="fixed inset-0 w-full h-full">
			{/* Full screen background image */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage:
						'url("/lovable-uploads/a36ea43e-3e30-4577-8be4-e2eb52608353.png")',
				}}
			/>

			{/* Logo in top-left corner with 2rem spacing from edges */}
			<div className="absolute top-0 left-0 z-30 p-8">
				<Logo size="md" />
			</div>

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/50 z-10"></div>

			<div className="relative z-20 w-full h-full flex items-center justify-center">
				<div className="animate-fade-in transition-all duration-1000 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]">
					<AuthForm isLogin={isLogin} setIsLogin={setIsLogin} hideHeader={false} />
				</div>
			</div>

			{/* Left-aligned indicators */}
			<div className="fixed bottom-3 left-3 z-30 flex flex-col items-start gap-2">
				<a
					href="#"
					className="text-white/70 text-xs hover:text-white/90 transition-colors bg-black/30 px-2 py-1 rounded"
				>
					Handcrafted in 🇮🇩🇿🇦
				</a>
			</div>

			{/* Mentor popup positioned at bottom right of screen */}
			{showMentor && (
				<div className="fixed bottom-0 right-0 z-40">
					<MentorPopup content={<p>{getWelcomeMessage()}</p>} isVisible={showMentor} />
				</div>
			)}
		</div>
	);
};

export default AuthPage;
