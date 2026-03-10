import { useState } from "react";

export function useTypingSimulation() {
	const [isTyping, setIsTyping] = useState(false);

	const simulateBotTyping = async () => {
		await new Promise((resolve) =>
			setTimeout(resolve, Math.floor(Math.random() * 1000) + 2000)
		);

		setIsTyping(true);
		const delay = Math.floor(Math.random() * 2000) + 2000;
		await new Promise((resolve) => setTimeout(resolve, delay));
		setIsTyping(false);
		return true;
	};

	return {
		isTyping,
		simulateBotTyping,
	};
}
