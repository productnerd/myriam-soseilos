import React from "react";
import { Label } from "@/components/ui/form/Label";
import { Input } from "@/components/ui/form/Input";
import { UseFormRegister } from "react-hook-form";
import { ActivityFormData } from "@/types/activity";

interface ImageUploadFieldProps {
	register: UseFormRegister<ActivityFormData>;
	error?: string;
	showValidationErrors: boolean;
}

export const ImageUploadField = ({
	register,
	error,
	showValidationErrors,
}: ImageUploadFieldProps) => {
	return (
		<div className="space-y-2">
			<Label>Image URLs *</Label>
			<p className="text-sm text-muted-foreground">Enter image URLs for this activity</p>
			<Input
				type="text"
				{...register("image_urls", {
					required: "Image URLs are required for this activity type",
				})}
				placeholder="Enter image URLs (comma separated)"
			/>
			{showValidationErrors && error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
};
