import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/feedback/Alert";
import { Button } from "@/components/ui/interactive/Button";

interface EmptyStateMessageProps {
	selectedSidequest: string | null;
	onRunDiagnostics?: () => void;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
	selectedSidequest,
	onRunDiagnostics,
}) => {
	const message = selectedSidequest
		? "No submissions found for this quest"
		: "Select a quest to view submissions";

	return (
		<div className="flex flex-col items-center justify-center h-64 space-y-4 p-8">
			<AlertCircle className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">{message}</h3>

			<Alert className="mt-4">
				<AlertDescription>
					{selectedSidequest && (
						<p>
							The selected quest appears to have no submissions. Either all
							submissions have been processed, or there may be a connection issue with
							the database.
						</p>
					)}
					{!selectedSidequest && (
						<p>
							Select a quest from the list on the left to view its submissions. If you
							don't see any quests, there may be no submissions in the system yet.
						</p>
					)}
				</AlertDescription>
			</Alert>

			{onRunDiagnostics && (
				<Button onClick={onRunDiagnostics} variant="outline">
					Run Diagnostics
				</Button>
			)}
		</div>
	);
};

export default EmptyStateMessage;
