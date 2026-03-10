import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { Label } from "@/components/ui/form/Label";
// import { ActivitySubmission } from "@/types/activity";

interface SubmissionTypeFieldProps {
	value: string;
	onChange: (value: string) => void;
}

const typeOptions = [
	{ value: "multiple_choice", label: "Multiple Choice" },
	{ value: "true_false", label: "True/False" },
	{ value: "text_input", label: "Text Input" },
	{ value: "sorting", label: "Sorting" },
	{ value: "poll", label: "Poll" },
	{ value: "eduntainment", label: "Eduntainment" },
	{ value: "myth_or_reality", label: "Myth or Reality" },
	{ value: "image_multiple_choice", label: "Image Multiple Choice" },
];

export const SubmissionTypeField: React.FC<SubmissionTypeFieldProps> = ({ value, onChange }) => {
	return (
		<div>
			<Label htmlFor="type">Type</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger>
					<SelectValue placeholder="Select an activity type" />
				</SelectTrigger>
				<SelectContent>
					{typeOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
