import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export interface ContributorDashboardProps {
	feedbackOpen?: boolean;
	setFeedbackOpen?: (open: boolean) => void;
}

export const ContributorDashboard: React.FC<ContributorDashboardProps> = ({
	feedbackOpen,
	setFeedbackOpen,
}) => {
	const navigate = useNavigate();

	return (
		<div className="max-w-2xl mx-auto space-y-8">
			<div className="flex flex-col gap-2">
				<Button
					variant="ghost"
					onClick={() => navigate("/profile")}
					className="flex items-center gap-2 px-0 self-start"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Profile
				</Button>
				<h1 className="text-3xl font-bold">Contributors</h1>
			</div>
		</div>
	);
};
