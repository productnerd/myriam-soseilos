import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";

interface ErrorStateProps {
	message?: string;
	onClose: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = "An error occurred", onClose }) => {
	return (
		<div className="py-10 text-center space-y-4">
			<div className="flex justify-center">
				<AlertTriangle className="h-12 w-12 text-destructive" />
			</div>
			<h3 className="text-lg font-medium">Error</h3>
			<p className="text-muted-foreground">{message}</p>
			<Button variant="outline" onClick={onClose}>
				Close
			</Button>
		</div>
	);
};

export default ErrorState;
