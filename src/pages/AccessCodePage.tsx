import { useEffect } from "react";
import PageTransition from "@/components/ui/PageTransition";
import AccessCodeInput from "@/components/access-code/AccessCodeInput";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from "@/components/loading/LoadingState";

const AccessCodePage = () => {
	const navigate = useNavigate();
	const { user } = useUserContext();

	// If user is not authenticated, redirect to login
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	useEffect(() => {
		console.log("Access code page mounted, user:", user.id);

		// Check access and onboarding status
		const checkAccessAndOnboarding = async () => {
			try {
				// First, check if access is already granted
				const { data: profileData, error: profileError } = await supabase
					.from("profiles")
					.select("access_granted, onboarding_completed")
					.eq("id", user.id)
					.maybeSingle();

				if (profileError) {
					console.error("Error checking access granted:", profileError);
					return;
				}

				if (!profileData) {
					console.error("No profile data found for user:", user.id);
					return;
				}

				console.log("User access status:", profileData);

				// If access is granted
				if (profileData.access_granted) {
					// Check onboarding status
					if (profileData.onboarding_completed) {
						console.log(
							"Access granted and onboarding completed - redirecting to learn"
						);
						navigate("/learn");
					} else {
						console.log(
							"Access granted but onboarding not completed - redirecting to onboarding"
						);
						navigate("/onboarding");
					}
				}
			} catch (error) {
				console.error("Error checking access status:", error);
			}
		};

		checkAccessAndOnboarding();
	}, [navigate, user.id]);

	return (
		<PageTransition>
			<div className="container flex flex-col items-center justify-center min-h-screen py-12 mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-center">Enter your Access Code</h1>

				<div className="flex flex-col items-center space-y-6 w-full max-w-md">
					<AccessCodeInput
						user={user}
						onValidCode={() => {
							// Show toast and redirect with delay for better UX
							toast.success("Access code validated! Redirecting to onboarding...", {
								duration: 1500,
							});

							setTimeout(() => {
								console.log("Navigating to /onboarding after valid code handler");
								navigate("/onboarding");
							}, 1000);
						}}
					/>
				</div>
			</div>
		</PageTransition>
	);
};

export default AccessCodePage;
