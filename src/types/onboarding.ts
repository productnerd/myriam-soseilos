import { ChatMessage } from "./messages";

// TODO: This is not used anywhere
export interface OnboardingState {
	messages: ChatMessage[];
	showContinueButton: boolean;
}
