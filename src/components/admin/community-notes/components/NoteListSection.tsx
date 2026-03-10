import React from "react";
import { TableRow, TableCell, TableBody } from "@/components/ui/data/Table";
import { ActivityRating } from "@/types/activity";
import NoteRow from "./NoteRow";

interface NoteListSectionProps {
	notes: ActivityRating[];
	title?: string;
	showSeparator?: boolean;
	isPending: boolean;
	onSelectNote: (note: ActivityRating) => void;
	onStatusChange: (noteId: string, status: string) => void;
}

const NoteListSection: React.FC<NoteListSectionProps> = ({
	notes,
	title,
	showSeparator = false,
	isPending,
	onSelectNote,
	onStatusChange,
}) => {
	if (notes.length === 0) return null;

	return (
		<>
			{showSeparator && title && (
				<TableRow>
					<TableCell colSpan={8} className="bg-muted/30 py-2">
						<div className="text-sm font-medium text-center">{title}</div>
					</TableCell>
				</TableRow>
			)}
			{notes.map((note) => (
				<NoteRow
					key={note.id}
					note={note}
					isPending={isPending}
					onNoteClick={onSelectNote}
					onStatusChange={onStatusChange}
				/>
			))}
		</>
	);
};

export default NoteListSection;
