import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Loader2, Send } from "lucide-react";

interface ActionButtonsProps {
	isCalculating: boolean;
	isSending: boolean;
	recipientCount: number | null;
	onCalculate: () => void;
	onSend: () => void;
	disabled: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
	isCalculating,
	isSending,
	recipientCount,
	onCalculate,
	onSend,
	disabled,
}) => {
	return (
		<div className="flex justify-between items-center">
			<div>
				{recipientCount !== null && (
					<p className="text-sm">
						<span className="font-semibold">{recipientCount}</span> recipients match
						your criteria
					</p>
				)}
			</div>

			<div className="flex gap-2">
				<Button
					variant="outline"
					onClick={onCalculate}
					disabled={isCalculating || isSending}
				>
					{isCalculating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
					Calculate Recipients
				</Button>

				<Button onClick={onSend} disabled={isSending || disabled}>
					{isSending ? (
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
					) : (
						<Send className="h-4 w-4 mr-2" />
					)}
					Send Message
				</Button>
			</div>
		</div>
	);
};

export default ActionButtons;
