import { supabase } from "../supabase/client";

// OpenAI models
export const OPENAI_MODELS = {
	GPT_4O: "gpt-4o",
	GPT_4O_MINI: "gpt-4o-mini",
} as const;

export type OpenAIModel = (typeof OPENAI_MODELS)[keyof typeof OPENAI_MODELS];

export interface ChatCompletionMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface ChatCompletionOptions {
	model: OpenAIModel;
	messages: ChatCompletionMessage[];
	temperature?: number;
	max_tokens?: number;
}

export interface ChatCompletionResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: {
		message: {
			role: string;
			content: string;
		};
		index: number;
		finish_reason: string;
	}[];
}

// Get OpenAI API key from Supabase secrets
const getOpenAIApiKey = async (): Promise<string | null> => {
	console.log("Getting OpenAI API key from Supabase");

	try {
		// Call Supabase edge function to get the API key from secrets
		const { data, error } = await supabase.functions.invoke("get-openai-key");

		if (error) {
			console.error("Error retrieving API key from Supabase:", error);

			// Fallback to localStorage for development/testing
			const storedKey = localStorage.getItem("openai_api_key");
			if (storedKey) {
				console.log("Using API key from localStorage as fallback");
				return storedKey;
			}

			return null;
		}

		if (data?.apiKey) {
			console.log("Successfully retrieved API key from Supabase secrets");
			return data.apiKey;
		}

		console.log("No API key found in Supabase secrets, checking localStorage");

		// Fallback to localStorage
		const storedKey = localStorage.getItem("openai_api_key");
		if (storedKey) {
			console.log("Using API key from localStorage as fallback");
			return storedKey;
		}

		return null;
	} catch (error) {
		console.error("Error retrieving API key:", error);

		// Fallback to localStorage
		const storedKey = localStorage.getItem("openai_api_key");
		if (storedKey) {
			console.log("Using API key from localStorage as fallback");
			return storedKey;
		}

		return null;
	}
};

/**
 * Call the OpenAI Chat Completions API
 */
export const createChatCompletion = async (
	options: ChatCompletionOptions
): Promise<ChatCompletionResponse> => {
	console.log("=== OpenAI API Request Start ===");

	const apiKey = await getOpenAIApiKey();
	console.log("API Key found:", apiKey ? "Yes (hidden for security)" : "No");

	if (!apiKey) {
		console.error("OpenAI API key is not available");
		throw new Error(
			"OpenAI API key is not available. Please add your API key in the Supabase secrets."
		);
	}

	console.log("Request details:", {
		model: options.model,
		messageCount: options.messages.length,
		temperature: options.temperature,
		max_tokens: options.max_tokens,
		firstMessagePreview: options.messages[0]?.content.substring(0, 50) + "...",
		lastMessagePreview:
			options.messages[options.messages.length - 1]?.content.substring(0, 50) + "...",
	});

	const apiUrl = "https://api.openai.com/v1/chat/completions";
	const requestBody = {
		model: options.model,
		messages: options.messages,
		temperature: options.temperature ?? 0.7,
		max_tokens: options.max_tokens,
	};

	console.log(`Making API request to: ${apiUrl}`);
	console.log(`Request payload preview:`, {
		model: requestBody.model,
		messageCount: requestBody.messages.length,
		temperature: requestBody.temperature,
		max_tokens: requestBody.max_tokens,
	});

	try {
		console.log("Sending fetch request...");
		const response = await fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(requestBody),
		});

		console.log("OpenAI API response status:", response.status);
		console.log("OpenAI API response status text:", response.statusText);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("OpenAI API error response body:", errorText);

			let errorData;
			try {
				errorData = JSON.parse(errorText);
				console.error("Parsed error data:", errorData);
			} catch (e) {
				console.error("Failed to parse error response as JSON:", e);
			}

			const errorMessage = errorData?.error?.message || response.statusText;
			console.error("OpenAI API returned an error:", errorData || errorText);
			throw new Error(`OpenAI API Error (${response.status}): ${errorMessage}`);
		}

		const responseData = await response.json();
		console.log("OpenAI API response received successfully");
		console.log("Response structure:", Object.keys(responseData));
		console.log("Choices count:", responseData.choices?.length);
		console.log(
			"First choice content preview:",
			responseData.choices?.[0]?.message?.content?.substring(0, 100) + "..."
		);

		console.log("=== OpenAI API Request End ===");
		return responseData;
	} catch (error) {
		console.error("=== OpenAI API Request Failed ===");
		console.error("Error details:", error);
		throw error;
	}
};

/**
 * Simple helper for getting a text completion from OpenAI
 */
export const getCompletion = async (
	prompt: string,
	model: OpenAIModel = OPENAI_MODELS.GPT_4O_MINI
): Promise<string> => {
	try {
		const response = await createChatCompletion({
			model,
			messages: [{ role: "user", content: prompt }],
		});

		return response.choices[0].message.content;
	} catch (error) {
		console.error("Error getting text completion:", error);
		throw error;
	}
};

/**
 * Create a custom chat with system instructions and chat history
 */
export const createCustomChat = async (
	systemPrompt: string,
	messages: ChatCompletionMessage[],
	model: OpenAIModel = OPENAI_MODELS.GPT_4O
): Promise<string> => {
	try {
		const allMessages = [{ role: "system" as const, content: systemPrompt }, ...messages];

		const response = await createChatCompletion({
			model,
			messages: allMessages,
		});

		return response.choices[0].message.content;
	} catch (error) {
		console.error("Error with custom chat:", error);
		throw error;
	}
};
