import React from "react";
import { Button } from "@/components/ui/interactive/Button";

interface FriendsErrorStateProps {
	onRetry: () => void;
}

const FriendsErrorState: React.FC<FriendsErrorStateProps> = ({ onRetry }) => {
	return (
		<div className="text-center py-8">
			<p className="text-red-500">Failed to load friends</p>
			<Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
				Try Again
			</Button>
		</div>
	);
};

export default FriendsErrorState;
