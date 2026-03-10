import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Textarea } from "@/components/ui/form/Textarea";
import { Input } from "@/components/ui/form/Input";
import { Label } from "@/components/ui/form/Label";
import { Checkbox } from "@/components/ui/form/Checkbox";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

// Input validation schema
const applicationSchema = z.object({
	feedback: z
		.string()
		.min(50, "Please provide at least 50 characters of feedback")
		.max(2000, "Feedback must be less than 2000 characters"),
	publicLinks: z.string().max(500, "Public links must be less than 500 characters").optional(),
	isAccreditedExpert: z.boolean(),
});

const ContributorApplicationForm: React.FC = () => {
	const { user } = useUserContext();
	const [feedback, setFeedback] = useState<string>("");
	const [publicLinks, setPublicLinks] = useState<string>("");
	const [isAccreditedExpert, setIsAccreditedExpert] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const sanitizeInput = (input: string): string => {
		// Basic sanitization - remove potentially harmful content
		return input.trim().replace(/[<>]/g, "");
	};

	const validateForm = () => {
		try {
			applicationSchema.parse({
				feedback: feedback.trim(),
				publicLinks: publicLinks.trim(),
				isAccreditedExpert,
			});
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Record<string, string> = {};
				error.errors.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0] as string] = err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fix the form errors before submitting");
			return;
		}

		setIsSubmitting(true);

		try {
			const sanitizedFeedback = sanitizeInput(feedback);
			const sanitizedPublicLinks = sanitizeInput(publicLinks);

			const { error } = await supabase.from("contributor_applications").insert({
				user_id: user!.id,
				feedback: sanitizedFeedback,
				public_links: sanitizedPublicLinks || null,
				is_accredited_expert: isAccreditedExpert,
			});

			if (error) {
				console.error("Error submitting application:", error);
				toast.error("Failed to submit application. Please try again.");
				return;
			}

			toast.success(
				"Application submitted successfully! We will review it and get back to you."
			);

			// Reset form
			setFeedback("");
			setPublicLinks("");
			setIsAccreditedExpert(false);
			setErrors({});
		} catch (error) {
			console.error("Error submitting application:", error);
			toast.error("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Apply to Become a Contributor</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="feedback">Why do you want to become a contributor? *</Label>
						<Textarea
							id="feedback"
							value={feedback}
							onChange={(e) => setFeedback(e.target.value)}
							placeholder="Tell us about your motivation, experience, and how you plan to contribute..."
							className="min-h-[120px]"
							maxLength={2000}
							required
						/>
						<div className="flex justify-between text-sm text-gray-500">
							<span>{feedback.length}/2000 characters</span>
							{errors.feedback && (
								<span className="text-red-500">{errors.feedback}</span>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="publicLinks">Public Links (Optional)</Label>
						<Input
							id="publicLinks"
							value={publicLinks}
							onChange={(e) => setPublicLinks(e.target.value)}
							placeholder="LinkedIn, portfolio, blog, etc."
							maxLength={500}
						/>
						<div className="flex justify-between text-sm text-gray-500">
							<span>Professional profiles, portfolios, or relevant links</span>
							{errors.publicLinks && (
								<span className="text-red-500">{errors.publicLinks}</span>
							)}
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							id="accredited"
							checked={isAccreditedExpert}
							onCheckedChange={(checked) => setIsAccreditedExpert(checked as boolean)}
						/>
						<Label htmlFor="accredited" className="text-sm">
							I am an accredited expert in a relevant field
						</Label>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || !feedback.trim()}
					>
						{isSubmitting ? "Submitting..." : "Submit Application"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default ContributorApplicationForm;
