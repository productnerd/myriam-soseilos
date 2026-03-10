import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/form/Textarea";
import { Button } from "@/components/ui/interactive/Button";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FeedbackFormData {
	comment: string;
}

export const FeedbackTab = () => {
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
		} catch (error) {
			console.error("Error submitting feedback:", error);
			toast.error("Failed to submit feedback");
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
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
		</div>
	);
};
