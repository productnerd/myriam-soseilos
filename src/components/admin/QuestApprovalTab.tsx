import React, { useEffect, useState } from "react";
import { useQuestSubmissions } from "@/hooks/admin/quest-submissions";
import LoadingView from "./quest-approval/LoadingView";
import EmptyView from "./quest-approval/EmptyView";
import ErrorView from "./quest-approval/ErrorView";
import SidebarQuestList from "./quest-approval/SidebarQuestList";
import SubmissionDetails from "./quest-approval/submission-details/SubmissionDetails";
import { checkDatabaseSchemaHealth } from "@/utils/system/diagnostics";
import { toast } from "sonner";
import { Button } from "@/components/ui/interactive/Button";

// QuestApprovalTab component - main container for quest submissions
const QuestApprovalTab: React.FC = () => {
	const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
	const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
	const [retryCount, setRetryCount] = useState(0);

	const {
		submissionGroups,
		selectedSubmissions,
		isLoading,
		error,
		selectedSidequest,
		setSelectedSidequest,
		approveSubmission,
		rejectSubmission,
	} = useQuestSubmissions();

	// Set initial selected quest if none is selected
	useEffect(() => {
		if (submissionGroups && submissionGroups.length > 0 && !selectedSidequest) {
			setSelectedSidequest(submissionGroups[0].sidequest.id);
		}
	}, [submissionGroups, selectedSidequest, setSelectedSidequest]);

	const handleRunDiagnostics = async () => {
		setIsRunningDiagnostics(true);
		try {
			const results = await checkDatabaseSchemaHealth();
			setDiagnosticResults(results);
			console.log("Diagnostic results:", results);
			toast.success("Diagnostics completed");
		} catch (error) {
			console.error("Diagnostic error:", error);
			toast.error("Error running diagnostics");
			setDiagnosticResults({
				error: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setIsRunningDiagnostics(false);
		}
	};

	const handleRetry = () => {
		setRetryCount((prev) => prev + 1);
		toast.info("Retrying data fetch...");
		window.location.reload();
	};

	// Render loading state
	if (isLoading) {
		return <LoadingView />;
	}

	// Render error state
	if (error) {
		return (
			<ErrorView
				error={error}
				onRetry={handleRetry}
				onRunDiagnostics={handleRunDiagnostics}
				isRunningDiagnostics={isRunningDiagnostics}
				diagnosticResults={diagnosticResults}
			/>
		);
	}

	// Render empty state
	if (!submissionGroups || submissionGroups.length === 0) {
		return (
			<div>
				<EmptyView />
				<div className="mt-4 flex justify-center">
					<Button
						variant="outline"
						onClick={handleRunDiagnostics}
						disabled={isRunningDiagnostics}
					>
						{isRunningDiagnostics
							? "Running Diagnostics..."
							: "Run Database Diagnostics"}
					</Button>
				</div>
				{diagnosticResults && (
					<div className="mt-4 p-4 bg-muted rounded-lg text-sm">
						<pre className="text-xs overflow-auto max-h-40">
							{JSON.stringify(diagnosticResults, null, 2)}
						</pre>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{/* Left sidebar for quest selection */}
			<div className="md:col-span-1">
				<SidebarQuestList
					submissionGroups={submissionGroups}
					selectedSidequest={selectedSidequest}
					setSelectedSidequest={setSelectedSidequest}
				/>
				<div className="mt-4">
					<Button
						variant="outline"
						size="sm"
						onClick={handleRunDiagnostics}
						disabled={isRunningDiagnostics}
						className="text-xs"
					>
						{isRunningDiagnostics
							? "Running Diagnostics..."
							: "Run Database Diagnostics"}
					</Button>
				</div>
			</div>

			{/* Right panel for submission details */}
			<div className="md:col-span-2">
				<SubmissionDetails
					selectedSidequest={selectedSidequest}
					submissions={selectedSubmissions}
					onApprove={(submissionId, adminComment) => {
						approveSubmission({ submissionId, adminComment });
					}}
					onReject={(submissionId, adminComment) => {
						rejectSubmission({ submissionId, adminComment });
					}}
				/>
			</div>

			{diagnosticResults && (
				<div className="col-span-3 p-4 bg-muted rounded-lg text-sm">
					<h3 className="font-bold mb-2">Diagnostic Results</h3>
					<pre className="text-xs overflow-auto max-h-40">
						{JSON.stringify(diagnosticResults, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
};

export default QuestApprovalTab;
