import React, { useRef, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import { Textarea } from "@/components/ui/form/Textarea";
import { useActivityRating } from "@/hooks/activity/useActivityRating";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUserContext } from "@/contexts/UserContext";

interface ActivityRatingProps {
	activityId: string;
	flowType: "topic" | "review" | "initial" | "level";
}

const ActivityRating: React.FC<ActivityRatingProps> = ({ activityId, flowType }) => {
	const { user } = useUserContext();

	const {
		ratingStatus,
		comment,
		selectedRating,
		handleComment,
		submitRating,
		selectRating,
		resetState,
	} = useActivityRating(user!.id);

	const commentInputRef = useRef<HTMLTextAreaElement>(null);

	// Focus the comment input when a rating is selected - moved before conditional return
	useEffect(() => {
		if (selectedRating !== null && commentInputRef.current) {
			commentInputRef.current.focus();
		}
	}, [selectedRating]);

	// Don't render during initial assessments or level tests
	// Also don't render if user isn't a contributor
	if (flowType === "initial" || flowType === "level" || !user!.tags?.includes("CONTRIBUTOR")) {
		return null;
	}

	const handleRatingSelect = (isPositive: boolean) => {
		selectRating(isPositive);
	};

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();

		if (selectedRating === null) return;

		await submitRating(activityId, selectedRating, comment);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	// Determine button colors based on selection and submission state
	const getThumbsUpClasses = () => {
		if (ratingStatus === "success" && selectedRating === true) {
			return "text-green-500"; // Keep green after successful submission
		}
		return cn(
			"transition-colors",
			selectedRating === true
				? "text-green-500"
				: "text-stone-600/50 dark:text-stone-500/40 hover:text-green-500/70"
		);
	};

	const getThumbsDownClasses = () => {
		if (ratingStatus === "success" && selectedRating === false) {
			return "text-red-500"; // Keep red after successful submission
		}
		return cn(
			"transition-colors",
			selectedRating === false
				? "text-red-500"
				: "text-stone-600/50 dark:text-stone-500/40 hover:text-red-500/70"
		);
	};

	return (
		<div className="mt-2">
			<div className="flex items-center justify-end">
				<div className="flex space-x-2">
					<motion.button
						whileTap={{ scale: 0.95 }}
						onClick={() => handleRatingSelect(true)}
						className={getThumbsUpClasses()}
						aria-label="Thumbs up"
						disabled={ratingStatus === "submitting" || ratingStatus === "success"}
					>
						<ThumbsUp size={18} />
					</motion.button>

					<motion.button
						whileTap={{ scale: 0.95 }}
						onClick={() => handleRatingSelect(false)}
						className={getThumbsDownClasses()}
						aria-label="Thumbs down"
						disabled={ratingStatus === "submitting" || ratingStatus === "success"}
					>
						<ThumbsDown size={18} />
					</motion.button>
				</div>
			</div>

			{selectedRating !== null && ratingStatus !== "success" && (
				<motion.form
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					className="mt-2"
					onSubmit={handleSubmit}
				>
					<div className="space-y-2">
						<Textarea
							ref={commentInputRef}
							placeholder="Report inaccuracy, refute, add source, clarify, add context, share link to learn more etc"
							value={comment}
							onChange={(e) => handleComment(e.target.value)}
							className="min-h-[120px] w-full text-sm"
							maxLength={500}
							onKeyDown={handleKeyPress}
							disabled={ratingStatus === "submitting"}
						/>
						<div className="flex justify-between items-center text-xs">
							<span className="text-muted-foreground">{comment.length}/500</span>
							<Button
								type="submit"
								size="sm"
								variant="ghost"
								className="h-8"
								disabled={ratingStatus === "submitting"}
							>
								<Send size={14} className="mr-1" />
								{ratingStatus === "submitting" ? "Sending..." : "Submit"}
							</Button>
						</div>
					</div>
				</motion.form>
			)}

			{ratingStatus === "success" && (
				<div className="mt-2 text-sm text-muted-foreground text-right">
					Thanks for your feedback!
				</div>
			)}
		</div>
	);
};

export default ActivityRating;
