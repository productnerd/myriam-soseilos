import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/form/Input";
import { Label } from "@/components/ui/form/Label";
import { Link } from "lucide-react";

interface SourceLinkFieldProps {
	register: UseFormRegister<any>;
	error?: string;
}

export const SourceLinkField: React.FC<SourceLinkFieldProps> = ({ register, error }) => {
	return (
		<div className="space-y-2">
			<div className="flex items-center space-x-2">
				<Link size={16} />
				<Label htmlFor="source_link">Source Link (optional)</Label>
			</div>
			<Input
				id="source_link"
				placeholder="https://example.com/reference"
				{...register("source_link")}
				className={error ? "border-destructive" : ""}
			/>
			{error && <p className="text-sm text-destructive">{error}</p>}
			<p className="text-sm text-muted-foreground">
				Add a link to the source material or reference for this activity (optional)
			</p>
		</div>
	);
};
