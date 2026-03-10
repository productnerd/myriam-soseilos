import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
	onRefresh: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh }) => {
	return (
		<div className="mt-4 flex justify-center">
			<Button variant="outline" onClick={onRefresh} className="flex items-center gap-2">
				<RefreshCw className="h-4 w-4" /> Refresh
			</Button>
		</div>
	);
};

export default RefreshButton;
