import React from "react";
import { Label } from "@/components/ui/form/Label";
import { Input } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
import { Button } from "@/components/ui/interactive/Button";
import { Save } from "lucide-react";

interface EditableActivityFormProps {
	question: string;
	options: string[];
	correctAnswer: string;
	explanation: string;
	needsOptions: boolean;
	isSaving: boolean;
	canSave: boolean;
	onQuestionChange: (value: string) => void;
	onOptionChange: (index: number, value: string) => void;
	onCorrectAnswerChange: (value: string) => void;
	onExplanationChange: (value: string) => void;
	onSave: () => void;
}

export const EditableActivityForm: React.FC<EditableActivityFormProps> = ({
	question,
	options,
	correctAnswer,
	explanation,
	needsOptions,
	isSaving,
	canSave,
	onQuestionChange,
	onOptionChange,
	onCorrectAnswerChange,
	onExplanationChange,
	onSave,
}) => {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label>Question</Label>
				<Textarea
					value={question}
					onChange={(e) => onQuestionChange(e.target.value)}
					rows={3}
				/>
			</div>

			{needsOptions && options.length > 0 && (
				<div className="space-y-2">
					<Label>Options</Label>
					{options.map((option, index) => (
						<Input
							key={index}
							value={option}
							onChange={(e) => onOptionChange(index, e.target.value)}
							placeholder={`Option ${index + 1}`}
						/>
					))}
				</div>
			)}

			<div className="space-y-2">
				<Label>Correct Answer</Label>
				<Input
					value={correctAnswer}
					onChange={(e) => onCorrectAnswerChange(e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label>Explanation</Label>
				<Textarea
					value={explanation}
					onChange={(e) => onExplanationChange(e.target.value)}
					rows={2}
				/>
			</div>

			<Button
				onClick={onSave}
				disabled={isSaving || !canSave}
				className="flex items-center gap-2"
			>
				<Save className="h-4 w-4" />
				{isSaving ? "Saving..." : "Save Activity"}
			</Button>
		</div>
	);
};
