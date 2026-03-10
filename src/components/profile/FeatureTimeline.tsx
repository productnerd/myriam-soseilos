import React, { useEffect, useState } from "react";
import { Check, Lock, Sparkles, Award, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
interface FeatureTimelineProps {
	currentPoints: number;
}
interface Milestone {
	points: number;
	feature: string;
}
interface QuestMilestone {
	id: string;
	points: number;
	name: string;
}
const featureMilestones: Milestone[] = [
	{
		points: 1000,
		feature: "Leaderboards",
	},
	{
		points: 1350,
		feature: "Shop Access",
	},
	{
		points: 1777,
		feature: "Feature 3",
	},
	{
		points: 2222,
		feature: "Feature 4",
	},
	{
		points: 3800,
		feature: "Feature 5",
	},
	{
		points: 10000,
		feature: "Feature 6",
	},
	{
		points: Infinity,
		feature: "",
	},
]; // Empty string for the last item

const itemMilestones: Milestone[] = [
	{
		points: 800,
		feature: "Item #1",
	},
	{
		points: 1500,
		feature: "Item #2",
	},
	{
		points: 2500,
		feature: "Item #3",
	},
	{
		points: 4000,
		feature: "Item #4",
	},
	{
		points: 6000,
		feature: "Item #5",
	},
	{
		points: Infinity,
		feature: "",
	},
]; // Empty string for the last item

export function FeatureTimeline({ currentPoints }: FeatureTimelineProps) {
	const [questMilestones, setQuestMilestones] = useState<QuestMilestone[]>([
		{
			id: "pending",
			points: Infinity,
			name: "",
		},
	]); // Empty string for the last item

	const [displayedFeatures, setDisplayedFeatures] = useState<Milestone[]>([]);
	const [displayedItems, setDisplayedItems] = useState<Milestone[]>([]);

	// Get closest milestones for features and shop items
	useEffect(() => {
		// Sort features by closest to currentPoints
		const sortedFeatures = [...featureMilestones]
			.filter((item) => item.points !== Infinity)
			.sort((a, b) => {
				const diffA = Math.abs(a.points - currentPoints);
				const diffB = Math.abs(b.points - currentPoints);
				return diffA - diffB;
			})
			.slice(0, 6);

		// Re-sort by ascending points for display
		sortedFeatures.sort((a, b) => a.points - b.points);

		// Add the "more coming soon" item
		sortedFeatures.push(featureMilestones[featureMilestones.length - 1]);
		setDisplayedFeatures(sortedFeatures);

		// Do the same for items
		const sortedItems = [...itemMilestones]
			.filter((item) => item.points !== Infinity)
			.sort((a, b) => {
				const diffA = Math.abs(a.points - currentPoints);
				const diffB = Math.abs(b.points - currentPoints);
				return diffA - diffB;
			})
			.slice(0, 6);

		// Re-sort by ascending points for display
		sortedItems.sort((a, b) => a.points - b.points);

		// Add the "more coming soon" item
		sortedItems.push(itemMilestones[itemMilestones.length - 1]);
		setDisplayedItems(sortedItems);
	}, [currentPoints]);

	useEffect(() => {
		async function fetchQuests() {
			try {
				// Fetch quests that have grey_unlock requirements
				// Filter out quests with zero or null grey_unlock
				// Filter out quests with topic_id
				const { data, error } = await supabase
					.from("sidequests")
					.select("id, title, grey_unlock")
					.gt("grey_unlock", 0) // Filter out zero grey_unlock
					.is("topic_id", null) // Only include quests without a topic_id
					.order("grey_unlock", {
						ascending: true,
					});
				if (error) {
					console.error("Error fetching quests:", error);
					return;
				}

				// Transform the data into the QuestMilestone format
				let formattedQuests = data.map((quest) => ({
					id: quest.id,
					points: quest.grey_unlock || 0,
					name: quest.title,
				}));

				// Find the 6 quests with grey_unlock values closest to the user's current points
				formattedQuests.sort((a, b) => {
					// Calculate the absolute difference between the point values and currentPoints
					const diffA = Math.abs(a.points - currentPoints);
					const diffB = Math.abs(b.points - currentPoints);
					return diffA - diffB; // Sort by closest to currentPoints
				});

				// Take only the 6 closest quests
				formattedQuests = formattedQuests.slice(0, 6);

				// Sort them again by points (ascending) for display
				formattedQuests.sort((a, b) => a.points - b.points);

				// Add the empty milestone with empty name
				formattedQuests.push({
					id: "more",
					points: Infinity,
					name: "",
				});

				setQuestMilestones(formattedQuests);
			} catch (error) {
				console.error("Error in fetchQuests:", error);
			}
		}
		fetchQuests();
	}, [currentPoints]); // Add currentPoints as dependency to recalculate when it changes

	const renderTimeline = (
		milestones: Milestone[] | QuestMilestone[],
		title: string,
		icon: React.ElementType
	) => (
		<div className="flex-1">
			<h3 className="text-lg font-medium mb-4 flex items-center gap-2">
				{React.createElement(icon, {
					className: "h-5 w-5",
				})}
				{title}
			</h3>
			<div className="relative">
				{/* Center the timeline line by adjusting left position */}
				<div className="absolute left-3 top-0 h-full w-px bg-border" />

				<div className="space-y-4 pb-8">
					{milestones.map((milestone, index) => {
						const isUnlocked = currentPoints >= milestone.points;
						const isLast = index === milestones.length - 1;
						const featureName =
							"feature" in milestone ? milestone.feature : milestone.name;
						return (
							<div
								key={isLast ? "last-item" : featureName}
								className="relative flex items-start gap-3"
							>
								<div
									className={cn(
										"absolute left-0 flex h-6 w-6 items-center justify-center rounded-full",
										isUnlocked ? "bg-primary" : "bg-muted",
										isLast && "animate-pulse"
									)}
								>
									{isUnlocked ? (
										<Check className="h-4 w-4 text-white" />
									) : (
										<Lock className="h-3.5 w-3.5 text-muted-foreground" />
									)}
								</div>

								<div className="ml-8">
									{featureName && (
										<p
											className={cn(
												"text-sm font-medium",
												isUnlocked
													? "text-primary"
													: "text-muted-foreground/50"
											)}
										>
											{featureName}
										</p>
									)}
									{!isLast && (
										<p className="text-xs text-muted-foreground">
											{milestone.points.toLocaleString()} points
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);

	return (
		<div className="mt-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{renderTimeline(displayedFeatures, "Unlock Features", Sparkles)}
				{renderTimeline(questMilestones, "Unlock Quests", Award)}
				{renderTimeline(displayedItems, "Unlock Shop Items", ShoppingBag)}
			</div>
		</div>
	);
}
