import React from "react";
import { Textarea } from "@/components/ui/form/Textarea";

interface CommentFieldProps {
	initialValue: string;
	onValueChange: (value: string) => void;
	disabled?: boolean;
}

const CommentField: React.FC<CommentFieldProps> = ({
	initialValue,
	onValueChange,
	disabled = false,
}) => {
	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium">Additional Comments</label>
			<Textarea
				placeholder="Any additional comments..."
				value={initialValue}
				onChange={(e) => onValueChange(e.target.value)}
				className="min-h-[80px]"
				disabled={disabled}
			/>
			<p className="text-xs text-muted-foreground">
				Optional: Add any additional context about your submission
			</p>
		</div>
	);
};

export default CommentField;
