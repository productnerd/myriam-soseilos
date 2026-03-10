import React, { useCallback, useState, useEffect } from "react";
import { ActivityRating } from "@/types/activity";
import { TableBody } from "@/components/ui/data/Table";
import { useUpdateCommunityNote } from "@/hooks/admin/useUpdateCommunityNote";

import EmptyNotesList from "./components/EmptyNotesList";
import NoteListSection from "./components/NoteListSection";

interface CommunityNotesListProps {
	notes: ActivityRating[];
	onSelectNote: (note: ActivityRating) => void;
}

const CommunityNotesList: React.FC<CommunityNotesListProps> = ({ notes, onSelectNote }) => {
	console.log("CommunityNotesList - received notes:", notes);
	const [localNotes, setLocalNotes] = useState<ActivityRating[]>(notes);
	const { mutate: updateNote, isPending, isError, error } = useUpdateCommunityNote();

	// Update local notes when props change
	useEffect(() => {
		setLocalNotes(notes);
	}, [notes]);

	// Log errors for debugging
	useEffect(() => {
		if (isError) {
			console.error("Error updating note status:", error);
		}
	}, [isError, error]);

	if (!localNotes || localNotes.length === 0) {
		return <EmptyNotesList />;
	}

	// Separate notes by status
	const openNotes = localNotes.filter((note) => note.status === "Open");
	const publishedNotes = localNotes.filter((note) => note.status === "Published");
	const addressedRejectedNotes = localNotes.filter(
		(note) => note.status === "Addressed" || note.status === "Rejected"
	);

	const handleStatusChange = useCallback(
		(noteId: string, newStatus: string) => {
			console.log(`Changing status for note ${noteId} to ${newStatus}`);

			if (!noteId) {
				console.error("Invalid note ID provided");
				return;
			}

			// Optimistically update the UI but revert on error
			const originalNotes = [...localNotes];

			setLocalNotes((prevNotes) =>
				prevNotes.map((note) =>
					note.id === noteId ? { ...note, status: newStatus } : note
				)
			);

			// Update in the database
			updateNote(
				{ noteId, status: newStatus },
				{
					onError: () => {
						console.log("Reverting optimistic update due to error");
						// Revert to original state on error
						setLocalNotes(originalNotes);
					},
				}
			);
		},
		[updateNote, localNotes]
	);

	return (
		<TableBody>
			{/* Open notes at the top */}
			<NoteListSection
				notes={openNotes}
				isPending={isPending}
				onSelectNote={onSelectNote}
				onStatusChange={handleStatusChange}
			/>

			{/* Published notes in the middle */}
			<NoteListSection
				notes={publishedNotes}
				isPending={isPending}
				onSelectNote={onSelectNote}
				onStatusChange={handleStatusChange}
			/>

			{/* Addressed/Rejected notes at the bottom with a separator */}
			<NoteListSection
				notes={addressedRejectedNotes}
				title="Addressed/Rejected Notes"
				showSeparator={addressedRejectedNotes.length > 0}
				isPending={isPending}
				onSelectNote={onSelectNote}
				onStatusChange={handleStatusChange}
			/>
		</TableBody>
	);
};

export default CommunityNotesList;
