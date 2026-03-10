import React from "react";
import OnboardingInput from "./OnboardingInput";

interface OnboardingChatInputProps {
	onSubmit: (message: string) => void;
	disabled: boolean;
}

const OnboardingChatInput: React.FC<OnboardingChatInputProps> = ({ onSubmit, disabled }) => {
	return (
		<div className="border-t px-4 py-4 bg-background fixed bottom-20 left-0 right-0 z-10 flex justify-center">
			<div className="w-full max-w-2xl mx-auto">
				<OnboardingInput onSubmit={onSubmit} disabled={disabled} />
			</div>
		</div>
	);
};

export default OnboardingChatInput;
