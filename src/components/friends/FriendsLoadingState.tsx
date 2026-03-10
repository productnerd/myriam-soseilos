import React from "react";
import { Loader2 } from "lucide-react";

const FriendsLoadingState: React.FC = () => {
	return (
		<div className="text-center py-8">
			<div className="flex items-center justify-center">
				<Loader2 className="h-5 w-5 animate-spin mr-2" />
				<p className="text-gray-500">Loading friends...</p>
			</div>
		</div>
	);
};

export default FriendsLoadingState;
