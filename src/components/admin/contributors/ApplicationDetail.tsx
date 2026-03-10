import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Textarea } from "@/components/ui/form/Textarea";
import { Badge } from "@/components/ui/data/Badge";
import { ContributorApplication } from "@/types/contributor";

interface ApplicationDetailProps {
	application: ContributorApplication;
	adminNotes: string;
	onNotesChange: (notes: string) => void;
	onApprove: () => void;
	onReject: () => void;
	isPending: boolean;
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
	application,
	adminNotes,
	onNotesChange,
	onApprove,
	onReject,
	isPending,
}) => {
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge variant="outline" className="bg-yellow-100 text-yellow-800">
						Pending
					</Badge>
				);
			case "approved":
				return (
					<Badge variant="outline" className="bg-green-100 text-green-800">
						Approved
					</Badge>
				);
			case "rejected":
				return (
					<Badge variant="outline" className="bg-red-100 text-red-800">
						Rejected
					</Badge>
				);
			default:
				return <Badge variant="outline">Unknown</Badge>;
		}
	};

	return (
		<div className="border rounded-md p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h3 className="text-xl font-medium">
					Application from {application.profiles?.name || "Unknown"}
				</h3>
				{getStatusBadge(application.status)}
			</div>

			<div className="grid grid-cols-2 gap-4 text-sm">
				<div>
					<span className="font-medium">Email:</span>{" "}
					{application.profiles?.email || "No email"}
				</div>
				<div>
					<span className="font-medium">Applied on:</span>{" "}
					{new Date(application.created_at).toLocaleDateString()}
				</div>
				<div>
					<span className="font-medium">User for:</span> {application.days_as_user} days
				</div>
				<div>
					<span className="font-medium">Grey Points:</span> {application.grey_points}
				</div>
				<div>
					<span className="font-medium">Activities rated:</span>{" "}
					{application.activities_rated_count}
				</div>
				<div>
					<span className="font-medium">Accredited expert:</span>{" "}
					{application.is_accredited_expert ? "Yes" : "No"}
				</div>
			</div>

			{application.public_links && (
				<div>
					<h4 className="font-medium mb-2">Public Links</h4>
					<div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
						{application.public_links}
					</div>
				</div>
			)}

			{application.feedback && (
				<div>
					<h4 className="font-medium mb-2">Feedback</h4>
					<div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
						{application.feedback}
					</div>
				</div>
			)}

			{application.status === "pending" && (
				<>
					<div>
						<label className="block font-medium mb-2">Admin Notes</label>
						<Textarea
							value={adminNotes}
							onChange={(e) => onNotesChange(e.target.value)}
							placeholder="Add notes about this application"
							className="h-24"
						/>
					</div>

					<div className="flex gap-4">
						<Button
							variant="default"
							className="bg-green-600 hover:bg-green-700"
							onClick={onApprove}
							disabled={isPending}
						>
							Approve
						</Button>
						<Button variant="destructive" onClick={onReject} disabled={isPending}>
							Reject
						</Button>
					</div>
				</>
			)}

			{application.status !== "pending" && application.admin_notes && (
				<div>
					<h4 className="font-medium mb-2">Admin Notes</h4>
					<div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
						{application.admin_notes}
					</div>
				</div>
			)}
		</div>
	);
};
