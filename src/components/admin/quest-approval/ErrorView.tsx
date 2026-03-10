import React from "react";
import { AlertTriangle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import { Card, CardContent } from "@/components/ui/layout/Card";

interface ErrorViewProps {
	error: Error;
	onRetry: () => void;
	onRunDiagnostics: () => void;
	isRunningDiagnostics: boolean;
	diagnosticResults: any;
}

const ErrorView: React.FC<ErrorViewProps> = ({
	error,
	onRetry,
	onRunDiagnostics,
	isRunningDiagnostics,
	diagnosticResults,
}) => {
	const [expanded, setExpanded] = React.useState(false);

	return (
		<div className="flex flex-col items-center justify-center h-64 space-y-4">
			<AlertTriangle className="h-12 w-12 text-destructive" />
			<h3 className="text-lg font-semibold">Error Loading Quest Submissions</h3>
			<p className="text-muted-foreground text-center max-w-lg">
				{error.message || "An error occurred while loading quest submissions."}
			</p>

			<div className="flex space-x-4">
				<Button onClick={onRetry}>Retry</Button>
				<Button
					variant="outline"
					onClick={onRunDiagnostics}
					disabled={isRunningDiagnostics}
				>
					{isRunningDiagnostics ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Running Diagnostics...
						</>
					) : (
						"Run Database Diagnostics"
					)}
				</Button>
			</div>

			{diagnosticResults && (
				<Card className="mt-4 w-full max-w-lg">
					<CardContent className="p-4">
						<div className="flex justify-between items-center mb-2">
							<h4 className="font-semibold">Diagnostic Results</h4>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0"
								onClick={() => setExpanded(!expanded)}
							>
								{expanded ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</Button>
						</div>

						{!expanded ? (
							<div className="text-sm">
								{diagnosticResults.error && (
									<p className="text-destructive">
										Error: {diagnosticResults.error}
									</p>
								)}
								<p>
									Submissions status:{" "}
									{diagnosticResults.questSubmissionsStatus || "unknown"}
								</p>
								<p>
									Profiles status: {diagnosticResults.profilesStatus || "unknown"}
								</p>
								<p>
									Sidequests status:{" "}
									{diagnosticResults.sidequestsStatus || "unknown"}
								</p>
								<p className="text-xs text-muted-foreground mt-2">
									Click expand to see full details
								</p>
							</div>
						) : (
							<pre className="text-xs overflow-auto max-h-96 border rounded-md p-2 bg-muted/50">
								{JSON.stringify(diagnosticResults, null, 2)}
							</pre>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default ErrorView;
