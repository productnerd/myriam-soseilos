import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";

const ProfileAdminSection: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useUserContext();

	// Only render if user is admin
	if (!user!.isAdmin) {
		return null;
	}
	return (
		<div className="mt-8 pt-6 border-t border-border">
			<Button
				onClick={() => navigate("/admin")}
				variant="outline"
				className="w-full md:w-auto flex items-center justify-center gap-2"
			>
				<ShieldCheck className="h-4 w-4" />
				Admin Dashboard
			</Button>
		</div>
	);
};

export default ProfileAdminSection;
