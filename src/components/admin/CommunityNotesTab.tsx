import React, { useState, useEffect } from "react";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/data/Table";
import { useCommunityNotes } from "@/hooks/admin/useCommunityNotes";
import CommunityNotesList from "./community-notes/CommunityNotesList";
import CommunityNoteDetail from "./community-notes/CommunityNoteDetail";
import { ActivityRating } from "@/types/activity";
import { toast } from "sonner";

const CommunityNotesTab: React.FC = () => {
	const { data: notes = [], isLoading, error, refetch } = useCommunityNotes();
	const [selectedNote, setSelectedNote] = useState<ActivityRating | null>(null);

	useEffect(() => {
		// Log fetched data for debugging
		console.log("Community Notes Tab - notes:", notes);
		console.log("isLoading:", isLoading);
		console.log("error:", error);

		if (error) {
			toast.error("Failed to load community notes");
			console.error("Error loading community notes:", error);
		}
	}, [notes, isLoading, error]);

	// Force refresh data every 30 seconds and on component mount
	useEffect(() => {
		// Initial fetch
		refetch();

		const interval = setInterval(() => {
			refetch();
		}, 30000);

		return () => clearInterval(interval);
	}, [refetch]);

	const handleSelectNote = (note: ActivityRating) => {
		setSelectedNote(note);
	};

	const handleCloseDetail = () => {
		setSelectedNote(null);
		refetch(); // Refresh data when closing detail view
	};

	if (isLoading) {
		return <div className="p-6 text-center">Loading community notes...</div>;
	}

	if (error) {
		return <div className="p-6 text-center text-red-500">Error loading community notes</div>;
	}

	return (
		<div className="space-y-6">
			{selectedNote ? (
				<CommunityNoteDetail note={selectedNote} onClose={handleCloseDetail} />
			) : (
				<div className="border rounded-md">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Points</TableHead>
								<TableHead>Rating</TableHead>
								<TableHead className="max-w-md">Activity</TableHead>
								<TableHead className="max-w-md">Note</TableHead>
								<TableHead>Submitted</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<CommunityNotesList notes={notes} onSelectNote={handleSelectNote} />
					</Table>
				</div>
			)}
		</div>
	);
};

export default CommunityNotesTab;
