import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface OnboardingMessageProps {
	text: string;
	isBot: boolean;
	isSkillsList?: boolean;
	isFlag?: boolean;
	isEmoji?: boolean;
	isTyping?: boolean;
}

const OnboardingMessage: React.FC<OnboardingMessageProps> = ({
	text,
	isBot,
	isSkillsList = false,
	isFlag = false,
	isEmoji = false,
	isTyping = false,
}) => {
	if (isTyping) {
		return (
			<div className={cn("flex items-start mb-4", isBot ? "justify-start" : "justify-end")}>
				<div
					className={cn(
						"rounded-lg px-4 py-2 max-w-[80%]",
						isBot
							? "bg-muted text-foreground rounded-tl-none"
							: "bg-primary text-primary-foreground rounded-tr-none"
					)}
				>
					<div className="flex gap-1">
						<div className="w-2 h-2 rounded-full bg-current animate-bounce" />
						<div
							className="w-2 h-2 rounded-full bg-current animate-bounce"
							style={{ animationDelay: "0.2s" }}
						/>
						<div
							className="w-2 h-2 rounded-full bg-current animate-bounce"
							style={{ animationDelay: "0.4s" }}
						/>
					</div>
				</div>
			</div>
		);
	}

	if (isSkillsList) {
		const skills = text.split(", ");
		return (
			<div className="flex justify-end mb-4">
				<div className="rounded-lg px-4 py-2 bg-primary/10 border border-primary/30 rounded-tr-none max-w-[90%]">
					{skills.map((skill, index) => (
						<span
							key={index}
							className="inline-block px-2 py-1 m-1 bg-primary/20 rounded-full"
						>
							{skill}
						</span>
					))}
				</div>
			</div>
		);
	}

	if (isFlag) {
		return (
			<div className="flex justify-end mb-4">
				<div className="rounded-lg p-6 bg-primary/10 border border-primary/30 rounded-tr-none">
					<div className="text-4xl">{text}</div>
				</div>
			</div>
		);
	}

	if (isEmoji) {
		return (
			<div className="flex justify-end mb-4">
				<div className="rounded-lg p-6 bg-primary/10 border border-primary/30 rounded-tr-none">
					<div className="text-4xl">{text}</div>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={cn("flex items-start mb-4", isBot ? "justify-start" : "justify-end")}
		>
			<div
				className={cn(
					"rounded-lg px-4 py-2 max-w-[80%]",
					isBot
						? "bg-muted text-foreground rounded-tl-none"
						: "bg-primary text-primary-foreground rounded-tr-none"
				)}
			>
				<p className="whitespace-pre-wrap">{text}</p>
			</div>
		</motion.div>
	);
};

export default OnboardingMessage;
