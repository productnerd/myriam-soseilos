import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";

interface SubmissionOptionsFieldProps {
	options: string[];
	onUpdate: (index: number, value: string) => void;
	onAdd: () => void;
	onRemove: (index: number) => void;
}

export const SubmissionOptionsField: React.FC<SubmissionOptionsFieldProps> = ({
	options,
	onUpdate,
	onAdd,
	onRemove,
}) => {
	return (
		<div>
			<div className="flex items-center justify-between mb-2">
				<h4 className="font-medium">Options</h4>
				<Button type="button" onClick={onAdd} variant="outline" size="sm">
					Add Option
				</Button>
			</div>

			<div className="space-y-2">
				{options.map((option, index) => (
					<div key={index} className="flex items-center gap-2">
						<Input
							value={option}
							onChange={(e) => onUpdate(index, e.target.value)}
							placeholder={`Option ${index + 1}`}
							className="flex-1"
						/>
						<Button
							type="button"
							onClick={() => onRemove(index)}
							variant="destructive"
							size="icon"
							className="h-8 w-8"
						>
							&times;
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};
