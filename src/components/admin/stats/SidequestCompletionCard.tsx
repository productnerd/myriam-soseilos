import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { SidequestCompletion } from "@/hooks/admin/statistics/types";
import { Progress } from "@/components/ui/data/Progress";

interface SidequestCompletionCardProps {
	sidequests: SidequestCompletion[];
}

export default function SidequestCompletionCard({ sidequests }: SidequestCompletionCardProps) {
	// Get top sidequests (already sorted by completion rate in the hook)
	const topSidequests = sidequests.slice(0, 10);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sidequest Completion</CardTitle>
				<CardDescription>Completion rates for popular sidequests</CardDescription>
			</CardHeader>
			<CardContent>
				{sidequests.length === 0 ? (
					<div className="flex items-center justify-center h-48">
						<p className="text-muted-foreground italic">No sidequest data available</p>
					</div>
				) : (
					<div className="space-y-4">
						{topSidequests.map((quest) => (
							<div key={quest.sidequest_id} className="space-y-1">
								<div className="flex justify-between items-center">
									<div className="font-medium truncate" title={quest.title}>
										{quest.title.length > 30
											? `${quest.title.substring(0, 30)}...`
											: quest.title}
									</div>
									<div className="text-sm font-semibold">
										{quest.completion_rate}%
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Progress value={quest.completion_rate} className="h-2" />
									<span className="text-xs text-muted-foreground whitespace-nowrap">
										{quest.completed_count}/{quest.user_count}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
