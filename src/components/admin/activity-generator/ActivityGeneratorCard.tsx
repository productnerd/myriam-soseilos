import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Textarea } from "@/components/ui/form/Textarea";
import { Label } from "@/components/ui/form/Label";
import { Input } from "@/components/ui/form/Input";
import { Trash2, Wand2, Copy, Save, RefreshCw } from "lucide-react";
import { ActivityType } from "@/types/activity";
import { useOpenAI } from "@/hooks/integrations/useOpenAI";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ActivityTypeSelector, ACTIVITY_TYPES } from "./components/ActivityTypeSelector";
import { generatePrompt } from "./utils/promptGenerator";
import { Switch } from "@/components/ui/form/Switch";

interface GeneratedActivity {
	id: string;
	type: ActivityType;
	optionsCount?: number;
	customContext: string;
	isGenerating: boolean;
	generatedContent?: {
		question: string;
		options?: string[];
		correctAnswerIndex?: number;
		optionExplanations?: string[];
		explanation?: string;
		correctAnswer?: string;
	};
}

interface ActivityGeneratorCardProps {
	activity: GeneratedActivity;
	selectedTopic: string;
	basePrompt: string;
	onUpdate: (updates: Partial<GeneratedActivity>) => void;
	onRemove: () => void;
}

const ActivityGeneratorCard: React.FC<ActivityGeneratorCardProps> = ({
	activity,
	selectedTopic,
	basePrompt,
	onUpdate,
	onRemove,
}) => {
	const { getTextCompletion, isLoading } = useOpenAI();

	const [selectedType, setSelectedType] = useState(activity.type);
	const [optionsCount, setOptionsCount] = useState(activity.optionsCount || 4);
	const [customContext, setCustomContext] = useState(activity.customContext);
	const [isSaving, setIsSaving] = useState(false);
	const [showDebugInfo, setShowDebugInfo] = useState(false);

	// Editable fields for generated content
	const [editableQuestion, setEditableQuestion] = useState("");
	const [editableOptions, setEditableOptions] = useState<string[]>(["", "", "", ""]);
	const [editableOptionExplanations, setEditableOptionExplanations] = useState<string[]>([
		"",
		"",
		"",
		"",
	]);
	const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
	const [editableExplanation, setEditableExplanation] = useState("");
	const [editableCorrectAnswer, setEditableCorrectAnswer] = useState("");

	// Debug state
	const [debugLogs, setDebugLogs] = useState<string[]>([]);
	const [lastApiResponse, setLastApiResponse] = useState<string>("");
	const [lastError, setLastError] = useState<string>("");

	const addDebugLog = (message: string) => {
		const timestamp = new Date().toLocaleTimeString();
		const logMessage = `[${timestamp}] ${message}`;
		console.log(logMessage);
		setDebugLogs((prev) => [...prev, logMessage]);
	};

	const selectedActivityType = ACTIVITY_TYPES.find((type) => type.value === selectedType);
	const needsOptions = selectedActivityType?.needsOptions || false;

	// Update editable fields when generated content changes
	React.useEffect(() => {
		if (activity.generatedContent) {
			setEditableQuestion(activity.generatedContent.question || "");
			setEditableCorrectAnswer(activity.generatedContent.correctAnswer || "");

			if (activity.generatedContent.options) {
				const newOptions = [...activity.generatedContent.options];
				while (newOptions.length < optionsCount) {
					newOptions.push("");
				}
				setEditableOptions(newOptions);
			}
			if (activity.generatedContent.optionExplanations) {
				const newExplanations = [...activity.generatedContent.optionExplanations];
				while (newExplanations.length < optionsCount) {
					newExplanations.push("");
				}
				setEditableOptionExplanations(newExplanations);
			}
			setCorrectAnswerIndex(activity.generatedContent.correctAnswerIndex ?? 0);
			setEditableExplanation(activity.generatedContent.explanation || "");
		}
	}, [activity.generatedContent, optionsCount]);

	// Initialize options array when activity type changes
	React.useEffect(() => {
		if (selectedType === "true_false" || selectedType === "myth_or_reality") {
			setEditableOptions(["True", "False"]);
			setEditableOptionExplanations(["", ""]);
			setOptionsCount(2);
		} else if (selectedType === "pair_matching") {
			// For pair matching, we need even number of options
			const evenCount = optionsCount % 2 === 0 ? optionsCount : optionsCount + 1;
			setOptionsCount(evenCount);
			const newOptions = Array(evenCount).fill("");
			setEditableOptions(newOptions);
			// No explanations for pair matching
			setEditableOptionExplanations([]);
		} else if (needsOptions) {
			const newOptions = Array(optionsCount).fill("");
			const newExplanations = Array(optionsCount).fill("");
			setEditableOptions(newOptions);
			setEditableOptionExplanations(newExplanations);
		}
	}, [selectedType, needsOptions, optionsCount]);

	// Helper function to shuffle array
	const shuffleArray = (array: any[]) => {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	// Helper function to clean OpenAI response
	const cleanOpenAIResponse = (response: string): string => {
		// Remove markdown code fences and language identifiers
		let cleaned = response.trim();

		// Remove ```json at the beginning
		if (cleaned.startsWith("```json")) {
			cleaned = cleaned.substring(7);
		} else if (cleaned.startsWith("```")) {
			cleaned = cleaned.substring(3);
		}

		// Remove ``` at the end
		if (cleaned.endsWith("```")) {
			cleaned = cleaned.substring(0, cleaned.length - 3);
		}

		return cleaned.trim();
	};

	const generateActivity = async () => {
		if (!customContext.trim()) {
			toast.error("Please provide context for the activity");
			return;
		}

		setShowDebugInfo(true);
		setDebugLogs([]);
		setLastError("");
		setLastApiResponse("");

		addDebugLog("Generate activity button clicked");
		addDebugLog("Starting generation process...");
		onUpdate({ isGenerating: true });

		try {
			addDebugLog("Generating prompt...");
			const prompt = generatePrompt(selectedType, optionsCount, customContext, basePrompt);
			addDebugLog(
				`Generated prompt (${prompt.length} chars): ${prompt.substring(0, 100)}...`
			);

			addDebugLog("Making OpenAI API call...");
			const response = await getTextCompletion(prompt);
			addDebugLog(`OpenAI API response received (${response.length} chars)`);
			addDebugLog(`Raw API response: ${response.substring(0, 200)}...`);
			setLastApiResponse(response);

			try {
				addDebugLog("Attempting to parse JSON response...");
				const cleanedResponse = cleanOpenAIResponse(response);
				addDebugLog(`Cleaned response: ${cleanedResponse.substring(0, 200)}...`);

				const parsedResponse = JSON.parse(cleanedResponse);
				addDebugLog("JSON parsed successfully");
				addDebugLog(`Parsed content keys: ${Object.keys(parsedResponse).join(", ")}`);

				onUpdate({
					type: selectedType,
					optionsCount: needsOptions ? optionsCount : undefined,
					customContext,
					generatedContent: parsedResponse,
					isGenerating: false,
				});

				addDebugLog("Activity updated successfully");
				toast.success("Activity generated successfully!");
				setLastError("");
			} catch (parseError) {
				const errorMsg = `Failed to parse AI response: ${parseError}`;
				addDebugLog(`ERROR: ${errorMsg}`);
				setLastError(errorMsg);
				addDebugLog(`Raw response was: ${response}`);
				toast.error("Failed to parse AI response. Please try again.");
				onUpdate({ isGenerating: false });
			}
		} catch (error) {
			const errorMsg = `Error generating activity: ${error}`;
			addDebugLog(`ERROR: ${errorMsg}`);
			setLastError(errorMsg);
			toast.error("Failed to generate activity. Please check the debug logs for details.");
			onUpdate({ isGenerating: false });
		}
	};

	const regenerateOption = async (optionIndex: number) => {
		if (!customContext.trim()) {
			toast.error("Please provide context for the activity");
			return;
		}

		addDebugLog(`Regenerating option ${optionIndex + 1}...`);
		setShowDebugInfo(true);

		try {
			const regeneratePrompt = `${basePrompt}\n\nRegenerate only option ${
				optionIndex + 1
			} for this ${selectedType} question. Context: ${customContext}\n\nCurrent question: ${editableQuestion}\n\nCurrent options:\n${editableOptions
				.map((opt, i) => `${i + 1}. ${opt}`)
				.join(
					"\n"
				)}\n\nRespond with ONLY a JSON object containing the new option text and its explanation in this format: {"option": "new option text", "explanation": "explanation for this option"}`;

			const response = await getTextCompletion(regeneratePrompt);

			try {
				const cleanedResponse = cleanOpenAIResponse(response);
				const parsed = JSON.parse(cleanedResponse);
				const newOptions = [...editableOptions];
				const newExplanations = [...editableOptionExplanations];

				newOptions[optionIndex] = parsed.option || response.trim();
				newExplanations[optionIndex] = parsed.explanation || "";

				setEditableOptions(newOptions);
				setEditableOptionExplanations(newExplanations);

				addDebugLog(
					`Option ${optionIndex + 1} regenerated: ${parsed.option || response.trim()}`
				);
				toast.success(`Option ${optionIndex + 1} regenerated successfully!`);
			} catch (parseError) {
				// Fallback to treating response as just the option text
				const cleanedResponse = cleanOpenAIResponse(response);
				const newOptions = [...editableOptions];
				newOptions[optionIndex] = cleanedResponse;
				setEditableOptions(newOptions);

				addDebugLog(`Option ${optionIndex + 1} regenerated (fallback): ${cleanedResponse}`);
				toast.success(`Option ${optionIndex + 1} regenerated successfully!`);
			}
		} catch (error) {
			const errorMsg = `Error regenerating option: ${error}`;
			addDebugLog(`ERROR: ${errorMsg}`);
			setLastError(errorMsg);
			toast.error("Failed to regenerate option. Please try again.");
		}
	};

	const saveActivity = async () => {
		if (!selectedTopic || !editableQuestion) {
			const errorMsg = "Please ensure question is filled and topic is selected";
			addDebugLog(`SAVE ERROR: ${errorMsg}`);
			toast.error(errorMsg);
			return;
		}

		setIsSaving(true);
		setShowDebugInfo(true);
		addDebugLog("Starting save process...");

		try {
			// Check authentication first
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();
			if (authError || !user) {
				addDebugLog(`AUTH ERROR: ${authError?.message || "No authenticated user"}`);
				toast.error("You must be logged in to save activities");
				return;
			}
			addDebugLog(`Authenticated user: ${user.id}`);

			// Validate based on activity type
			let correctAnswer: any = "";
			let explanationData = null;
			let activityOptions = null;

			if (selectedType === "sorting") {
				// For sorting, correct answer should be an array of items in correct order
				const filledOptions = editableOptions
					.filter((opt) => opt.trim())
					.slice(0, optionsCount);
				if (filledOptions.length < optionsCount) {
					const errorMsg = `Please fill in all ${optionsCount} options for sorting`;
					addDebugLog(`SAVE ERROR: ${errorMsg}`);
					toast.error(errorMsg);
					return;
				}

				// Correct answer is the order as entered by the user
				correctAnswer = filledOptions;

				// Randomize the options for display (different from correct order)
				activityOptions = shuffleArray(filledOptions);

				// Create explanations for each position
				if (editableOptionExplanations.some((exp) => exp.trim())) {
					const explanationsObj = filledOptions.reduce((acc, opt, index) => {
						if (editableOptionExplanations[index]?.trim()) {
							acc[`position_${index + 1}`] = editableOptionExplanations[index];
						}
						return acc;
					}, {} as Record<string, string>);

					if (Object.keys(explanationsObj).length > 0) {
						explanationData = JSON.stringify({ positions: explanationsObj });
					}
				}
			} else if (selectedType === "pair_matching") {
				// For pair matching, correct answer should be an array of pairs
				const filledOptions = editableOptions.filter((opt) => opt.trim());
				if (filledOptions.length < optionsCount || filledOptions.length % 2 !== 0) {
					const errorMsg = `Please fill in all ${optionsCount} options for pair matching (must be even number)`;
					addDebugLog(`SAVE ERROR: ${errorMsg}`);
					toast.error(errorMsg);
					return;
				}

				// Create pairs from the options (left-right pattern)
				const pairs = [];
				for (let i = 0; i < filledOptions.length; i += 2) {
					pairs.push(`${filledOptions[i]}-${filledOptions[i + 1]}`);
				}
				correctAnswer = pairs;

				// Randomize the options for display
				activityOptions = shuffleArray(filledOptions);

				// No explanations for pair matching as requested
			} else if (selectedType === "true_false" || selectedType === "myth_or_reality") {
				if (correctAnswerIndex >= editableOptions.length) {
					const errorMsg = "Please select a correct answer";
					addDebugLog(`SAVE ERROR: ${errorMsg}`);
					toast.error(errorMsg);
					return;
				}
				correctAnswer = editableOptions[correctAnswerIndex];

				// Create explanations for both options
				const explanationsObj = editableOptions.reduce((acc, opt, index) => {
					if (editableOptionExplanations[index]?.trim()) {
						acc[opt] = editableOptionExplanations[index];
					}
					return acc;
				}, {} as Record<string, string>);

				if (Object.keys(explanationsObj).length > 0) {
					explanationData = JSON.stringify({ options: explanationsObj });
				}
				activityOptions = editableOptions.filter((opt) => opt.trim());
			} else if (selectedType === "text_input") {
				if (!editableCorrectAnswer.trim()) {
					const errorMsg = "Please provide a correct answer for text input";
					addDebugLog(`SAVE ERROR: ${errorMsg}`);
					toast.error(errorMsg);
					return;
				}
				correctAnswer = editableCorrectAnswer;
				if (editableExplanation.trim()) {
					explanationData = JSON.stringify({ default: editableExplanation });
				}
			} else if (needsOptions) {
				// Multiple choice, etc.
				const filledOptions = editableOptions.filter((opt) => opt.trim());
				if (filledOptions.length < optionsCount) {
					const errorMsg = `Please fill in all ${optionsCount} options`;
					addDebugLog(`SAVE ERROR: ${errorMsg}`);
					toast.error(errorMsg);
					return;
				}

				if (correctAnswerIndex >= filledOptions.length) {
					const errorMsg = "Please select a correct answer";
					addDebugLog(`SAVE ERROR: ${errorMsg}`);
					toast.error(errorMsg);
					return;
				}

				correctAnswer = filledOptions[correctAnswerIndex];
				activityOptions = filledOptions;

				// Option explanations
				if (editableOptionExplanations.some((exp) => exp.trim())) {
					const explanationsObj = filledOptions.reduce((acc, opt, index) => {
						if (editableOptionExplanations[index]?.trim()) {
							acc[opt] = editableOptionExplanations[index];
						}
						return acc;
					}, {} as Record<string, string>);

					explanationData = JSON.stringify({ options: explanationsObj });
				}
			}

			addDebugLog(`Selected Topic: ${selectedTopic}`);
			addDebugLog(`Question: ${editableQuestion.substring(0, 50)}...`);
			addDebugLog(`Activity Type: ${selectedType}`);
			addDebugLog(
				`Correct Answer: ${
					Array.isArray(correctAnswer) ? JSON.stringify(correctAnswer) : correctAnswer
				}`
			);

			// Get the next order number for this topic
			const { data: existingActivities, error: fetchError } = await supabase
				.from("activities")
				.select("order_number")
				.eq("topic_id", selectedTopic)
				.order("order_number", { ascending: false })
				.limit(1);

			if (fetchError) {
				addDebugLog(`ERROR fetching existing activities: ${fetchError.message}`);
				throw fetchError;
			}

			const nextOrderNumber =
				existingActivities && existingActivities.length > 0
					? existingActivities[0].order_number + 1
					: 1;

			addDebugLog(`Next order number: ${nextOrderNumber}`);

			// Prepare the activity data
			const activityData = {
				type: selectedType,
				main_text: editableQuestion,
				correct_answer: correctAnswer,
				explanation: explanationData,
				options: activityOptions,
				topic_id: selectedTopic,
				order_number: nextOrderNumber,
				author_id: user.id,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			addDebugLog(`Activity data prepared with ${activityOptions?.length || 0} options`);
			addDebugLog("Inserting activity into database...");

			const { error: insertError } = await supabase.from("activities").insert(activityData);

			if (insertError) {
				addDebugLog(`ERROR inserting activity: ${insertError.message}`);
				addDebugLog(`Insert error details: ${JSON.stringify(insertError)}`);
				throw insertError;
			}

			addDebugLog("Activity saved successfully to database");
			toast.success("Activity saved successfully!");

			// Reset the form
			addDebugLog("Resetting form fields...");
			setEditableQuestion("");
			setEditableOptions(Array(optionsCount).fill(""));
			setEditableOptionExplanations(Array(optionsCount).fill(""));
			setCorrectAnswerIndex(0);
			setEditableExplanation("");
			setEditableCorrectAnswer("");
			setCustomContext("");
			onUpdate({ generatedContent: undefined, customContext: "" });
			addDebugLog("Form reset complete");
		} catch (error) {
			const errorMsg = `Error saving activity: ${error}`;
			addDebugLog(`SAVE ERROR: ${errorMsg}`);
			setLastError(errorMsg);
			console.error("Error saving activity:", error);
			toast.error("Failed to save activity. Please check the debug logs for details.");
		} finally {
			setIsSaving(false);
			addDebugLog("Save process completed");
		}
	};

	const copyToClipboard = () => {
		if (!activity.generatedContent) return;

		const content = JSON.stringify(activity.generatedContent, null, 2);
		navigator.clipboard.writeText(content);
		toast.success("Activity content copied to clipboard!");
	};

	const copyDebugLog = () => {
		const debugContent = [
			`Selected Type: ${selectedType}`,
			`Options Count: ${optionsCount}`,
			`Needs Options: ${needsOptions ? "Yes" : "No"}`,
			`Selected Topic: ${selectedTopic || "None"}`,
			`Has Generated Content: ${activity.generatedContent ? "Yes" : "No"}`,
			`Is Saving: ${isSaving ? "Yes" : "No"}`,
			lastError ? `Last Error: ${lastError}` : "",
			lastApiResponse ? `Last API Response: ${lastApiResponse}` : "",
			"",
			"Debug Logs:",
			...debugLogs,
		]
			.filter(Boolean)
			.join("\n");

		navigator.clipboard.writeText(debugContent);
		toast.success("Debug log copied to clipboard!");
	};

	const updateOption = (index: number, value: string) => {
		const newOptions = [...editableOptions];
		newOptions[index] = value;
		setEditableOptions(newOptions);
	};

	const updateOptionExplanation = (index: number, value: string) => {
		const newExplanations = [...editableOptionExplanations];
		newExplanations[index] = value;
		setEditableOptionExplanations(newExplanations);
	};

	const clearDebugLogs = () => {
		setDebugLogs([]);
		setLastApiResponse("");
		setLastError("");
		setShowDebugInfo(false);
	};

	const renderActivityTypeFields = () => {
		switch (selectedType) {
			case "true_false":
				return (
					<div className="space-y-4">
						<Label>True/False Options with Explanations</Label>
						{["True", "False"].map((option, index) => (
							<div key={index} className="space-y-2 p-4 border rounded-lg">
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-2">
										<Switch
											checked={correctAnswerIndex === index}
											onCheckedChange={(checked) => {
												if (checked) {
													setCorrectAnswerIndex(index);
												}
											}}
										/>
										<Label className="text-sm font-medium">
											{correctAnswerIndex === index ? "Correct" : "Incorrect"}
										</Label>
									</div>
									<div className="flex-1 font-medium">{option}</div>
									<Button
										size="sm"
										variant="outline"
										onClick={() => regenerateOption(index)}
										disabled={isLoading || !customContext.trim()}
										className="p-2"
									>
										<RefreshCw className="h-4 w-4" />
									</Button>
								</div>
								<Textarea
									value={editableOptionExplanations[index] || ""}
									onChange={(e) => updateOptionExplanation(index, e.target.value)}
									placeholder={`Explanation for ${option}...`}
									rows={2}
									className="text-sm"
								/>
							</div>
						))}
					</div>
				);

			case "myth_or_reality":
				return (
					<div className="space-y-4">
						<Label>Myth or Reality Options with Explanations</Label>
						{["Myth", "Reality"].map((option, index) => (
							<div key={index} className="space-y-2 p-4 border rounded-lg">
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-2">
										<Switch
											checked={correctAnswerIndex === index}
											onCheckedChange={(checked) => {
												if (checked) {
													setCorrectAnswerIndex(index);
												}
											}}
										/>
										<Label className="text-sm font-medium">
											{correctAnswerIndex === index ? "Correct" : "Incorrect"}
										</Label>
									</div>
									<div className="flex-1 font-medium">{option}</div>
									<Button
										size="sm"
										variant="outline"
										onClick={() => regenerateOption(index)}
										disabled={isLoading || !customContext.trim()}
										className="p-2"
									>
										<RefreshCw className="h-4 w-4" />
									</Button>
								</div>
								<Textarea
									value={editableOptionExplanations[index] || ""}
									onChange={(e) => updateOptionExplanation(index, e.target.value)}
									placeholder={`Explanation for ${option}...`}
									rows={2}
									className="text-sm"
								/>
							</div>
						))}
					</div>
				);

			case "text_input":
				return (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>Correct Answer</Label>
							<Input
								value={editableCorrectAnswer}
								onChange={(e) => setEditableCorrectAnswer(e.target.value)}
								placeholder="Enter the correct answer..."
							/>
						</div>
						<div className="space-y-2">
							<Label>Explanation</Label>
							<Textarea
								value={editableExplanation}
								onChange={(e) => setEditableExplanation(e.target.value)}
								placeholder="Enter an explanation for the answer..."
								rows={2}
							/>
						</div>
					</div>
				);

			case "poll":
				return (
					<div className="space-y-4">
						<Label>Poll Options</Label>
						<p className="text-sm text-muted-foreground">
							For polls, there's no correct answer - all options are valid choices for
							users to select.
						</p>
						{editableOptions.slice(0, optionsCount).map((option, index) => (
							<div key={index} className="space-y-2 p-4 border rounded-lg">
								<div className="flex items-center gap-3">
									<Input
										value={option}
										onChange={(e) => updateOption(index, e.target.value)}
										placeholder={`Option ${index + 1}`}
										className="flex-1"
									/>
									<Button
										size="sm"
										variant="outline"
										onClick={() => regenerateOption(index)}
										disabled={isLoading || !customContext.trim()}
										className="p-2"
									>
										<RefreshCw className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				);

			case "pair_matching":
				return (
					<div className="space-y-4">
						<Label>Pair Matching</Label>
						<p className="text-sm text-muted-foreground">
							Create pairs of items that match together. Each left item corresponds to
							the right item below it.
						</p>
						{Array.from({ length: Math.floor(optionsCount / 2) }).map(
							(_, pairIndex) => {
								const leftIndex = pairIndex * 2;
								const rightIndex = pairIndex * 2 + 1;
								return (
									<div
										key={pairIndex}
										className="space-y-3 p-4 border rounded-lg"
									>
										<div className="font-medium text-sm">
											Pair {pairIndex + 1}
										</div>
										<div className="grid grid-cols-2 gap-3">
											<div className="space-y-2">
												<Label className="text-xs">Left Item</Label>
												<Input
													value={editableOptions[leftIndex] || ""}
													onChange={(e) =>
														updateOption(leftIndex, e.target.value)
													}
													placeholder={`Left item ${pairIndex + 1}`}
												/>
											</div>
											<div className="space-y-2">
												<Label className="text-xs">Right Item</Label>
												<Input
													value={editableOptions[rightIndex] || ""}
													onChange={(e) =>
														updateOption(rightIndex, e.target.value)
													}
													placeholder={`Right item ${pairIndex + 1}`}
												/>
											</div>
										</div>
									</div>
								);
							}
						)}
					</div>
				);

			case "sorting":
				return (
					<div className="space-y-4">
						<Label>Sorting Order</Label>
						<p className="text-sm text-muted-foreground">
							Enter the items in their correct order. The numbers show the correct
							sequence. Note: Options will be randomized when displayed to users.
						</p>
						{editableOptions.slice(0, optionsCount).map((option, index) => (
							<div key={index} className="space-y-2 p-4 border rounded-lg">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
										{index + 1}
									</div>
									<Input
										value={option}
										onChange={(e) => updateOption(index, e.target.value)}
										placeholder={`Item ${index + 1} (in correct order)`}
										className="flex-1"
									/>
									<Button
										size="sm"
										variant="outline"
										onClick={() => regenerateOption(index)}
										disabled={isLoading || !customContext.trim()}
										className="p-2"
									>
										<RefreshCw className="h-4 w-4" />
									</Button>
								</div>
								<Textarea
									value={editableOptionExplanations[index] || ""}
									onChange={(e) => updateOptionExplanation(index, e.target.value)}
									placeholder={`Explanation for position ${index + 1}...`}
									rows={2}
									className="text-sm"
								/>
							</div>
						))}
					</div>
				);

			case "multiple_choice":
				return (
					<div className="space-y-4">
						<Label>Options with Explanations</Label>
						{editableOptions.slice(0, optionsCount).map((option, index) => (
							<div key={index} className="space-y-2 p-4 border rounded-lg">
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-2">
										<Switch
											checked={correctAnswerIndex === index}
											onCheckedChange={(checked) => {
												if (checked) {
													setCorrectAnswerIndex(index);
												}
											}}
										/>
										<Label className="text-sm font-medium">
											{correctAnswerIndex === index ? "Correct" : "Incorrect"}
										</Label>
									</div>
									<Input
										value={option}
										onChange={(e) => updateOption(index, e.target.value)}
										placeholder={`Option ${index + 1}`}
										className="flex-1"
									/>
									<Button
										size="sm"
										variant="outline"
										onClick={() => regenerateOption(index)}
										disabled={isLoading || !customContext.trim()}
										className="p-2"
									>
										<RefreshCw className="h-4 w-4" />
									</Button>
								</div>
								<Textarea
									value={editableOptionExplanations[index] || ""}
									onChange={(e) => updateOptionExplanation(index, e.target.value)}
									placeholder={`Explanation for option ${index + 1}...`}
									rows={2}
									className="text-sm"
								/>
							</div>
						))}
					</div>
				);

			default:
				return (
					<div className="space-y-2">
						<Label>Explanation</Label>
						<Textarea
							value={editableExplanation}
							onChange={(e) => setEditableExplanation(e.target.value)}
							placeholder="Enter an explanation for the answer..."
							rows={2}
						/>
					</div>
				);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">Activity #{activity.id}</CardTitle>
					<Button variant="outline" size="sm" onClick={onRemove}>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Debug Display - Only show when generating or after generation */}
				{showDebugInfo && (
					<div className="p-4 bg-gray-50 border rounded text-xs space-y-2 text-black">
						<div className="flex justify-between items-center">
							<div>
								<strong>Debug Info:</strong>
							</div>
							<div className="flex gap-2">
								<Button onClick={copyDebugLog} size="sm" variant="outline">
									<Copy className="h-3 w-3 mr-1" />
									Copy Debug Log
								</Button>
								<Button onClick={clearDebugLogs} size="sm" variant="outline">
									Clear
								</Button>
							</div>
						</div>
						<div>Selected Type: {selectedType}</div>
						<div>Options Count: {optionsCount}</div>
						<div>Needs Options: {needsOptions ? "Yes" : "No"}</div>
						<div>Selected Topic: {selectedTopic || "None"}</div>
						<div>Has Generated Content: {activity.generatedContent ? "Yes" : "No"}</div>
						<div>Is Saving: {isSaving ? "Yes" : "No"}</div>
						{lastError && (
							<div className="text-red-600 p-2 bg-red-50 rounded">
								<strong>Last Error:</strong> {lastError}
							</div>
						)}
						{lastApiResponse && (
							<div className="max-h-32 overflow-y-auto p-2 bg-blue-50 rounded">
								<strong>Last API Response:</strong>
								<pre className="whitespace-pre-wrap text-xs">{lastApiResponse}</pre>
							</div>
						)}
						{debugLogs.length > 0 && (
							<div className="max-h-32 overflow-y-auto p-2 bg-gray-100 rounded">
								<strong>Debug Logs:</strong>
								{debugLogs.map((log, index) => (
									<div key={index} className="text-xs">
										{log}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				<ActivityTypeSelector
					selectedType={selectedType}
					onTypeChange={(type: ActivityType) => {
						setSelectedType(type);
					}}
					optionsCount={optionsCount}
					onOptionsCountChange={(count) => {
						setOptionsCount(count);
					}}
					activityId={activity.id}
				/>

				<div className="space-y-2">
					<Label htmlFor={`context-${activity.id}`}>Custom Context</Label>
					<Textarea
						id={`context-${activity.id}`}
						placeholder="e.g., 'a question relevant to acne and the best ways to take care of it' or 'a question about the importance of magnesium for bones'"
						value={customContext}
						onChange={(e) => setCustomContext(e.target.value)}
						rows={3}
					/>
				</div>

				<div className="flex gap-2">
					<Button
						onClick={generateActivity}
						disabled={isLoading || activity.isGenerating || !customContext.trim()}
						className="flex items-center gap-2"
					>
						<Wand2 className="h-4 w-4" />
						{activity.isGenerating ? "Generating..." : "Generate Activity"}
					</Button>

					{activity.generatedContent && (
						<Button
							variant="outline"
							onClick={copyToClipboard}
							className="flex items-center gap-2"
						>
							<Copy className="h-4 w-4" />
							Copy JSON
						</Button>
					)}
				</div>

				{/* Editable Activity Form - Always visible */}
				<div className="space-y-4">
					<h4 className="font-semibold text-lg">Edit Activity Content</h4>

					<div className="space-y-2">
						<Label>Question</Label>
						<Textarea
							value={editableQuestion}
							onChange={(e) => setEditableQuestion(e.target.value)}
							placeholder="Enter the activity question here..."
							rows={3}
						/>
					</div>

					{renderActivityTypeFields()}

					<Button
						onClick={saveActivity}
						disabled={isSaving || !selectedTopic || !editableQuestion}
						className="flex items-center gap-2"
					>
						<Save className="h-4 w-4" />
						{isSaving ? "Saving..." : "Save Activity"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default ActivityGeneratorCard;
