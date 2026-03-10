import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Loader2 } from "lucide-react";
import { SelfExplorationQuest } from "@/types/self-exploration";
import SelfExplorationResultsHeader from "./SelfExplorationResultsHeader";

interface SelfExplorationResultsLoadingProps {
	quest: SelfExplorationQuest;
	onClose: () => void;
}

const SelfExplorationResultsLoading: React.FC<SelfExplorationResultsLoadingProps> = ({
	quest,
	onClose,
}) => {
	return (
		<div className="w-full max-w-2xl mx-auto space-y-6">
			<SelfExplorationResultsHeader quest={quest} />

			<Card>
				<CardHeader>
					<CardTitle>Loading Results...</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 mb-4">
						<Loader2 className="h-4 w-4 animate-spin" />
						<p className="text-muted-foreground">
							Fetching your personalized results...
						</p>
					</div>
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default SelfExplorationResultsLoading;
