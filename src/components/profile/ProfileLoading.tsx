import React from "react";
import PageTransition from "@/components/ui/PageTransition";

const ProfileLoading: React.FC = () => {
	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] p-6 flex justify-center items-center">
				<div className="animate-pulse text-center">
					<p className="text-gray-500">Loading profile data...</p>
				</div>
			</div>
		</PageTransition>
	);
};

export default ProfileLoading;
