import React, { useState } from "react";
import { Label } from "@/components/ui/form/Label";
import { Textarea } from "@/components/ui/form/Textarea";
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { ActivityFormData } from "@/types/activity";
import { Button } from "@/components/ui/interactive/Button";
import { Plus, Minus } from "lucide-react";

interface ExplanationFieldProps {
	register: UseFormRegister<ActivityFormData>;
	isHidden?: boolean;
	setValue?: UseFormSetValue<ActivityFormData>;
	getValues?: UseFormGetValues<ActivityFormData>;
	options?: string[] | null;
}

export const ExplanationField = ({
	register,
	isHidden = false,
	setValue,
	getValues,
	options = [],
}: ExplanationFieldProps) => {
	const [useSeparateExplanations, setUseSeparateExplanations] = useState(false);

	// Toggle between single and separate explanations
	const handleToggleExplanations = () => {
		setUseSeparateExplanations((prev) => !prev);
	};

	if (isHidden) return null;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Label>Explanation</Label>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleToggleExplanations}
				>
					{useSeparateExplanations ? (
						<>
							<Minus className="h-4 w-4 mr-2" />
							Use Single Explanation
						</>
					) : (
						<>
							<Plus className="h-4 w-4 mr-2" />
							Add Per-Option Explanations
						</>
					)}
				</Button>
			</div>

			{!useSeparateExplanations ? (
				// Single explanation for all options
				<Textarea
					{...register("explanation")}
					placeholder="Enter an explanation for the correct answer"
				/>
			) : (
				// Separate explanations for each option
				<div className="space-y-4">
					<Textarea
						{...register("explanation")}
						placeholder="Default explanation (shown if no specific explanation matches)"
					/>

					{options && options.length > 0 && (
						<div className="space-y-4 mt-4 border-t pt-4">
							<Label>Option-specific explanations</Label>
							{options.map((option, index) => (
								<div key={index} className="space-y-2">
									<Label className="text-sm text-muted-foreground">
										{option}
									</Label>
									<Textarea
										// Using a custom name for this; will be processed in the form submission
										{...register(`options.${index}.explanation` as any)}
										placeholder={`Explanation for "${option}"`}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
