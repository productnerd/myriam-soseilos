import React from "react";
import { Label } from "@/components/ui/form/Label";
import { Textarea } from "@/components/ui/form/Textarea";
import { UseFormRegister } from "react-hook-form";
import { ActivityFormData } from "@/types/activity";

interface QuestionTextFieldProps {
	register: UseFormRegister<ActivityFormData>;
	error?: string;
	showValidationErrors?: boolean;
	isRequired?: boolean;
}

export const QuestionTextField = ({
	register,
	error,
	showValidationErrors = false,
	isRequired = true,
}: QuestionTextFieldProps) => {
	return (
		<div className="space-y-2">
			<Label>Question Text {isRequired ? "*" : ""}</Label>
			<Textarea
				{...register("main_text", {
					required: isRequired ? "Question text is required" : false,
					minLength: isRequired
						? { value: 3, message: "Question text must be at least 3 characters long" }
						: undefined,
				})}
				placeholder="Enter your question text"
				className="h-24 resize-none"
			/>
			{showValidationErrors && error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
};
