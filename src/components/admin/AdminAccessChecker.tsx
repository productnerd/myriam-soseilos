import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { useUserContext } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminAccessCheckerProps {
	children: React.ReactNode;
}

const AdminAccessChecker: React.FC<AdminAccessCheckerProps> = ({ children }) => {
	const { user } = useUserContext();
	const navigate = useNavigate();
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

	// Check if user is admin
	useEffect(() => {
		const checkAdminStatus = async () => {
			// Check if user is admin using the user.isAdmin value
			if (user!.isAdmin) {
				setIsAuthorized(true);
				setCheckingAuth(false);
				return;
			}

			// Fallback to checking the `user_roles` table
			try {
				const { data, error } = await supabase
					.from("user_roles")
					.select("role")
					.eq("user_id", user!.id)
					.eq("role", "admin")
					.maybeSingle();

				if (error) {
					console.error("Error checking admin status:", error);
					toast.error("Failed to verify admin status");
					setIsAuthorized(false);
				} else {
					setIsAuthorized(!!data);
				}
			} catch (error) {
				console.error("Error in admin check:", error);
				setIsAuthorized(false);
			} finally {
				setCheckingAuth(false);
			}
		};

		checkAdminStatus();
	}, [user, navigate]);

	// If still checking auth or not admin, show loading or redirect
	if (checkingAuth) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-pulse text-center">
					<p className="text-gray-500">Checking permissions...</p>
				</div>
			</div>
		);
	}

	if (!isAuthorized) {
		return (
			<div className="container mx-auto py-8 px-4">
				<h1 className="text-3xl font-bold mb-8">Access Denied</h1>
				<p className="text-muted-foreground mb-8">
					You don't have permission to access this page. This page is only available to
					administrators.
				</p>
				<Button onClick={() => navigate("/learn")}>Return to Learn</Button>
			</div>
		);
	}

	return <>{children}</>;
};

export default AdminAccessChecker;
