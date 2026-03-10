import React, { useState } from "react";
import { useOnboardingFlow } from "@/hooks/onboarding/useOnboardingFlow";
import OnboardingStepManager from "./OnboardingStepManager";
import { Button } from "@/components/ui/interactive/Button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import MentorPopup from "@/components/ui/MentorPopup";
import { OnboardingStep } from "./OnboardingStepManager";
const OnboardingFlow: React.FC = () => {
	const navigate = useNavigate();
	const [showMentor, setShowMentor] = useState(false);
	const [mentorMessage, setMentorMessage] = useState("");
	const [hideMentorMessage, setHideMentorMessage] = useState(false);
	const [mentorSlideDown, setMentorSlideDown] = useState(false);
	const {
		currentStep,
		showAssessment,
		topSkills,
		handleStartAssessment,
		handleAssessmentComplete,
		handleSkillSubmit,
		handleContinueAfterStats,
		handleFlagSubmit,
		handleEmojiSubmit,
	} = useOnboardingFlow();
	const handleSkip = () => {
		navigate("/learn");
	};
	const handleMentorUpdate = (show: boolean, message: string, hideMessage?: boolean) => {
		if (!show && currentStep === OnboardingStep.COMPLETE) {
			// Trigger slide-down animation for completion step
			setMentorSlideDown(true);
			setTimeout(() => {
				setShowMentor(false);
				setMentorSlideDown(false);
			}, 1000); // Animation duration
		} else {
			setShowMentor(show);
			setMentorMessage(message);
			setHideMentorMessage(hideMessage || false);
			setMentorSlideDown(false);
		}
	};
	return (
		<div className="fixed inset-0 w-full h-full">
			{/* Header with Logo and Skip Button - Always visible */}
			<div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
				<Logo size="md" />
				<Button
					variant="ghost"
					className="flex items-center gap-2 text-white hover:bg-white/10"
					onClick={handleSkip}
				>
					Skip <ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Main Content Container - Full screen */}
			<div className="flex items-center justify-center w-full h-full px-4 relative z-10">
				{/* Glassmorphic Container - Dynamic height */}
				<div className="glass w-full max-w-md p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl flex flex-col">
					<OnboardingStepManager
						currentStep={currentStep}
						showAssessment={showAssessment}
						topSkills={topSkills}
						onStartAssessment={handleStartAssessment}
						onAssessmentComplete={handleAssessmentComplete}
						onSkillSubmit={handleSkillSubmit}
						onContinueAfterStats={handleContinueAfterStats}
						onFlagSubmit={handleFlagSubmit}
						onEmojiSubmit={handleEmojiSubmit}
						onMentorUpdate={handleMentorUpdate}
					/>
				</div>
			</div>

			{/* Bottom message */}
			<div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
				<div className="px-4 py-2 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 z-[-100]">
					<p className="text-xs text-white/50 text-center">
						Content will always be free for everybody.
					</p>
				</div>
			</div>

			{/* Mentor popup positioned at bottom right of screen - Behind main content */}
			{showMentor && (
				<div
					className={`fixed bottom-0 right-0 z-5 transition-transform duration-1000 ease-out ${
						mentorSlideDown ? "translate-y-full" : "translate-y-0"
					}`}
				>
					<MentorPopup
						content={<p>{mentorMessage}</p>}
						isVisible={showMentor}
						hideMessage={hideMentorMessage}
						hideOnClick={false}
					/>
				</div>
			)}
		</div>
	);
};
export default OnboardingFlow;
