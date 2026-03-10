import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/data/Badge";
import { Button } from "@/components/ui/interactive/Button";
import { Check, X, MoonStar } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/data/Table";
import { ActivitySubmission } from "@/types/activity";

export const PastSubmissionsTab = () => {
	const { user } = useUserContext();

	const [selectedSubmission, setSelectedSubmission] = useState<ActivitySubmission | null>(null);
	const {
		data: submissions,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["pastSubmissions", user!.id],
		queryFn: async () => {
			try {
				const { data, error } = await supabase
					.from("new_activity_submissions")
					.select("*")
					.eq("user_id", user!.id)
					.order("created_at", { ascending: false });

				if (error) {
					throw error;
				}

				console.log("Fetched user submissions:", data);
				return data as ActivitySubmission[];
			} catch (error) {
				console.error("Error fetching activity submissions:", error);
				throw error;
			}
		},
		enabled: !!user!.id, // Only run when user is authenticated
	});

	const pendingCount = submissions.filter((s) => s.status === "pending").length;
	const approvedCount = submissions.filter((s) => s.status === "approved").length;
	const rejectedCount = submissions.filter((s) => s.status === "rejected").length;

	const getStatusBadge = (status: string, darkPointsAwarded?: number) => {
		switch (status) {
			case "pending":
				return (
					<Badge variant="outline" className="bg-yellow-100 text-yellow-800">
						Pending
					</Badge>
				);
			case "approved":
				return (
					<div className="flex flex-col items-start gap-1">
						<Badge variant="outline" className="bg-green-100 text-green-800">
							Approved
						</Badge>
						<span className="text-xs flex items-center gap-1 text-muted-foreground">
							<span>+{darkPointsAwarded || 1}</span>
							<MoonStar className="h-3 w-3" />
						</span>
					</div>
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

	if (isLoading) {
		return <div className="text-center py-8">Loading submissions...</div>;
	}

	if (error) {
		console.error("Error loading submissions:", error);
		return (
			<div className="text-center py-8 text-red-500">
				Error loading submissions: {(error as any).message || "Unknown error"}
			</div>
		);
	}

	if (submissions.length === 0) {
		return (
			<div className="text-center py-12">
				<h3 className="text-lg font-medium mb-2">No submissions yet</h3>
				<p className="text-muted-foreground">
					You haven't submitted any activities yet. Create your first activity to see it
					here.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap gap-4">
				<Badge variant="outline" className="text-lg px-3 py-1">
					All <span className="ml-1 font-bold">{submissions.length}</span>
				</Badge>
				<Badge
					variant="outline"
					className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1"
				>
					Pending <span className="ml-1 font-bold">{pendingCount}</span>
				</Badge>
				<Badge variant="outline" className="bg-green-100 text-green-800 text-lg px-3 py-1">
					Approved <span className="ml-1 font-bold">{approvedCount}</span>
				</Badge>
				<Badge variant="outline" className="bg-red-100 text-red-800 text-lg px-3 py-1">
					Rejected <span className="ml-1 font-bold">{rejectedCount}</span>
				</Badge>
			</div>

			{selectedSubmission ? (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h3 className="text-xl font-medium">Submission Details</h3>
						<Button variant="ghost" onClick={() => setSelectedSubmission(null)}>
							Back to List
						</Button>
					</div>

					<div className="border rounded-md p-6 space-y-4">
						<div className="flex justify-between items-center">
							<div>
								<Badge className="mb-2">{selectedSubmission.type}</Badge>
								<div className="flex items-center gap-3">
									<span className="text-sm text-muted-foreground">
										Submitted:{" "}
										{new Date(
											selectedSubmission.created_at
										).toLocaleDateString()}
									</span>
									{getStatusBadge(
										selectedSubmission.status,
										selectedSubmission.dark_points_awarded
									)}
								</div>
							</div>
							{selectedSubmission.status === "pending" && (
								<Badge
									variant="outline"
									className="bg-yellow-100 text-yellow-800 flex items-center gap-1"
								>
									<span>Awaiting Review</span>
								</Badge>
							)}
							{selectedSubmission.status === "approved" && (
								<Badge
									variant="outline"
									className="bg-green-100 text-green-800 flex items-center gap-1"
								>
									<Check className="w-3 h-3" />
									<span>Approved</span>
								</Badge>
							)}
							{selectedSubmission.status === "rejected" && (
								<Badge
									variant="outline"
									className="bg-red-100 text-red-800 flex items-center gap-1"
								>
									<X className="w-3 h-3" />
									<span>Rejected</span>
								</Badge>
							)}
						</div>

						<div className="space-y-4 mt-4">
							<div>
								<h4 className="font-medium mb-2">Question</h4>
								<div className="bg-muted p-3 rounded-md">
									{selectedSubmission.main_text}
								</div>
							</div>

							<div>
								<h4 className="font-medium mb-2">Correct Answer</h4>
								<div className="bg-muted p-3 rounded-md">
									{selectedSubmission.correct_answer}
								</div>
							</div>

							{selectedSubmission.admin_comment && (
								<div>
									<h4 className="font-medium mb-2">Admin Comment</h4>
									<div className="bg-muted p-3 rounded-md">
										{selectedSubmission.admin_comment}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="border rounded-md">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Type</TableHead>
								<TableHead>Question</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Submission Date</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{submissions.map((submission) => (
								<TableRow key={submission.id}>
									<TableCell>
										<Badge>{submission.type}</Badge>
									</TableCell>
									<TableCell className="max-w-xs truncate">
										{submission.main_text}
									</TableCell>
									<TableCell>
										{getStatusBadge(
											submission.status,
											submission.dark_points_awarded
										)}
									</TableCell>
									<TableCell>
										{new Date(submission.created_at).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											onClick={() => setSelectedSubmission(submission)}
										>
											View
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
};
