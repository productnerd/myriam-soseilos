import React from "react";
import { TableCell, TableRow } from "@/components/ui/data/Table";
import { Trophy, Award, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/data/Badge";
import { ActivityRating } from "@/types/activity";
import NoteStatusSelector from "./NoteStatusSelector";

interface NoteRowProps {
	note: ActivityRating;
	isPending: boolean;
	onNoteClick: (note: ActivityRating) => void;
	onStatusChange: (noteId: string, status: string) => void;
}

const NoteRow: React.FC<NoteRowProps> = ({ note, isPending, onNoteClick, onStatusChange }) => {
	return (
		<TableRow
			key={note.id}
			className="cursor-pointer hover:bg-muted/50"
			onClick={(e) => {
				// Prevent triggering the row click when interacting with the select
				if ((e.target as HTMLElement).closest(".status-select")) {
					e.stopPropagation();
					return;
				}
				onNoteClick(note);
			}}
		>
			<TableCell>
				<div className="flex items-center gap-1">
					<span>{note.user?.name || "Unknown User"}</span>
					{note.user?.flag && <span>{note.user.flag}</span>}
				</div>
			</TableCell>
			<TableCell>{note.user?.email || "No email"}</TableCell>
			<TableCell>
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1">
						<Trophy size={16} className="text-amber-400" />
						<span>{note.user?.grey_points || 0}</span>
					</div>
					<div className="flex items-center gap-1">
						<Award size={16} className="text-purple-500" />
						<span>{note.user?.dark_points || 0}</span>
					</div>
				</div>
			</TableCell>
			<TableCell>
				{note.is_positive ? (
					<ThumbsUp className="text-green-500" size={18} />
				) : (
					<ThumbsDown className="text-red-500" size={18} />
				)}
			</TableCell>
			<TableCell className="max-w-[400px]">
				<div className="space-y-2">
					{note.activity?.topic?.level?.course && (
						<Badge
							className="mb-2"
							style={{
								backgroundColor: note.activity.topic.level.course.color || "#666",
								color: "white",
							}}
						>
							{note.activity.topic.level.course.title}
						</Badge>
					)}
					<div className="whitespace-pre-wrap break-words">
						{note.activity?.main_text || "Unknown activity"}
					</div>
				</div>
			</TableCell>
			<TableCell className="max-w-[400px]">
				<div className="whitespace-pre-wrap break-words">
					{note.comment || (
						<span className="text-muted-foreground italic">No comment provided</span>
					)}
				</div>
			</TableCell>
			<TableCell>
				<span className="text-sm text-muted-foreground">{note.formattedDate}</span>
			</TableCell>
			<TableCell>
				<NoteStatusSelector
					status={note.status}
					noteId={note.id}
					isPending={isPending}
					onStatusChange={onStatusChange}
				/>
			</TableCell>
		</TableRow>
	);
};

export default NoteRow;
