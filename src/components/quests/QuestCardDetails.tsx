import React from "react";
import { CheckCircle, Clock, XCircle, Info } from "lucide-react";
import { UserSidequest } from "@/types/user";
import { Alert, AlertDescription } from "@/components/ui/feedback/Alert";
interface QuestCardDetailsProps {
	quest: UserSidequest;
	isCompleted: boolean;
	isExpired: boolean;
	isPending?: boolean;
	isRejected?: boolean;
	rejectionReason?: string;
	isInReviewTab?: boolean;
}
const QuestCardDetails: React.FC<QuestCardDetailsProps> = ({
	quest,
	isCompleted,
	isExpired,
	isPending = false,
	isRejected = false,
	rejectionReason = "",
	isInReviewTab = false,
}) => {
	// Check if this quest doesn't require any submission
	const requiresNoSubmission =
		!quest.sidequest?.require_image && !quest.sidequest?.require_description;
	return (
		<div className="mt-2">
			{/* Hide instructions when in review tab */}
			{!isInReviewTab && (
				<>
					<div className="p-4 rounded-md bg-muted/30 border border-border/50 font-handwritten text-handwritten">
						{quest.sidequest.instructions ||
							quest.sidequest.description ||
							"No instructions available for this quest."}
					</div>
				</>
			)}

			{requiresNoSubmission && !isCompleted && !isExpired && (
				<Alert className="mt-4 bg-blue-600/10 border border-blue-600/20">
					<div className="flex items-center">
						<Info className="h-4 w-4 text-blue-600 mr-2" />
						<AlertDescription className="text-xs text-blue-600">
							This quest doesn't require a submission and will be automatically marked
							as complete by the system.
						</AlertDescription>
					</div>
				</Alert>
			)}

			{isCompleted && (
				<div className="mt-4 p-3 bg-green-600/10 rounded-md border border-green-600/20">
					<p className="text-xs flex items-center text-green-600">
						<CheckCircle className="h-4 w-4 mr-2" />
						You've completed this quest!
					</p>
				</div>
			)}

			{isPending && (
				<div className="mt-4 p-3 bg-amber-600/10 rounded-md border border-amber-600/20">
					<p className="text-xs text-amber-600">
						Your submission is being reviewed by an admin. You'll be notified when it's
						approved or rejected. If rejected, don't worry, you will be able to resubmit
						as many times as you like.
					</p>
				</div>
			)}

			{isRejected && (
				<div className="mt-4 p-3 bg-red-600/10 rounded-md border border-red-600/20">
					<p className="text-xs flex items-center text-red-600 mb-1">
						<XCircle className="h-4 w-4 mr-2" />
						Your submission was rejected
					</p>
					{rejectionReason && (
						<p className="text-xs text-red-600/80 mt-1 pl-6">
							Reason: {rejectionReason}
						</p>
					)}
				</div>
			)}

			{isExpired && (
				<div className="mt-4 p-3 bg-destructive/10 rounded-md border border-destructive/20">
					<p className="text-xs flex items-center text-destructive">
						<Clock className="h-4 w-4 mr-2" />
						This quest has expired
					</p>
				</div>
			)}
		</div>
	);
};
export default QuestCardDetails;
