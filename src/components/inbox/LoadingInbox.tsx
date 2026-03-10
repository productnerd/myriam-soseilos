import React from "react";
import { Loader2 } from "lucide-react";

const LoadingInbox: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center h-[50vh]">
			<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
			<p className="text-muted-foreground">Loading messages...</p>
		</div>
	);
};

export default LoadingInbox;
