import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUser } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingState from "@/components/loading/LoadingState";
import { createUserProfile } from "@/hooks/auth/useProfileCreation";

interface AccessCodeCheckerProps {
	user: AuthUser | null;
	onComplete: (hasAccessCode: boolean | null) => void;
}

const AccessCodeChecker = ({ user, onComplete }: AccessCodeCheckerProps) => {
	const [loading, setLoading] = useState(true);
	const loadingStartTime = useRef(Date.now());
	const navigate = useNavigate();
	const accessCheckTimeout = useRef<number | null>(null);

	useEffect(() => {
		const minLoadingTimer = setTimeout(() => {
			if (!loading) return;

			const elapsedTime = Date.now() - loadingStartTime.current;
			if (elapsedTime >= 3000) {
				setLoading(false);
			}
		}, 3000);

		const maxLoadingTimer = setTimeout(() => {
			if (!loading) return;
			console.log("Maximum loading time reached, forcing completion");
			setLoading(false);
		}, 5000);

		return () => {
			clearTimeout(minLoadingTimer);
			clearTimeout(maxLoadingTimer);
			if (accessCheckTimeout.current) {
				clearTimeout(accessCheckTimeout.current);
			}
		};
	}, [loading]);

	useEffect(() => {
		const checkUserAccess = async () => {
			if (!user?.id) {
				console.log("User not logged in yet, waiting...");
				onComplete(false);
				return;
			}

			console.log("Checking access for user:", user.id);

			try {
				// Try to create the profile first
				console.log("Ensuring profile exists for user:", user.id);
				await createUserProfile(user.id, user.email || "");

				// Now check access granted status
				const { data, error } = await supabase
					.from("profiles")
					.select("access_granted, onboarding_completed")
					.eq("id", user.id)
					.maybeSingle();

				if (error) {
					console.error("Error checking access:", error);
					toast.error("Failed to check your access status");
					onComplete(false);
					setLoading(false);
					return;
				}

				if (data?.access_granted) {
					console.log("User has valid access");

					const elapsedTime = Date.now() - loadingStartTime.current;
					const remainingTime = Math.max(0, 3000 - elapsedTime);

					accessCheckTimeout.current = window.setTimeout(() => {
						// Only redirect to onboarding if onboarding_completed is explicitly false
						// Otherwise assume it's completed
						if (data.onboarding_completed !== false) {
							console.log(
								"User has completed onboarding or status is not false, redirecting to learn"
							);
							navigate("/learn");
						} else {
							console.log(
								"User has not completed onboarding, redirecting to onboarding"
							);
							navigate("/onboarding");
						}
					}, remainingTime);

					onComplete(true);
				} else {
					console.log("User does not have access granted");
					onComplete(false);
					setLoading(false);
				}
			} catch (error) {
				console.error("Error checking access:", error);
				onComplete(false);
				setLoading(false);
			}
		};

		checkUserAccess();

		return () => {
			if (accessCheckTimeout.current) {
				clearTimeout(accessCheckTimeout.current);
			}
		};
	}, [user, navigate, onComplete]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			{loading && <LoadingState message="Checking your access status..." />}
		</div>
	);
};

export default AccessCodeChecker;
