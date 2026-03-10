import { useState } from "react";
import { ChatMessage } from "@/types/messages";

export function useOnboardingMessages() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	const addBotMessage = (text: string) => {
		setMessages((prev) => [...prev, { text, isBot: true }]);
	};

	const addUserMessage = (text: string) => {
		setMessages((prev) => [...prev, { text, isBot: false }]);
	};

	const addSkillsListMessage = (skills: string[]) => {
		setMessages((prev) => [
			...prev,
			{
				text: skills.join(", "),
				isBot: false,
				isSkillsList: true,
			},
		]);
	};

	const addFlagMessage = (flag: string) => {
		setMessages((prev) => [
			...prev,
			{
				text: flag,
				isBot: false,
				isFlag: true,
			},
		]);
	};

	const addEmojiMessage = (emoji: string) => {
		setMessages((prev) => [
			...prev,
			{
				text: emoji,
				isBot: false,
				isEmoji: true,
			},
		]);
	};

	return {
		messages,
		addBotMessage,
		addUserMessage,
		addSkillsListMessage,
		addFlagMessage,
		addEmojiMessage,
	};
}
