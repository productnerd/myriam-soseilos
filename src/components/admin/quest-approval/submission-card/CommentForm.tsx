import React from "react";
import { Textarea } from "@/components/ui/form/Textarea";
import { Button } from "@/components/ui/interactive/Button";

interface CommentFormProps {
	adminComment: string;
	setAdminComment: (value: string) => void;
	onCancel: () => void;
	onSubmit: () => void;
	isApproving: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
	adminComment,
	setAdminComment,
	onCancel,
	onSubmit,
	isApproving,
}) => {
	return (
		<>
			<div className="mt-3">
				<Textarea
					placeholder="Add a comment (optional)..."
					value={adminComment}
					onChange={(e) => setAdminComment(e.target.value)}
					className="min-h-[100px]"
				/>
			</div>
			<div className="mt-4 flex justify-end gap-2">
				<Button variant="ghost" size="sm" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					variant={isApproving ? "default" : "destructive"}
					size="sm"
					onClick={onSubmit}
				>
					{isApproving ? "Approve" : "Reject"}
				</Button>
			</div>
		</>
	);
};

export default CommentForm;
