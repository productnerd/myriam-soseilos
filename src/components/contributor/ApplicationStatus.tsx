import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { Badge } from "@/components/ui/data/Badge";
import { Application } from "@/types/contributor";

interface ApplicationStatusProps {
	application: Application;
}

export const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ application }) => {
	const statusColor = {
		pending: "bg-yellow-500",
		approved: "bg-green-500",
		rejected: "bg-red-500",
	}[application.status];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Application Status</CardTitle>
				<CardDescription>Track the status of your contributor application</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<span>Status:</span>
						<Badge className={statusColor}>{application.status.toUpperCase()}</Badge>
					</div>

					{application.status === "approved" && (
						<p className="text-green-600">
							Congratulations! You are now a contributor.
						</p>
					)}

					{application.status === "pending" && (
						<p className="text-yellow-600">
							Your application is being reviewed. We'll notify you once a decision has
							been made.
						</p>
					)}

					{application.status === "rejected" && (
						<p className="text-red-600">
							Your application was not approved at this time.
						</p>
					)}

					{application.feedback && (
						<div>
							<h4 className="font-medium">Feedback:</h4>
							<p className="mt-1 text-muted-foreground">{application.feedback}</p>
						</div>
					)}

					{application.public_links && (
						<div>
							<h4 className="font-medium">Your Provided Links:</h4>
							<p className="mt-1 text-muted-foreground whitespace-pre-wrap">
								{application.public_links}
							</p>
						</div>
					)}

					<div className="text-sm text-muted-foreground mt-4">
						<p>
							Application submitted on{" "}
							{new Date(application.created_at).toLocaleDateString()}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
