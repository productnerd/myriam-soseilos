import React from "react";
import PageTransition from "@/components/ui/PageTransition";

interface ProfileErrorProps {
	errorMessage: string;
}

const ProfileError: React.FC<ProfileErrorProps> = ({ errorMessage }) => {
	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] p-6 flex flex-col justify-center items-center">
				<div className="text-center mb-4">
					<p className="text-destructive mb-2">Error loading profile</p>
					<p className="text-muted-foreground text-sm">{errorMessage}</p>
				</div>
				<button
					onClick={() => window.location.reload()}
					className="px-4 py-2 bg-primary text-white rounded-md"
				>
					Retry
				</button>
			</div>
		</PageTransition>
	);
};

export default ProfileError;
