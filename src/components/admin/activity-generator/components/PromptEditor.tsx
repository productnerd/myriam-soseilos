import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Textarea } from "@/components/ui/form/Textarea";
import { Edit3, Save } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_PROMPT = `You're an instructional designer helping operators create interactive courses (like Duolingo) to teach life skills.
Each course has topics, and each topic contains activities. The tone throughout this exercise should be informal, nurturing, kind and wise. I like it a bit snarky. As if a wise old man with a lot of knowledge and experience is talking. Make it lean towards British English and use beautiful words where appropriate.

Keep questions practical, not academic.
Consider what the user would find most useful in their day to day life to make them useful.
Use real-life examples.
For multiple choice questions, make all options plausible. Include some that seem more right than the real answer to increase difficulty of the activity.
Use concise, casual, snarky-but-not-cringe language. Tease the user a bit.`;

interface PromptEditorProps {
	onPromptChange: (prompt: string) => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ onPromptChange }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [currentPrompt, setCurrentPrompt] = useState(DEFAULT_PROMPT);
	const [editingPrompt, setEditingPrompt] = useState(currentPrompt);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Load prompt from localStorage
	useEffect(() => {
		const loadPrompt = () => {
			try {
				const savedPrompt = localStorage.getItem("activity_generator_prompt");
				if (savedPrompt) {
					setCurrentPrompt(savedPrompt);
					setEditingPrompt(savedPrompt);
					onPromptChange(savedPrompt);
				} else {
					onPromptChange(DEFAULT_PROMPT);
				}
			} catch (error) {
				console.error("Error loading prompt from localStorage:", error);
				toast.error("Failed to load custom prompt");
				onPromptChange(DEFAULT_PROMPT);
			} finally {
				setIsLoading(false);
			}
		};

		loadPrompt();
	}, [onPromptChange]);

	const handleSave = () => {
		setIsSaving(true);
		try {
			localStorage.setItem("activity_generator_prompt", editingPrompt);
			setCurrentPrompt(editingPrompt);
			onPromptChange(editingPrompt);
			setIsEditing(false);
			toast.success("Base prompt saved successfully!");
		} catch (error) {
			console.error("Error saving prompt:", error);
			toast.error("Failed to save prompt");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setEditingPrompt(currentPrompt);
		setIsEditing(false);
	};

	if (isLoading) {
		return (
			<Card className="mb-6">
				<CardContent className="p-6">
					<div className="animate-pulse">Loading prompt...</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="mb-6">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">Base Prompt Configuration</CardTitle>
					<div className="flex gap-2">
						{!isEditing ? (
							<Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
								<Edit3 className="h-4 w-4 mr-1" />
								Edit Prompt
							</Button>
						) : (
							<>
								<Button variant="outline" size="sm" onClick={handleCancel}>
									Cancel
								</Button>
								<Button size="sm" onClick={handleSave} disabled={isSaving}>
									<Save className="h-4 w-4 mr-1" />
									{isSaving ? "Saving..." : "Save Prompt"}
								</Button>
							</>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<Textarea
						value={editingPrompt}
						onChange={(e) => setEditingPrompt(e.target.value)}
						rows={12}
						className="font-mono text-sm"
						placeholder="Enter your custom base prompt..."
					/>
				) : (
					<div className="bg-gray-50 p-4 rounded-lg">
						<pre className="text-sm whitespace-pre-wrap text-gray-700">
							{currentPrompt}
						</pre>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
