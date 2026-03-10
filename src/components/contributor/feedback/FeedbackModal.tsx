// TODO: This component is not used anywhere

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/overlay/Dialog";
import { Textarea } from "@/components/ui/form/Textarea";
import { Button } from "@/components/ui/interactive/Button";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FeedbackFormData {
	comment: string;
}

interface FeedbackModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
	// TODO: If this component is planned to be used and will not be rendered from a protected route, need to have a '!user' check.
	const { user } = useUserContext();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FeedbackFormData>();

	const onSubmit = async (data: FeedbackFormData) => {
		try {
			const { error } = await supabase.from("user_feedback").insert({
				user_id: user!.id,
				comment: data.comment,
			});

			if (error) throw error;

			toast.success("Feedback submitted successfully");
			reset();
			onClose();
		} catch (error) {
			console.error("Error submitting feedback:", error);
			toast.error("Failed to submit feedback");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Submit Feedback</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Textarea
							{...register("comment", {
								required: "Please enter your feedback",
								maxLength: {
									value: 2500,
									message: "Feedback must not exceed 500 words",
								},
							})}
							placeholder="Enter your feedback here (max 500 words)"
							className="h-32"
						/>
						{errors.comment && (
							<p className="text-sm text-destructive">{errors.comment.message}</p>
						)}
						<p className="text-xs text-muted-foreground">Maximum 500 words</p>
					</div>
					<Button type="submit" className="w-full">
						Submit Feedback
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
