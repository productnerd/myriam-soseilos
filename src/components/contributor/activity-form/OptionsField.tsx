import React from "react";
import { Label } from "@/components/ui/form/Label";
import { Input } from "@/components/ui/form/Input";
import { Button } from "@/components/ui/interactive/Button";
import { Trash2, Plus } from "lucide-react";

interface OptionsFieldProps {
	options: string[];
	onAddOption: () => void;
	onRemoveOption: (index: number) => void;
	onUpdateOption: (index: number, value: string) => void;
	isRequired: boolean;
	showValidationErrors: boolean;
}

export const OptionsField = ({
	options,
	onAddOption,
	onRemoveOption,
	onUpdateOption,
	isRequired,
	showValidationErrors,
}: OptionsFieldProps) => {
	return (
		<div className="space-y-4">
			<Label>Options {isRequired ? "*" : ""}</Label>
			{options.map((option, i) => (
				<div key={i} className="flex gap-2">
					<Input
						value={option}
						onChange={(e) => onUpdateOption(i, e.target.value)}
						placeholder={`Option ${i + 1}`}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => onRemoveOption(i)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			))}
			{options.length < 6 && (
				<Button type="button" variant="outline" onClick={onAddOption} className="w-full">
					<Plus className="h-4 w-4 mr-2" />
					Add Option
				</Button>
			)}
			{showValidationErrors && isRequired && options.length === 0 && (
				<p className="text-sm text-destructive">At least one option is required</p>
			)}
		</div>
	);
};
