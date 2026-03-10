import {
	OpenAIModel,
	ChatCompletionMessage,
	ChatCompletionResponse,
} from "@/integrations/openai/client";

export interface OpenAIOptions {
	model?: OpenAIModel;
}

// TODO: This is not used anywhere
export interface OpenAIState {
	isLoading: boolean;
	error: Error | null;
	getTextCompletion: (prompt: string) => Promise<string>;
	createChatCompletion: (options: {
		model: OpenAIModel;
		messages: ChatCompletionMessage[];
	}) => Promise<ChatCompletionResponse>;
}

export interface FriendResponse {
	name: string;
	thumbnail: string | null;
	vote: string;
	poll_sharing: boolean;
}

export interface PollData {
	statistics: Record<string, number>;
	friendResponses: Record<string, FriendResponse[]>;
	userResponse: string | null;
	isLoading: boolean;
	error: Error | null;
}
