// TODO: This component is not used anywhere

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/data/Table";
import { Badge } from "@/components/ui/data/Badge";
import { MoonStar } from "lucide-react";
import { ActivitySubmission } from "@/types/activity";
import { useUserContext } from "@/contexts/UserContext";

export const ContributorSubmissions: React.FC = () => {
	// TODO: If this component is planned to be used and will not be rendered from a protected route, need to have a '!user' check.
	const { user } = useUserContext();

	const [activeTab, setActiveTab] = useState<string>("pending");

	// TODO: This should go inside a hook
	const { data: submissions, isLoading } = useQuery({
		queryKey: ["activity-submissions", user.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("new_activity_submissions")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching activity submissions:", error);
				throw error;
			}

			return data as ActivitySubmission[];
		},
		enabled: !!user.id, // Only run when user is authenticated
	});

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

	const filteredSubmissions = (tab: string) => {
		if (!submissions) return [];

		if (tab === "all") return submissions;
		if (tab === "pending") return submissions.filter((s) => s.status === "pending");
		if (tab === "evaluated")
			return submissions.filter((s) => s.status === "approved" || s.status === "rejected");

		return submissions;
	};

	if (isLoading) {
		return <div className="mt-8 text-center">Loading your submissions...</div>;
	}

	if (!submissions || submissions.length === 0) {
		return <div className="mt-8 text-center">You haven't submitted any activities yet.</div>;
	}

	return (
		<div className="mt-10">
			<h2 className="text-xl font-semibold mb-4">Past Submissions</h2>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="mb-4">
					<TabsTrigger value="pending">
						Pending ({filteredSubmissions("pending").length})
					</TabsTrigger>
					<TabsTrigger value="evaluated">
						Evaluated ({filteredSubmissions("evaluated").length})
					</TabsTrigger>
					<TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
				</TabsList>

				{["all", "pending", "evaluated"].map((tab) => (
					<TabsContent key={tab} value={tab}>
						<div className="border rounded-md">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Type</TableHead>
										<TableHead>Content</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Feedback</TableHead>
										<TableHead>Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredSubmissions(tab).map((submission) => (
										<TableRow key={submission.id}>
											<TableCell>{submission.type}</TableCell>
											<TableCell className="max-w-sm truncate">
												{submission.main_text}
											</TableCell>
											<TableCell>
												{getStatusBadge(
													submission.status,
													submission.dark_points_awarded
												)}
											</TableCell>
											<TableCell>
												{submission.admin_comment ? (
													<span className="text-sm">
														{submission.admin_comment}
													</span>
												) : (
													<span className="text-muted-foreground text-sm">
														No feedback yet
													</span>
												)}
											</TableCell>
											<TableCell>
												{new Date(
													submission.created_at
												).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};
