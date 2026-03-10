import { useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import Layout from "@/components/layout/Layout";
import PageTransition from "@/components/ui/PageTransition";
import ContributorApplicationForm from "@/components/contributor/ContributorApplicationForm";
import { ApplicationStatus } from "@/components/contributor/ApplicationStatus";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContributorDashboard } from "@/components/contributor/dashboard/ContributorDashboard";
import { ContributorActivities } from "@/components/contributor/activities/ContributorActivities";
import { Button } from "@/components/ui/interactive/Button";

const ContributorsPage = () => {
	const { user } = useUserContext();
	const navigate = useNavigate();
	const [feedbackOpen, setFeedbackOpen] = useState(false);

	const { data: profile, isLoading: profileLoading } = useQuery({
		queryKey: ["user-profile", user!.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("grey_points")
				.eq("id", user!.id)
				.maybeSingle();

			if (error) throw error;
			return data;
		},
		enabled: !!user!.id, // Only run when user is authenticated
	});

	const { data: contributorStatus, isLoading: contributorLoading } = useQuery({
		queryKey: ["contributor-status", user!.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("user_roles")
				.select("role")
				.eq("user_id", user!.id)
				.eq("role", "contributor")
				.maybeSingle();

			if (error) throw error;
			return !!data;
		},
		enabled: !!user!.id, // Only run when user is authenticated
	});

	const { data: application, isLoading: applicationLoading } = useQuery({
		queryKey: ["contributor-application", user!.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("contributor_applications")
				.select("*")
				.eq("user_id", user!.id)
				.maybeSingle();

			if (error) throw error;
			return data;
		},
		enabled: !!user!.id, // Only run when user is authenticated
	});

	const isLoading = profileLoading || contributorLoading || applicationLoading;

	if (!isLoading && profile && (profile.grey_points || 0) < 400) {
		return (
			<Layout>
				<div className="container mx-auto py-8 px-4">
					<div className="text-center max-w-2xl mx-auto">
						<h1 className="text-2xl font-bold mb-4">Insufficient Grey Points</h1>
						<p className="mb-4">
							You need at least 400 grey points to access this page. You currently
							have {profile.grey_points || 0} points.
						</p>
						<Button onClick={() => navigate("/profile")}>Return to Profile</Button>
					</div>
				</div>
			</Layout>
		);
	}

	const renderContent = () => {
		if (isLoading) {
			return (
				<div className="animate-pulse p-6 text-center">
					Loading contributor information...
				</div>
			);
		}

		if (contributorStatus) {
			return <ContributorActivities />;
		}

		if (application) {
			return <ApplicationStatus application={application} />;
		}

		return <ContributorApplicationForm />;
	};

	return (
		<Layout>
			<PageTransition>
				<div className="container mx-auto py-8 px-4">
					<ContributorDashboard
						feedbackOpen={feedbackOpen}
						setFeedbackOpen={setFeedbackOpen}
					/>
					<div className="max-w-2xl mx-auto mt-8">{renderContent()}</div>
				</div>
			</PageTransition>
		</Layout>
	);
};

export default ContributorsPage;
