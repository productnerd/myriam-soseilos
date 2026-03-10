import React from "react";
import { Textarea } from "@/components/ui/form/Textarea";
import { Label } from "@/components/ui/form/Label";

interface DescriptionFieldProps {
	initialValue: string;
	onValueChange: (value: string) => void;
	required?: boolean;
	disabled?: boolean;
	className?: string;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({
	initialValue,
	onValueChange,
	required = false,
	disabled = false,
	className = "",
}) => {
	return (
		<div className={`space-y-2 py-6 ${className}`}>
			<Label htmlFor="description" className="block text-sm font-medium">
				Description {required && <span className="text-red-500">*</span>}
			</Label>
			<Textarea
				id="description"
				placeholder="Describe what you did to complete this quest..."
				value={initialValue}
				onChange={(e) => onValueChange(e.target.value)}
				className="min-h-[100px]"
				required={required}
				disabled={disabled}
			/>
		</div>
	);
};

export default DescriptionField;
