import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { Label } from "@/components/ui/form/Label";
import { useRetroactiveQuestEvaluation } from "@/hooks/admin/useRetroactiveQuestEvaluation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const QuestMaintenanceSection: React.FC = () => {
	const [questId, setQuestId] = useState("");
	const [questPreview, setQuestPreview] = useState<{
		title: string;
		description: string;
		eligibleUsers: number;
		alreadyCompleted: number;
	} | null>(null);
	const [isChecking, setIsChecking] = useState(false);

	const { evaluateSpecificQuest, isEvaluating } = useRetroactiveQuestEvaluation();

	const handlePreviewQuest = async () => {
		if (!questId.trim()) {
			toast.error("Please enter a quest ID");
			return;
		}

		setIsChecking(true);
		try {
			// Get quest details
			const { data: quest, error: questError } = await supabase
				.from("sidequests")
				.select("title, description")
				.eq("id", questId)
				.single();

			if (questError) {
				toast.error("Quest not found");
				return;
			}

			// Get quest conditions directly from the table
			const { data: conditions, error: conditionsError } = await supabase
				.from("quest_conditions")
				.select("condition_type, operator, target_value")
				.eq("sidequest_id", questId);

			if (conditionsError) {
				console.error("Error fetching quest conditions:", conditionsError);
			}

			let eligibleUsers = 0;
			let alreadyCompleted = 0;

			// Count users who already have this quest completed
			const { count: completedCount, error: completedError } = await supabase
				.from("user_sidequests")
				.select("*", { count: "exact", head: true })
				.eq("sidequest_id", questId)
				.eq("state", "COMPLETED");

			if (!completedError) {
				alreadyCompleted = completedCount || 0;
			}

			// For simplicity, estimate eligible users based on grey points >= 5000
			// This is a basic implementation - you can enhance it based on actual conditions
			const { count: eligibleCount, error: eligibleError } = await supabase
				.from("profiles")
				.select("*", { count: "exact", head: true })
				.gte("grey_points", 5000);

			if (!eligibleError) {
				eligibleUsers = eligibleCount || 0;
			}

			setQuestPreview({
				title: quest.title,
				description: quest.description,
				eligibleUsers,
				alreadyCompleted,
			});
		} catch (error) {
			console.error("Error previewing quest:", error);
			toast.error("Error previewing quest");
		} finally {
			setIsChecking(false);
		}
	};

	const handleExecuteRetroactive = async () => {
		if (!questId.trim()) {
			toast.error("Please enter a quest ID");
			return;
		}

		try {
			await evaluateSpecificQuest(questId);
			toast.success("Retroactive quest evaluation completed successfully!");
			setQuestPreview(null);
			setQuestId("");
		} catch (error) {
			console.error("Error executing retroactive evaluation:", error);
			toast.error("Failed to execute retroactive evaluation");
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Quest Maintenance</CardTitle>
				<CardDescription>Retroactively evaluate quests for existing users</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="quest-id">Quest ID</Label>
						<Input
							id="quest-id"
							value={questId}
							onChange={(e) => setQuestId(e.target.value)}
							placeholder="Enter quest UUID"
						/>
					</div>

					<Button
						onClick={handlePreviewQuest}
						disabled={isChecking || !questId.trim()}
						className="w-full"
					>
						{isChecking ? "Checking..." : "Preview Quest Impact"}
					</Button>

					{questPreview && (
						<div className="p-4 border rounded-lg bg-muted/50 space-y-3">
							<div>
								<h4 className="font-semibold">{questPreview.title}</h4>
								<p className="text-sm text-muted-foreground">
									{questPreview.description}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-medium">Eligible Users:</span>
									<div className="text-2xl font-bold text-green-600">
										{questPreview.eligibleUsers}
									</div>
								</div>
								<div>
									<span className="font-medium">Already Completed:</span>
									<div className="text-2xl font-bold text-blue-600">
										{questPreview.alreadyCompleted}
									</div>
								</div>
							</div>

							<Button
								onClick={handleExecuteRetroactive}
								disabled={isEvaluating}
								variant="default"
								className="w-full"
							>
								{isEvaluating ? "Executing..." : "Execute Retroactive Evaluation"}
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default QuestMaintenanceSection;
