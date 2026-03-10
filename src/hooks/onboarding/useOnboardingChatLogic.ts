import { useState, useRef } from "react";
import { useOnboardingState } from "@/hooks/onboarding/useOnboardingState";
import { useTypingSimulation } from "@/hooks/onboarding/useTypingSimulation";
import { useNameHandling } from "@/hooks/profile/useNameHandling";
import { useEmojiHandling } from "@/hooks/profile/useEmojiHandling";
import { useScrollToBottom } from "@/hooks/ui/useScrollToBottom";
import { useSkillVotes } from "@/hooks/onboarding/useSkillVotes";

/**
 * Hook for managing onboarding chat logic
 *
 * @param userId - The ID of the authenticated user
 * @returns Onboarding chat logic functions and state
 */
export function useOnboardingChatLogic(userId: string) {
	const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(false);
	const [showAssessment, setShowAssessment] = useState<boolean>(false);
	const [showSkillSelection, setShowSkillSelection] = useState<boolean>(false);
	const [showFlagSelection, setShowFlagSelection] = useState<boolean>(false);
	const [showEmojiSelection, setShowEmojiSelection] = useState<boolean>(false);
	const [showSkillStats, setShowSkillStats] = useState<boolean>(false);
	const initialMessageSent = useRef(false);

	const { isTyping, simulateBotTyping } = useTypingSimulation();
	const { handleNameInput } = useNameHandling(userId);
	const { handleEmojiSubmit } = useEmojiHandling(userId); // TODO: Missing 'selectedEmoji' param

	const {
		messages,
		addBotMessage,
		addUserMessage,
		addSkillsListMessage,
		addFlagMessage,
		addEmojiMessage,
		showContinueButton,
		setShowContinueButton,
	} = useOnboardingState();

	const { scrollContainerRef, scrollToBottom } = useScrollToBottom();
	const { submitSkillVotes, fetchTopSkills, topSkills } = useSkillVotes(userId);

	// Start the chat when component mounts - but only once
	const startChat = async () => {
		if (initialMessageSent.current || messages.length > 0) return;

		initialMessageSent.current = true;
		await simulateBotTyping();
		addBotMessage("What's your name?");
	};

	const handleUserInput = async (text: string) => {
		if (!text.trim()) return;

		addUserMessage(text);

		// Handle name input
		if (messages.length === 1) {
			const success = await handleNameInput(text);
			if (success) {
				await simulateBotTyping();
				addBotMessage(`Welcome ${text}!`);

				await simulateBotTyping();
				addBotMessage("Let's see if school taught you any actual life skills...");

				setShowContinueButton(true);
			}
		}
	};

	const handleContinueClick = () => {
		setShowAssessment(true);
		setShowContinueButton(false);
	};

	const handleAssessmentComplete = async () => {
		setShowAssessment(false);
		setAssessmentCompleted(true);

		await simulateBotTyping();
		addBotMessage("School has not helped you learn much practical knowledge huh...");

		await simulateBotTyping();
		addBotMessage("What are the skills that interest you most rn?");

		setShowSkillSelection(true);
	};

	const handleSkillSubmit = async (selectedSkills: string[]) => {
		setShowSkillSelection(false);
		addSkillsListMessage(selectedSkills);
		await simulateBotTyping();
		await submitSkillVotes(selectedSkills);
		addBotMessage("Please pick a flag that represents you:");
		setShowFlagSelection(true);
	};

	const handleFlagSubmit = async (selectedFlag: string) => {
		setShowFlagSelection(false);
		addFlagMessage(selectedFlag);
		await simulateBotTyping();
		addBotMessage("Choose your favorite emoji:");
		setShowEmojiSelection(true);
	};

	const handleEmojiSubmission = async (selectedEmoji: string) => {
		setShowEmojiSelection(false);
		addEmojiMessage(selectedEmoji);
		await handleEmojiSubmit(selectedEmoji);

		await simulateBotTyping();
		addBotMessage(`Nice choice! Let me show you what other users picked for skills:`);

		await fetchTopSkills();
		setShowSkillStats(true);
	};

	const handleContinueAfterStats = () => {
		setShowSkillStats(false);
		setShowAssessment(true);
	};

	return {
		messages,
		isTyping,
		showContinueButton,
		showAssessment,
		showSkillSelection,
		showFlagSelection,
		showEmojiSelection,
		showSkillStats,
		topSkills,
		scrollContainerRef,
		handleUserInput,
		handleContinueClick,
		handleAssessmentComplete,
		handleSkillSubmit,
		handleFlagSubmit,
		handleEmojiSubmission,
		handleContinueAfterStats,
		startChat,
	};
}
