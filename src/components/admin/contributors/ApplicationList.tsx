import React from "react";
import { Badge } from "@/components/ui/data/Badge";
import { ContributorApplication } from "@/types/contributor";

interface ApplicationListProps {
	applications: ContributorApplication[];
	selectedId: string | null;
	onSelectApplication: (app: ContributorApplication) => void;
}
export const ApplicationList: React.FC<ApplicationListProps> = ({
	applications,
	selectedId,
	onSelectApplication,
}) => {
	// Filter pending applications
	const pendingApplications = applications?.filter((app) => app.status === "pending") || [];
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
		<div className="border rounded-md p-4 max-h-[80vh] overflow-auto">
			{applications && applications.length > 0 ? (
				<>
					{pendingApplications.length > 0 && (
						<div className="mb-6">
							<h4 className="font-medium text-sm mb-2">
								Pending ({pendingApplications.length})
							</h4>
							<div className="space-y-3">
								{pendingApplications.map((app) => (
									<div
										key={app.id}
										className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
											selectedId === app.id ? "bg-muted border-primary" : ""
										}`}
										onClick={() => onSelectApplication(app)}
									>
										<div className="font-medium">
											{app.profiles?.name || "Unknown"}
										</div>
										<div className="text-xs text-muted-foreground">
											{new Date(app.created_at).toLocaleDateString()}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<div>
						<h4 className="font-medium text-sm mb-2">Past Applications</h4>
						<div className="space-y-3">
							{applications
								.filter((app) => app.status !== "pending")
								.slice(0, 10)
								.map((app) => (
									<div
										key={app.id}
										className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
											selectedId === app.id ? "bg-muted border-primary" : ""
										}`}
										onClick={() => onSelectApplication(app)}
									>
										<div className="flex justify-between items-center">
											<span className="font-medium">
												{app.profiles?.name || "Unknown"}
											</span>
											{getStatusBadge(app.status)}
										</div>
										<div className="text-xs text-muted-foreground">
											{new Date(app.created_at).toLocaleDateString()}
										</div>
									</div>
								))}
						</div>
					</div>
				</>
			) : (
				<div className="text-center p-4 text-muted-foreground">No applications found</div>
			)}
		</div>
	);
};
