import React, { useEffect, useRef } from "react";
import OnboardingMessage from "./OnboardingMessage";
import { SkillStat } from "./SkillVoteStats";
import { ChatMessage } from "@/types/messages";

interface OnboardingChatMessagesProps {
	messages: ChatMessage[];
	isTyping: boolean;
	showContinueButton?: boolean;
	showSkillSelection?: boolean;
	showFlagSelection?: boolean;
	showSkillStats?: boolean;
	topSkills?: SkillStat[];
	scrollContainerRef?: React.RefObject<HTMLDivElement>;
	onContinueClick?: () => void;
	onSkillSubmit?: (skills: string[]) => void;
	onFlagSubmit?: (flag: string) => void;
	onContinueAfterStats?: () => void;
}

const OnboardingChatMessages: React.FC<OnboardingChatMessagesProps> = ({
	messages,
	isTyping,
	showContinueButton,
	showSkillSelection,
	showFlagSelection,
	showSkillStats,
	topSkills,
	scrollContainerRef,
	onContinueClick,
	onSkillSubmit,
	onFlagSubmit,
	onContinueAfterStats,
}) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isTyping]);

	return (
		<div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
			<div className="max-w-lg mx-auto">
				{messages.map((msg, index) => {
					if (msg.isSkillsList) {
						return (
							<OnboardingMessage
								key={index}
								text={msg.text}
								isBot={msg.isBot}
								isSkillsList={true}
							/>
						);
					} else if (msg.isFlag) {
						return (
							<OnboardingMessage
								key={index}
								text={msg.text}
								isBot={msg.isBot}
								isFlag={true}
							/>
						);
					} else if (msg.isEmoji) {
						return (
							<OnboardingMessage
								key={index}
								text={msg.text}
								isBot={msg.isBot}
								isEmoji={true}
							/>
						);
					} else {
						return <OnboardingMessage key={index} text={msg.text} isBot={msg.isBot} />;
					}
				})}

				{isTyping && <OnboardingMessage text="" isBot={true} isTyping={true} />}

				<div ref={messagesEndRef} />
			</div>
		</div>
	);
};

export default OnboardingChatMessages;
