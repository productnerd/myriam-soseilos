import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import PageTransition from "@/components/ui/PageTransition";
import { useToast } from "@/hooks/ui/useToast";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";

const OnboardingPage = () => {
	// Get user from global context
	const { user } = useUserContext();

	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		// If user is already onboarded, redirect to /learn (unless they're an admin)
		const checkOnboardingStatus = async () => {
			try {
				const { data, error } = await supabase
					.from("profiles")
					.select("onboarding_completed")
					.eq("id", user!.id) // Protected route ensures user is not null
					.maybeSingle();

				if (error) {
					console.error("Error checking onboarding status:", error);
					return;
				}

				// Check if user is admin by checking user roles
				const { data: roleData } = await supabase
					.from("user_roles")
					.select("role")
					.eq("user_id", user!.id)
					.eq("role", "admin")
					.maybeSingle();

				const isAdmin = roleData?.role === "admin";

				// Allow admins to access onboarding even if completed
				if (isAdmin) {
					console.log("Admin user accessing onboarding page");
					return;
				}

				// If onboarding_completed is true OR null/undefined (meaning it's not explicitly false)
				// redirect to /learn
				if (data?.onboarding_completed !== false) {
					console.log("User has already completed onboarding, redirecting to /learn");
					toast({
						title: "Welcome back!",
						description: "You've already completed onboarding.",
					});
					navigate("/learn");
				}
			} catch (err) {
				console.error("Error checking onboarding status:", err);
			}
		};

		checkOnboardingStatus();
	}, [user!.id, navigate, toast]);

	return (
		<PageTransition>
			<div className="fixed inset-0 w-full h-full">
				{/* Full screen background image */}
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{
						backgroundImage: `url('/lovable-uploads/f3db333b-8f0a-41f2-8072-47246fcc80f3.png')`,
					}}
				>
					<OnboardingFlow />
				</div>
			</div>
		</PageTransition>
	);
};

export default OnboardingPage;
