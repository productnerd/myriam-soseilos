import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { RefreshCw } from "lucide-react";
import { SelfExplorationQuest } from "@/types/self-exploration";
import SelfExplorationResultsHeader from "./SelfExplorationResultsHeader";

interface SelfExplorationResultsNotAvailableProps {
	quest: SelfExplorationQuest;
	canRetake: boolean;
	onRefresh: () => void;
	onRetake: () => void;
	onClose: () => void;
}

const SelfExplorationResultsNotAvailable: React.FC<SelfExplorationResultsNotAvailableProps> = ({
	quest,
	canRetake,
	onRefresh,
	onRetake,
	onClose,
}) => {
	return (
		<div className="w-full max-w-2xl mx-auto space-y-6">
			<SelfExplorationResultsHeader quest={quest} />

			<Card>
				<CardHeader>
					<CardTitle>Results Not Available</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground mb-4">
						Your results are still being generated or are not available yet.
					</p>
					<div className="flex gap-2">
						<Button variant="outline" onClick={onRefresh}>
							<RefreshCw className="h-4 w-4 mr-2" />
							Refresh
						</Button>
						{canRetake && (
							<Button variant="outline" onClick={onRetake}>
								<RefreshCw className="h-4 w-4 mr-2" />
								Retake
							</Button>
						)}
						<Button variant="outline" onClick={onClose}>
							Close
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SelfExplorationResultsNotAvailable;
