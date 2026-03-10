import React from "react";
import { Loader2 } from "lucide-react";

const LoadingView: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-64">
			<Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
			<p className="text-muted-foreground">Loading quest submissions...</p>
		</div>
	);
};

export default LoadingView;
