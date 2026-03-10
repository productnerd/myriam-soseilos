import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { Loader2, Key, AlertTriangle } from "lucide-react";
import { useOpenAI } from "@/hooks/integrations/useOpenAI";
import { toast } from "sonner";
import PageTransition from "@/components/ui/PageTransition";
import { Alert, AlertDescription } from "@/components/ui/feedback/Alert";

const AIChatPage: React.FC = () => {
	const [messages, setMessages] = useState<
		{ role: "system" | "user" | "assistant"; content: string }[]
	>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [apiKey, setApiKey] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { createChatCompletion, OPENAI_MODELS } = useOpenAI();

	useEffect(() => {
		// Only try to get API key from localStorage - no default key for security
		const storedKey = localStorage.getItem("openai_api_key");
		if (storedKey) {
			setApiKey(storedKey);
		}
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const validateInput = (inputText: string): boolean => {
		// Basic input validation
		if (!inputText.trim()) {
			toast.error("Please enter a message");
			return false;
		}

		if (inputText.length > 4000) {
			toast.error("Message too long. Please keep it under 4000 characters.");
			return false;
		}

		return true;
	};

	const sanitizeInput = (inputText: string): string => {
		// Basic sanitization - remove potentially harmful content
		return inputText.trim().slice(0, 4000);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateInput(input)) return;

		const sanitizedInput = sanitizeInput(input);

		// Add user message
		const userMessage = { role: "user" as const, content: sanitizedInput };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			console.log("Sending request to OpenAI...");
			console.log("API Key is set:", !!apiKey);

			if (!apiKey) {
				throw new Error("API key is required");
			}

			localStorage.setItem("openai_api_key", apiKey);

			const result = await createChatCompletion({
				model: OPENAI_MODELS.GPT_4O_MINI,
				messages: [...messages, userMessage],
			});

			console.log("Received response from OpenAI:", result);

			const aiMessage = result.choices[0].message;
			setMessages((prev) => [
				...prev,
				{
					role: aiMessage.role as "assistant",
					content: aiMessage.content,
				},
			]);
		} catch (error) {
			console.error("Error querying OpenAI:", error);
			toast.error(`Failed to get a response from OpenAI: ${error.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	const saveApiKey = () => {
		if (!apiKey.trim()) {
			toast.error("Please enter a valid API key");
			return;
		}

		// Basic API key format validation
		if (!apiKey.startsWith("sk-")) {
			toast.error('Invalid API key format. OpenAI keys start with "sk-"');
			return;
		}

		localStorage.setItem("openai_api_key", apiKey);
		toast.success("API key saved!");
		console.log("API key saved to localStorage");
	};

	return (
		<PageTransition>
			<div className="container max-w-4xl mx-auto py-8 px-4">
				<Card className="shadow-lg border-gray-700">
					<CardHeader className="border-b border-gray-700">
						<CardTitle className="flex items-center gap-2">
							<span className="text-purple-500">OpenAI</span> Conversation
						</CardTitle>

						<Alert className="mt-4">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								Your API key is stored locally in your browser and is never sent to
								our servers. Keep your API key secure and never share it with
								others.
							</AlertDescription>
						</Alert>

						<div className="mt-4 bg-gray-800 p-4 rounded-md">
							<h3 className="text-sm font-medium mb-2 flex items-center gap-2">
								<Key size={16} /> API Key Configuration
							</h3>
							<div className="flex gap-2">
								<Input
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									placeholder="Enter your OpenAI API key (sk-...)"
									type="password"
									className="bg-gray-700 text-white border-gray-600"
									maxLength={200}
								/>
								<Button onClick={saveApiKey} size="sm">
									Save
								</Button>
							</div>
							<p className="text-xs text-gray-400 mt-2">
								Get your API key from the OpenAI platform. Your key is stored
								locally and never sent to our servers.
							</p>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col h-[500px]">
							<div className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-900 dark:bg-gray-900 rounded-md">
								{messages.length === 0 ? (
									<div className="flex flex-col items-center justify-center h-full text-gray-500">
										<Loader2 className="h-8 w-8 mb-2 animate-spin" />
										<p>Start a conversation with OpenAI</p>
									</div>
								) : (
									messages.map((message, index) => (
										<div
											key={index}
											className={`mb-4 p-3 rounded-lg ${
												message.role === "user"
													? "bg-gray-600 text-white ml-auto max-w-[80%]"
													: "bg-gray-700 text-white mr-auto max-w-[80%]"
											}`}
										>
											<div className="font-semibold mb-1">
												{message.role === "user" ? "You" : "AI"}
											</div>
											<div className="whitespace-pre-wrap break-words">
												{message.content}
											</div>
										</div>
									))
								)}
								<div ref={messagesEndRef} />
							</div>

							<form onSubmit={handleSubmit} className="flex gap-2">
								<div className="flex-grow relative">
									<Input
										value={input}
										onChange={(e) => setInput(e.target.value)}
										placeholder="Type your message..."
										disabled={isLoading}
										className="w-full bg-gray-800 border-gray-700 text-white"
										maxLength={4000}
									/>
									<div className="text-xs text-gray-400 mt-1">
										{input.length}/4000 characters
									</div>
								</div>
								<Button
									type="submit"
									disabled={isLoading || !input.trim() || !apiKey.trim()}
									className="bg-purple-600 hover:bg-purple-700"
								>
									{isLoading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										"Send"
									)}
								</Button>
							</form>
						</div>
					</CardContent>
				</Card>
			</div>
		</PageTransition>
	);
};

export default AIChatPage;
