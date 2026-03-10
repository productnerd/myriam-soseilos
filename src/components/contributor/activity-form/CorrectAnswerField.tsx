import React from "react";
import { Label } from "@/components/ui/form/Label";
import { Input } from "@/components/ui/form/Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { UseFormRegister } from "react-hook-form";
import { ActivityFormData } from "@/types/activity";

interface CorrectAnswerFieldProps {
	register: UseFormRegister<ActivityFormData>;
	activityType: string;
	isRequired: boolean;
	error?: string;
	value: string;
	onValueChange: (value: string) => void;
	options?: string[];
}

export const CorrectAnswerField = ({
	register,
	activityType,
	isRequired,
	error,
	value,
	onValueChange,
	options = [],
}: CorrectAnswerFieldProps) => {
	if (!isRequired) return null;

	const hasOptions = options && options.length > 0;

	const isMultipleChoice = activityType === "multiple_choice";
	const isTrueFalseOrMyth = ["myth_or_reality", "true_false"].includes(activityType);
	const isSorting = activityType === "sorting";
	const isPairMatching = activityType === "pair_matching";

	if (isTrueFalseOrMyth) {
		return (
			<div className="space-y-2">
				<Label>Correct Answer *</Label>
				<Select value={value || "default"} onValueChange={onValueChange}>
					<SelectTrigger>
						<SelectValue placeholder="Select correct answer" />
					</SelectTrigger>
					<SelectContent>
						{activityType === "myth_or_reality" ? (
							<>
								<SelectItem value="Myth">Myth</SelectItem>
								<SelectItem value="Reality">Reality</SelectItem>
							</>
						) : (
							<>
								<SelectItem value="true">True</SelectItem>
								<SelectItem value="false">False</SelectItem>
							</>
						)}
					</SelectContent>
				</Select>
				{error && <p className="text-sm text-destructive">{error}</p>}
			</div>
		);
	}

	if (isMultipleChoice && hasOptions) {
		return (
			<div className="space-y-2">
				<Label>Correct Answer *</Label>
				<Select value={value || "default"} onValueChange={onValueChange}>
					<SelectTrigger>
						<SelectValue placeholder="Select correct answer" />
					</SelectTrigger>
					<SelectContent>
						{options
							.filter((option) => option && option.trim() !== "")
							.map((option, index) => (
								<SelectItem key={index} value={option}>
									{option}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
				{error && <p className="text-sm text-destructive">{error}</p>}
			</div>
		);
	}

	if (isSorting && hasOptions) {
		return (
			<div className="space-y-2">
				<Label>Correct Answer *</Label>
				<p className="text-sm text-muted-foreground">
					The correct answer will be the order of the options as you've entered them
					(stored as JSON array).
				</p>
				<Input
					value={JSON.stringify(options.filter((opt) => opt.trim()))}
					readOnly
					className="bg-muted"
				/>
				{error && <p className="text-sm text-destructive">{error}</p>}
			</div>
		);
	}

	if (isPairMatching && hasOptions) {
		const pairs = [];
		for (let i = 0; i < options.length; i += 2) {
			if (options[i] && options[i + 1]) {
				pairs.push(`${options[i]}-${options[i + 1]}`);
			}
		}

		return (
			<div className="space-y-2">
				<Label>Correct Answer *</Label>
				<p className="text-sm text-muted-foreground">
					The correct answer will be the pairs as you've entered them (stored as JSON
					array).
				</p>
				<Input value={JSON.stringify(pairs)} readOnly className="bg-muted" />
				{error && <p className="text-sm text-destructive">{error}</p>}
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<Label>Correct Answer *</Label>
			<Input
				{...register("correct_answer", {
					required: isRequired ? "Correct answer is required" : false,
					minLength: { value: 1, message: "Correct answer cannot be empty" },
				})}
				placeholder="Enter the correct answer"
			/>
			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
};
