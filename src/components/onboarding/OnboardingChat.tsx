import OnboardingAssessment from "./OnboardingAssessment";
import OnboardingChatMessages from "./OnboardingChatMessages";
import OnboardingChatInput from "./OnboardingChatInput";
import { useOnboardingChatLogic } from "@/hooks/onboarding/useOnboardingChatLogic";

const OnboardingChat = () => {
	const {
		messages,
		isTyping,
		showContinueButton,
		showAssessment,
		showSkillSelection,
		showFlagSelection,
		showSkillStats,
		topSkills,
		scrollContainerRef,
		handleUserInput,
		handleContinueClick,
		handleAssessmentComplete,
		handleSkillSubmit,
		handleFlagSubmit,
		handleContinueAfterStats,
	} = useOnboardingChatLogic();

	return (
		<div className="flex flex-col h-screen max-h-screen pt-14 overflow-hidden">
			{/* Chat messages container with extra padding at bottom for fixed components */}
			<div className="flex-1 overflow-hidden flex justify-center">
				<div className="w-full max-w-2xl flex flex-col h-full">
					<OnboardingChatMessages
						messages={messages}
						isTyping={isTyping}
						showContinueButton={showContinueButton}
						showSkillSelection={showSkillSelection}
						showFlagSelection={showFlagSelection}
						showSkillStats={showSkillStats}
						topSkills={topSkills}
						scrollContainerRef={scrollContainerRef}
						onContinueClick={handleContinueClick}
						onSkillSubmit={handleSkillSubmit}
						onFlagSubmit={handleFlagSubmit}
						onContinueAfterStats={handleContinueAfterStats}
					/>
				</div>
			</div>

			{/* Fixed input area at bottom */}
			<OnboardingChatInput
				onSubmit={handleUserInput}
				disabled={
					isTyping ||
					showContinueButton ||
					showAssessment ||
					showSkillSelection ||
					showFlagSelection ||
					showSkillStats
				}
			/>

			{/* Assessment modal */}
			{showAssessment && <OnboardingAssessment onComplete={handleAssessmentComplete} />}
		</div>
	);
};

export default OnboardingChat;
