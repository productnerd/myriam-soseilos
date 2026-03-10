import React from "react";
import { Label } from "@/components/ui/form/Label";
import { Input } from "@/components/ui/form/Input";
import { UseFormRegister } from "react-hook-form";
import { ActivityFormData } from "@/types/activity";

interface EduntainmentFieldProps {
	register: UseFormRegister<ActivityFormData>;
	error?: string;
	showValidationErrors: boolean;
}

export const EduntainmentField = ({
	register,
	error,
	showValidationErrors,
}: EduntainmentFieldProps) => {
	return (
		<div className="space-y-2">
			<Label>Content URL *</Label>
			<p className="text-sm text-muted-foreground">
				Provide a URL to educational content (YouTube, Twitter/X, Instagram, or TikTok)
			</p>
			<Input
				{...register("embed_url", {
					required: "Content URL is required for educational content",
				})}
				placeholder="https://..."
			/>
			{showValidationErrors && error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
};
