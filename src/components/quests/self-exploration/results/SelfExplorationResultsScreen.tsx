import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/layout/Card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { SelfExplorationQuest, SelfExplorationResult } from "@/types/self-exploration";
import { supabase } from "@/integrations/supabase/client";
import { useSelfExplorationResults } from "@/hooks/quests/useSelfExplorationResults";
import { toast } from "sonner";
import { formatCompletionDate, formatCompletionDateTime } from "@/utils/date/completionDateUtils";
import SelfExplorationResultsHeader from "@/components/quests/self-exploration/results/SelfExplorationResultsHeader";
import SelfExplorationResultsContent from "@/components/quests/self-exploration/results/SelfExplorationResultsContent";
import SelfExplorationResultsActions from "@/components/quests/self-exploration/results/SelfExplorationResultsActions";
import SelfExplorationResultsLoading from "@/components/quests/self-exploration/results/SelfExplorationResultsLoading";
import SelfExplorationResultsNotAvailable from "@/components/quests/self-exploration/results/SelfExplorationResultsNotAvailable";
import { useUserContext } from "@/contexts/UserContext";

interface SelfExplorationResultsScreenProps {
	quest: SelfExplorationQuest;
	result: SelfExplorationResult | null;
	onRetake: () => void;
	onClose: () => void;
	canRetake: boolean;
}

const SelfExplorationResultsScreen: React.FC<SelfExplorationResultsScreenProps> = ({
	quest,
	result: propResult,
	onRetake,
	onClose,
	canRetake,
}) => {
	const [isRegenerating, setIsRegenerating] = useState(false);
	const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
	const { user } = useUserContext();

	// Use the hook to fetch fresh data
	const { data: results, isLoading, error } = useSelfExplorationResults(user!.id, quest.id);

	// Convert database results to proper type format
	const convertedResults = results
		? results.map((result) => ({
				...result,
				responses_data: result.responses_data as Record<string, any>,
		  }))
		: [];

	// Use fresh results if available, otherwise use prop result as fallback
	const resultsToDisplay =
		convertedResults.length > 0 ? convertedResults : propResult ? [propResult] : [];
	const hasMultipleResults = resultsToDisplay.length > 1;

	// Set default selected result to the latest one (first in array) if not already set
	const currentSelectedId =
		selectedResultId || (resultsToDisplay.length > 0 ? resultsToDisplay[0].id : null);
	const selectedResult =
		resultsToDisplay.find((r) => r.id === currentSelectedId) || resultsToDisplay[0] || null;

	console.log("🎯 SelfExplorationResultsScreen state:", {
		questId: quest.id,
		hasPropResult: !!propResult,
		allResultsCount: results?.length || 0,
		resultsCount: resultsToDisplay.length,
		hasMultipleResults,
		selectedResultId: currentSelectedId,
		hasSelectedResult: !!selectedResult,
		isFetchingResults: isLoading,
	});

	const handleRefresh = async () => {
		console.log("🔄 SelfExplorationResultsScreen.handleRefresh called");
		if (!selectedResult?.responses_data) {
			console.error("❌ No responses data found to regenerate report");
			toast.error("No responses data found to regenerate report");
			return;
		}

		setIsRegenerating(true);
		try {
			console.log("🔄 Starting refresh process...");

			console.log("📝 Calling generate-self-exploration-report function with:", {
				questId: quest.id,
				userId: user!.id,
				responsesCount: Object.keys(selectedResult.responses_data).length,
				customPrompt: quest.custom_prompt ? "Present" : "None",
			});

			// Call the edge function to regenerate the report
			const { data, error } = await supabase.functions.invoke(
				"generate-self-exploration-report",
				{
					body: {
						questId: quest.id,
						userId: user!.id,
						responses: selectedResult.responses_data,
						customPrompt: quest.custom_prompt,
					},
				}
			);

			console.log("📝 Edge function response:", {
				data,
				error,
			});

			if (error) {
				console.error("❌ Edge function error:", error);
				throw error;
			}

			console.log("✅ Edge function completed successfully");

			// Refetch the results to show updated content
			// The useSelfExplorationResults hook will automatically refetch if the user.id changes
			// or if the quest.id changes, but explicitly calling refetch here ensures it happens.
			// await refetch();
			toast.success("Report refreshed successfully!");
		} catch (error) {
			console.error("❌ Failed to refresh report:", error);
			toast.error("Failed to refresh report. Please try again.");
		} finally {
			setIsRegenerating(false);
		}
	};

	// Show loading state while fetching results
	if (isLoading && resultsToDisplay.length === 0) {
		return <SelfExplorationResultsLoading quest={quest} onClose={onClose} />;
	}

	// Show "not available" state if no results after loading
	if (resultsToDisplay.length === 0) {
		return (
			<SelfExplorationResultsNotAvailable
				quest={quest}
				canRetake={canRetake}
				onRefresh={() => {
					// The useSelfExplorationResults hook will refetch if user.id changes
					// or if quest.id changes. No need to call refetch() here directly.
				}}
				onRetake={onRetake}
				onClose={onClose}
			/>
		);
	}

	return (
		<div className="w-full max-w-2xl mx-auto space-y-6">
			<SelfExplorationResultsHeader quest={quest} />

			<Card>
				<CardContent className="p-0">
					{/* Historical Results Selector */}
					{hasMultipleResults && (
						<div className="p-4 border-b">
							<div className="space-y-2">
								<label className="text-sm font-medium text-muted-foreground">
									View Historical Reports ({resultsToDisplay.length} total)
								</label>
								<Select
									value={currentSelectedId || ""}
									onValueChange={(value) => setSelectedResultId(value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a report to view" />
									</SelectTrigger>
									<SelectContent>
										{resultsToDisplay.map((result, index) => (
											<SelectItem key={result.id} value={result.id}>
												<div className="flex items-center justify-between w-full">
													<span>
														{index === 0
															? "Latest Report"
															: `Report ${index + 1}`}
													</span>
													<span className="text-xs text-muted-foreground ml-2">
														{formatCompletionDate(result.created_at)}
													</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					)}

					{selectedResult && <SelfExplorationResultsContent result={selectedResult} />}

					<SelfExplorationResultsActions
						hasAiResponse={!!selectedResult?.ai_response}
						isRegenerating={isRegenerating}
						canRetake={canRetake}
						onRefresh={handleRefresh}
						onRetake={onRetake}
						onClose={onClose}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export default SelfExplorationResultsScreen;
