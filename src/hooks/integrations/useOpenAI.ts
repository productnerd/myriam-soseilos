import { useState } from "react";
import {
	createChatCompletion,
	getCompletion,
	createCustomChat,
	OpenAIModel,
	OPENAI_MODELS,
	ChatCompletionResponse,
	ChatCompletionMessage,
} from "@/integrations/openai/client";

import { OpenAIOptions } from "@/types/integrations";

export const useOpenAI = (options: OpenAIOptions = {}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const getTextCompletion = async (prompt: string): Promise<string> => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await getCompletion(prompt, options.model || OPENAI_MODELS.GPT_4O_MINI);
			return result;
		} catch (err) {
			setError(err instanceof Error ? err : new Error(String(err)));
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const handleChatCompletion = async (options: {
		model: OpenAIModel;
		messages: ChatCompletionMessage[];
	}): Promise<ChatCompletionResponse> => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await createChatCompletion(options);
			return result;
		} catch (err) {
			setError(err instanceof Error ? err : new Error(String(err)));
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		error,
		getTextCompletion,
		createChatCompletion: handleChatCompletion,
		createCustomChat,
		OPENAI_MODELS,
	};
};

export default useOpenAI;
