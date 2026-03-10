import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Textarea } from "@/components/ui/form/Textarea";
import { Input } from "@/components/ui/form/Input";
import { Upload, AlertTriangle } from "lucide-react";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { sanitizeText, validateFileUpload, RateLimiter } from "@/utils/validation/security";
import { Alert, AlertDescription } from "@/components/ui/feedback/Alert";

interface QuestSubmissionFormProps {
	questId: string;
	userQuestId?: string;
	onSubmissionSuccess?: () => void;
	requireImage?: boolean;
	requireDescription?: boolean;
}

// Validation schema
const submissionSchema = z.object({
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(2000, "Description must be less than 2000 characters"),
	comment: z.string().max(500, "Comment must be less than 500 characters").optional(),
});

// Rate limiter: max 3 submissions per hour
const submissionRateLimiter = new RateLimiter(3, 60 * 60 * 1000);

const QuestSubmissionForm: React.FC<QuestSubmissionFormProps> = ({
	questId,
	userQuestId,
	onSubmissionSuccess,
	requireImage = false,
	requireDescription = true,
}) => {
	const { user } = useUserContext();
	const [description, setDescription] = useState<string>("");
	const [comment, setComment] = useState<string>("");
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};
		try {
			submissionSchema.parse({
				description: description.trim(),
				comment: comment.trim(),
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				error.errors.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0] as string] = err.message;
					}
				});
			}
		}

		// Additional validation
		if (requireImage && !selectedImage) {
			newErrors.image = "Image is required for this quest";
		}
		if (requireDescription && !description.trim()) {
			newErrors.description = "Description is required for this quest";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const validation = validateFileUpload(file);
		if (!validation.isValid) {
			toast.error(validation.error);
			return;
		}
		setSelectedImage(file);
		const reader = new FileReader();
		reader.onload = (e) => {
			setImagePreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);

		// Clear any previous image errors
		if (errors.image) {
			setErrors((prev) => ({
				...prev,
				image: "",
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Rate limiting check
		if (!submissionRateLimiter.isAllowed(user!.id)) {
			toast.error("Too many submissions. Please try again in an hour.");
			return;
		}
		if (!validateForm()) {
			toast.error("Please fix the form errors before submitting");
			return;
		}
		setIsSubmitting(true);
		try {
			let imageUrl = null;

			// Upload image if provided
			if (selectedImage) {
				const fileExt = selectedImage.name.split(".").pop();
				const fileName = `quest-${questId}-${user!.id}-${Date.now()}.${fileExt}`;
				const { data: uploadData, error: uploadError } = await supabase.storage
					.from("quest-submissions")
					.upload(fileName, selectedImage);
				if (uploadError) {
					console.error("Error uploading image:", uploadError);
					toast.error("Failed to upload image. Please try again.");
					return;
				}
				const { data: urlData } = supabase.storage
					.from("quest-submissions")
					.getPublicUrl(uploadData.path);
				imageUrl = urlData.publicUrl;
			}

			// Sanitize inputs
			const sanitizedDescription = sanitizeText(description);
			const sanitizedComment = sanitizeText(comment);

			// Submit quest
			const { error: submitError } = await supabase.from("quest_submissions").insert({
				user_id: user!.id,
				sidequest_id: questId,
				user_sidequest_id: userQuestId,
				user_description: sanitizedDescription,
				user_comment: sanitizedComment || null,
				image: imageUrl,
				status: "pending",
			});
			if (submitError) {
				console.error("Error submitting quest:", submitError);
				toast.error("Failed to submit quest. Please try again.");
				return;
			}
			toast.success("Quest submitted successfully! We will review it soon.");

			// Reset form
			setDescription("");
			setComment("");
			setSelectedImage(null);
			setImagePreview(null);
			setErrors({});
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			if (onSubmissionSuccess) {
				onSubmissionSuccess();
			}
		} catch (error) {
			console.error("Error submitting quest:", error);
			toast.error("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full">
			<div className="flex items-center gap-2 mb-4">
				<h3 className="text-lg font-semibold">Submit Quest</h3>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				{requireDescription && (
					<div className="space-y-2">
						<label className="text-sm font-medium">
							Description {requireDescription && "*"}
						</label>
						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe what you did to complete this quest..."
							className="min-h-[100px]"
							maxLength={2000}
							required={requireDescription}
						/>
						<div className="flex justify-between text-sm text-gray-500">
							<span>{description.length}/2000 characters</span>
							{errors.description && (
								<span className="text-red-500">{errors.description}</span>
							)}
						</div>
					</div>
				)}

				<div className="space-y-2">
					<label className="text-sm font-medium">Image {requireImage && "*"}</label>
					<div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
						{imagePreview ? (
							<div className="space-y-2 text-center">
								<img
									src={imagePreview}
									alt="Preview"
									className="max-w-full h-48 object-cover rounded-lg mx-auto"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setSelectedImage(null);
										setImagePreview(null);
										if (fileInputRef.current) {
											fileInputRef.current.value = "";
										}
									}}
								>
									Remove Image
								</Button>
							</div>
						) : (
							<div className="text-center">
								<div className="mt-2 flex justify-center">
									<Button
										type="button"
										variant="outline"
										className="w-full"
										onClick={() => fileInputRef.current?.click()}
									>
										<Upload className="w-4 h-4 mr-2" />
										Choose Image
									</Button>
								</div>
								<p className="text-xs text-gray-500 mt-1">
									Max 5MB. JPEG, PNG, WebP, or GIF
								</p>
							</div>
						)}
						{errors.image && (
							<p className="text-red-500 text-sm mt-1">{errors.image}</p>
						)}
					</div>
					<Input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleImageSelect}
						className="hidden"
					/>
				</div>

				<div className="space-y-2">
					<div>
						<label className="text-sm font-medium">Additional Comments</label>
						<div className="text-xs text-gray-500">Optional</div>
					</div>
					<Textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Any additional thoughts or reflections..."
						className="min-h-[80px]"
						maxLength={500}
					/>
					<div className="flex justify-between text-sm text-gray-500">
						<span>{comment.length}/500 characters</span>
						{errors.comment && <span className="text-red-500">{errors.comment}</span>}
					</div>
				</div>

				<Alert className="mb-4">
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription>
						Please ensure your submission follows our community guidelines.
						Inappropriate content will result in account penalties.
					</AlertDescription>
				</Alert>

				<div className="pt-4">
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? "Submitting..." : "Submit Quest"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default QuestSubmissionForm;
