import React from "react";
import { ActivityImportResult } from "@/hooks/admin/activity-import";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/feedback/Alert";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/layout/Collapsible";
import { Button } from "@/components/ui/interactive/Button";

interface ActivityImportStatusProps {
	status: ActivityImportResult;
	error: string | null;
}

export const ActivityImportStatus: React.FC<ActivityImportStatusProps> = ({ status, error }) => {
	const [errorsOpen, setErrorsOpen] = React.useState(true);

	// If there's an error message but no activities processed yet
	if (error && status.totalActivities === 0) {
		return (
			<Alert variant="destructive" className="mt-4">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Validation Error</AlertTitle>
				<AlertDescription className="space-y-2">
					<p>{error}</p>
					{error.includes("Validation failed:") && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setErrorsOpen(!errorsOpen)}
							className="mt-2"
						>
							{errorsOpen ? "Hide Details" : "Show Details"}
						</Button>
					)}
				</AlertDescription>
			</Alert>
		);
	}

	if (status.totalActivities === 0) {
		return null;
	}

	if (status.success) {
		return (
			<Alert className="mt-4 border-green-500 bg-green-50 text-green-800">
				<CheckCircle className="h-4 w-4" />
				<AlertTitle>Import Successful</AlertTitle>
				<AlertDescription>
					Successfully imported {status.successCount} activities.
				</AlertDescription>
			</Alert>
		);
	}

	if (status.failureCount > 0) {
		return (
			<Alert variant="destructive" className="mt-4">
				<XCircle className="h-4 w-4" />
				<AlertTitle>Import Failed</AlertTitle>
				<AlertDescription>
					{status.successCount > 0
						? `Partially imported ${status.successCount} out of ${status.totalActivities} activities.`
						: "Failed to import any activities."}

					{status.errors.length > 0 && (
						<Collapsible
							open={errorsOpen}
							onOpenChange={setErrorsOpen}
							className="mt-2"
						>
							<CollapsibleTrigger asChild>
								<Button variant="outline" size="sm">
									{errorsOpen ? "Hide Errors" : "Show Errors"}
								</Button>
							</CollapsibleTrigger>
							<CollapsibleContent className="mt-2">
								<ul className="list-disc pl-5 space-y-1 text-sm max-h-[300px] overflow-y-auto">
									{status.errors.map((err, i) => (
										<li key={i}>{err}</li>
									))}
								</ul>
							</CollapsibleContent>
						</Collapsible>
					)}
				</AlertDescription>
			</Alert>
		);
	}

	// For ongoing imports with no errors yet
	if (status.totalActivities > 0 && status.successCount > 0 && status.failureCount === 0) {
		return (
			<Alert className="mt-4">
				<Info className="h-4 w-4" />
				<AlertTitle>Import In Progress</AlertTitle>
				<AlertDescription>
					Processed {status.successCount} of {status.totalActivities} activities...
				</AlertDescription>
			</Alert>
		);
	}

	return null;
};
