import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";

interface OnboardingInputProps {
	onSubmit: (message: string) => void;
	disabled?: boolean;
}

const OnboardingInput: React.FC<OnboardingInputProps> = ({ onSubmit, disabled = false }) => {
	const [message, setMessage] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!disabled && inputRef.current) {
			inputRef.current.focus();
		}
	}, [disabled]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim() && !disabled) {
			onSubmit(message);
			setMessage("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<Input
				ref={inputRef}
				type="text"
				placeholder="Type your message..."
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				disabled={disabled}
				className="flex-1"
			/>
			<Button type="submit" size="icon" disabled={disabled || !message.trim()}>
				<Send className="h-5 w-5" />
			</Button>
		</form>
	);
};

export default OnboardingInput;
