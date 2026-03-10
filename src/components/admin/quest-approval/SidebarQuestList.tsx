import React, { useState } from "react";
import { QuestSubmissionGroup } from "@/types/quests";
import { ScrollArea } from "@/components/ui/layout/ScrollArea";
import { Input } from "@/components/ui/form/Input";
import { Search } from "lucide-react";
import QuestCard from "./QuestCard";

interface SidebarQuestListProps {
	submissionGroups: QuestSubmissionGroup[];
	selectedSidequest: string | null;
	setSelectedSidequest: (id: string) => void;
}

const SidebarQuestList: React.FC<SidebarQuestListProps> = ({
	submissionGroups,
	selectedSidequest,
	setSelectedSidequest,
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	// Filter groups based on search query
	const filteredGroups = submissionGroups.filter(
		(group) =>
			group.sidequest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(group.sidequest.description &&
				group.sidequest.description.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	// Split submissions into pending and processed
	const pendingGroups = filteredGroups.filter((group) => group.pendingCount > 0);
	const otherGroups = filteredGroups.filter((group) => group.pendingCount === 0);

	// Sort pending groups by oldest submission first
	const sortedPendingGroups = [...pendingGroups].sort((a, b) => {
		// Find oldest pending submission in each group
		const oldestA = a.submissions
			.filter((s) => s.status === "pending")
			.sort((x, y) => new Date(x.created_at).getTime() - new Date(y.created_at).getTime())[0];

		const oldestB = b.submissions
			.filter((s) => s.status === "pending")
			.sort((x, y) => new Date(x.created_at).getTime() - new Date(y.created_at).getTime())[0];

		if (!oldestA) return 1;
		if (!oldestB) return -1;

		return new Date(oldestA.created_at).getTime() - new Date(oldestB.created_at).getTime();
	});

	return (
		<div>
			<div className="relative mb-3">
				<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search quests..."
					className="pl-8"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<ScrollArea className="h-[70vh]">
				<div className="pr-3 grid gap-2">
					{sortedPendingGroups.length > 0 && (
						<>
							<h4 className="text-xs uppercase text-muted-foreground mt-2">
								Pending Approval ({sortedPendingGroups.length})
							</h4>
							{sortedPendingGroups.map((group) => (
								<QuestCard
									key={group.sidequest.id}
									group={group}
									isSelected={selectedSidequest === group.sidequest.id}
									onClick={() => setSelectedSidequest(group.sidequest.id)}
								/>
							))}
						</>
					)}

					{otherGroups.length > 0 && (
						<>
							<h4 className="text-xs uppercase text-muted-foreground mt-4">
								No Action Needed
							</h4>
							{otherGroups.map((group) => (
								<QuestCard
									key={group.sidequest.id}
									group={group}
									isSelected={selectedSidequest === group.sidequest.id}
									onClick={() => setSelectedSidequest(group.sidequest.id)}
								/>
							))}
						</>
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default SidebarQuestList;
