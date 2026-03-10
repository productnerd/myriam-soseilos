import React from "react";
import { Label } from "@/components/ui/form/Label";
import { Textarea } from "@/components/ui/form/Textarea";

interface RejectionFormProps {
	reason: string;
	onChange: (value: string) => void;
}

export const RejectionForm: React.FC<RejectionFormProps> = ({ reason, onChange }) => {
	return (
		<div className="space-y-3">
			<Label htmlFor="rejectReason">Rejection Reason</Label>
			<Textarea
				id="rejectReason"
				value={reason}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Provide feedback on why this submission is being rejected"
				className="min-h-[100px]"
			/>
		</div>
	);
};
