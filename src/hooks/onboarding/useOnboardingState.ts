import { useState } from "react";
import { useOnboardingMessages } from "@/hooks/onboarding/useOnboardingMessages";

export const useOnboardingState = () => {
	const [showContinueButton, setShowContinueButton] = useState(false);
	const {
		messages,
		addBotMessage,
		addUserMessage,
		addSkillsListMessage,
		addFlagMessage,
		addEmojiMessage,
	} = useOnboardingMessages();

	return {
		messages,
		addBotMessage,
		addUserMessage,
		addSkillsListMessage,
		addFlagMessage,
		addEmojiMessage,
		showContinueButton,
		setShowContinueButton,
	};
};
