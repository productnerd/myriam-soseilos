import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "@/components/ui/PageTransition";
import { Spinner } from "@/components/ui/Spinner";
import Logo from "@/components/ui/Logo";
import { useInvitationLogic } from "@/hooks/profile/useInvitationLogic";
import { AuthForm } from "@/components/auth/AuthForm";
import InviteHeader from "@/components/invite/InviteHeader";
import MentorPopup from "@/components/ui/MentorPopup";
import InviteFormCard from "@/components/invite/InviteFormCard";

// Component for when we have a valid access code ID
const InviteWithAccessCode = ({
	inviterName,
	loading,
	error,
	isLogin,
	setIsLogin,
	accessCode,
	handleAfterSignup,
}) => (
	<>
		{/* Invitation header when we have inviter information */}
		{!loading}

		{/* Show loading spinner while we're fetching inviter data */}
		{loading ? (
			<div className="flex flex-col items-center gap-4">
				<Spinner size="lg" />
				<p className="text-white">Loading invitation details...</p>
			</div>
		) : (
			<div className="animate-fade-in transition-all duration-1000 ease-&lsqb;cubic-bezier(0.68,-0.6,0.32,1.6)&rsqb;">
				<AuthForm
					isLogin={isLogin}
					setIsLogin={setIsLogin}
					hideHeader={false}
					accessCode={accessCode}
					onAfterSignup={handleAfterSignup}
				/>
			</div>
		)}
	</>
);

// Component for when we don't have an access code ID yet
const InviteWithoutAccessCode = ({ onSetMessage }) => (
	<InviteFormCard onSetMessage={onSetMessage} />
);

const InvitePage = () => {
	const { accessCode } = useParams<{
		accessCode?: string;
	}>();
	const [showMentor, setShowMentor] = useState(true);
	const [isLogin, setIsLogin] = useState(true);
	const [mentorMessage, setMentorMessage] = useState("Hello stranger. Got a key?");
	console.log("InvitePage: Current accessCode from params:", accessCode);

	// If we have an access code in the URL, use the invitation logic hook
	const { inviterName, loading, error, handleAfterSignup } = useInvitationLogic(accessCode);

	// Only show mentor popup when loading is complete
	useEffect(() => {
		if (!loading) {
			setShowMentor(true);
		}
	}, [loading]);

	// Get welcome message based on invitation status
	const getWelcomeMessage = () => {
		if (accessCode && error) {
			return error;
		} else if (accessCode && loading) {
			return "Looking up your invitation...";
		} else if (accessCode && inviterName) {
			return `${inviterName} has invited you! Happy to meet you finally. Let me show you around.`;
		} else if (accessCode) {
			// New default message when we have an access code but no inviter name
			return "I've been waiting for you. Let me show you around.";
		} else {
			return "Got an invitation code? Enter it below.";
		}
	};

	return (
		<PageTransition>
			<div
				className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
				style={{
					backgroundImage:
						'url("/lovable-uploads/a36ea43e-3e30-4577-8be4-e2eb52608353.png")',
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			>
				{/* Logo in top-left corner with 2rem spacing from edges */}
				<div className="absolute top-0 left-0 z-30 p-8">
					<Logo size="md" />
				</div>

				{/* Dark overlay */}
				<div className="absolute inset-0 bg-black/50"></div>

				<div className="w-full h-full flex flex-col items-center justify-center relative z-10">
					{accessCode ? (
						<InviteWithAccessCode
							inviterName={inviterName}
							loading={loading}
							error={error}
							isLogin={isLogin}
							setIsLogin={setIsLogin}
							accessCode={accessCode}
							handleAfterSignup={handleAfterSignup}
						/>
					) : (
						<InviteWithoutAccessCode onSetMessage={setMentorMessage} />
					)}
				</div>

				{/* Left-aligned indicator */}
				<div className="fixed bottom-3 left-3 z-30">
					<a
						href="#"
						className="text-white/70 text-xs hover:text-white/90 transition-colors bg-black/30 px-2 py-1 rounded"
					>
						Handcrafted in 🇿🇦
					</a>
				</div>

				{/* Only show mentor popup when appropriate */}
				{showMentor && (
					<MentorPopup content={<p>{getWelcomeMessage()}</p>} isVisible={showMentor} />
				)}
			</div>
		</PageTransition>
	);
};

export default InvitePage;
