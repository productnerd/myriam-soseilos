import React from "react";
import { ActivitySubmission } from "@/types/activity";
import { Label } from "@/components/ui/form/Label";
import { Input } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
import { SubmissionTypeField } from "../fields/SubmissionTypeField";
import { SubmissionOptionsField } from "../fields/SubmissionOptionsField";
import { getStringOptions } from "../utils/submissionValidation";

interface SubmissionFormProps {
	submission: ActivitySubmission;
	onSubmissionChange: (updated: ActivitySubmission) => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
	submission,
	onSubmissionChange,
}) => {
	const updateOptions = (optionIndex: number, value: string) => {
		const stringOptions = getStringOptions(submission.options);
		if (stringOptions.length === 0) return;

		const newOptions = [...stringOptions];
		newOptions[optionIndex] = value;

		onSubmissionChange({
			...submission,
			options: newOptions,
		});
	};

	const addOption = () => {
		const currentOptions = getStringOptions(submission.options);
		onSubmissionChange({
			...submission,
			options: [...currentOptions, ""],
		});
	};

	const removeOption = (optionIndex: number) => {
		const stringOptions = getStringOptions(submission.options);
		if (stringOptions.length === 0) return;

		const newOptions = [...stringOptions];
		newOptions.splice(optionIndex, 1);

		onSubmissionChange({
			...submission,
			options: newOptions,
		});
	};

	return (
		<div className="space-y-4">
			<SubmissionTypeField
				value={submission.type}
				onChange={(value) =>
					onSubmissionChange({
						...submission,
						type: value,
					})
				}
			/>

			<div>
				<Label htmlFor="question">Question</Label>
				<Textarea
					id="question"
					value={submission.main_text}
					onChange={(e) =>
						onSubmissionChange({
							...submission,
							main_text: e.target.value,
						})
					}
					placeholder="Question text"
					className="min-h-[100px]"
				/>
			</div>

			{["multiple_choice", "image_multiple_choice"].includes(submission.type) && (
				<SubmissionOptionsField
					options={getStringOptions(submission.options)}
					onUpdate={updateOptions}
					onAdd={addOption}
					onRemove={removeOption}
				/>
			)}

			<div>
				<Label htmlFor="correctAnswer">Correct Answer</Label>
				<Input
					id="correctAnswer"
					value={submission.correct_answer}
					onChange={(e) =>
						onSubmissionChange({
							...submission,
							correct_answer: e.target.value,
						})
					}
					placeholder="Correct answer"
				/>
			</div>

			<div>
				<Label htmlFor="explanation">Explanation</Label>
				<Textarea
					id="explanation"
					value={submission.explanation || ""}
					onChange={(e) =>
						onSubmissionChange({
							...submission,
							explanation: e.target.value,
						})
					}
					placeholder="Explanation (shown after answering)"
					className="min-h-[100px]"
				/>
			</div>
		</div>
	);
};
