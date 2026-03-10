import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContributorApplication } from "@/types/contributor";
import { ApplicationList } from "./contributors/ApplicationList";
import { ApplicationDetail } from "./contributors/ApplicationDetail";

const ContributorApplicationsTab: React.FC = () => {
	const queryClient = useQueryClient();
	const [selectedApplication, setSelectedApplication] = useState<ContributorApplication | null>(
		null
	);
	const [adminNotes, setAdminNotes] = useState("");

	const {
		data: applications = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["contributor-applications"],
		queryFn: async () => {
			console.log("Fetching contributor applications...");
			try {
				// First get all contributor applications
				const { data: appData, error: appError } = await supabase
					.from("contributor_applications")
					.select("*");

				if (appError) {
					console.error("Error fetching applications:", appError);
					throw appError;
				}

				// Then get profile data separately to avoid join issues
				const result = await Promise.all(
					(appData || []).map(async (app) => {
						// Get user profile data
						const { data: profileData } = await supabase
							.from("profiles")
							.select("name, email, created_at, grey_points")
							.eq("id", app.user_id)
							.single();

						// Calculate days as user
						const daysAsUser = profileData?.created_at
							? Math.floor(
									(new Date().getTime() -
										new Date(profileData.created_at).getTime()) /
										(1000 * 60 * 60 * 24)
							  )
							: 0;

						return {
							...app,
							profiles: profileData,
							grey_points: profileData?.grey_points || 0,
							days_as_user: daysAsUser,
						} as ContributorApplication;
					})
				);

				console.log("Applications data:", result);
				return result;
			} catch (err) {
				console.error("Error fetching contributor applications:", err);
				throw err;
			}
		},
	});

	useEffect(() => {
		if (applications && applications.length > 0 && !selectedApplication) {
			const pendingApp =
				applications.find((app) => app.status === "pending") || applications[0];
			setSelectedApplication(pendingApp);
			setAdminNotes(pendingApp.admin_notes || "");
		}
	}, [applications, selectedApplication]);

	const approveApplication = useMutation({
		mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
			const { error } = await supabase
				.from("contributor_applications")
				.update({
					status: "approved",
					admin_notes: notes,
					reviewed_at: new Date().toISOString(),
				})
				.eq("id", id);

			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Application approved");
			queryClient.invalidateQueries({
				queryKey: ["contributor-applications"],
			});
			queryClient.invalidateQueries({
				queryKey: ["pending-contributors-count"],
			});
			setSelectedApplication(null);
		},
	});

	const rejectApplication = useMutation({
		mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
			const { error } = await supabase
				.from("contributor_applications")
				.update({
					status: "rejected",
					admin_notes: notes,
					reviewed_at: new Date().toISOString(),
				})
				.eq("id", id);

			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Application rejected");
			queryClient.invalidateQueries({
				queryKey: ["contributor-applications"],
			});
			queryClient.invalidateQueries({
				queryKey: ["pending-contributors-count"],
			});
			setSelectedApplication(null);
		},
	});

	const handleViewApplication = (application: ContributorApplication) => {
		setSelectedApplication(application);
		setAdminNotes(application.admin_notes || "");
	};

	if (isLoading) {
		return <div className="p-6 text-center">Loading applications...</div>;
	}

	if (error) {
		return (
			<div className="p-6 text-center text-red-500">
				Error loading applications: {String(error)}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-1">
					<ApplicationList
						applications={applications}
						selectedId={selectedApplication?.id || null}
						onSelectApplication={handleViewApplication}
					/>
				</div>

				<div className="md:col-span-2">
					{selectedApplication ? (
						<ApplicationDetail
							application={selectedApplication}
							adminNotes={adminNotes}
							onNotesChange={setAdminNotes}
							onApprove={() =>
								approveApplication.mutate({
									id: selectedApplication.id,
									notes: adminNotes,
								})
							}
							onReject={() =>
								rejectApplication.mutate({
									id: selectedApplication.id,
									notes: adminNotes,
								})
							}
							isPending={approveApplication.isPending || rejectApplication.isPending}
						/>
					) : (
						<div className="flex h-full items-center justify-center border rounded-md p-6">
							<div className="text-center text-muted-foreground">
								{applications && applications.length > 0 ? (
									<p>Select an application to review</p>
								) : (
									<div className="p-8">
										<p className="text-lg font-medium mb-2">All caught up!</p>
										<p>No new contributor applications to review</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ContributorApplicationsTab;
