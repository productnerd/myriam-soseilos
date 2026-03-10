import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useSundayCheck } from "@/hooks/activity/useSundayCheck";

const Index = () => {
	const { user } = useUserContext();

	const { isSunday } = useSundayCheck();
	const isMounted = useRef<boolean>(true);
	const [hasAccessCode, setHasAccessCode] = useState<boolean | null>(null);
	const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

	// If user is not authenticated, redirect to login
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// Check user access and onboarding status
	useEffect(() => {
		isMounted.current = true;

		const checkUserStatus = async () => {
			try {
				// Check if user has access granted
				const { data: profileData, error: profileError } = await supabase
					.from("profiles")
					.select("access_granted, onboarding_completed")
					.eq("id", user.id)
					.maybeSingle();

				if (profileError) {
					console.error("Error checking user status:", profileError);
					return;
				}

				if (!profileData) {
					console.error("No profile data found for user:", user.id);
					return;
				}

				setHasAccessCode(Boolean(profileData.access_granted));
				setOnboardingCompleted(profileData.onboarding_completed !== false);
			} catch (error) {
				console.error("Error checking user status:", error);
			}
		};

		checkUserStatus();

		return () => {
			isMounted.current = false;
		};
	}, [user.id]);

	// Show loading state while checking user status
	if (hasAccessCode === null || onboardingCompleted === null) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-pulse text-center">
					<p className="text-gray-500">Loading...</p>
				</div>
			</div>
		);
	}

	// If it's Sunday, redirect to Sunday page
	if (isSunday) {
		return <Navigate to="/sunday" replace />;
	}

	// If user doesn't have access code, redirect to access code page
	if (!hasAccessCode) {
		return <Navigate to="/access-code" replace />;
	}

	// If user hasn't completed onboarding, redirect to onboarding
	if (!onboardingCompleted) {
		return <Navigate to="/onboarding" replace />;
	}

	// If we've confirmed the user is logged in with access and completed onboarding, go to learn
	return <Navigate to="/learn" replace />;
};

export default Index;
