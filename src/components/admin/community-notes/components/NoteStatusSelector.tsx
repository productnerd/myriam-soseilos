import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";

interface NoteStatusSelectorProps {
	status: string;
	noteId: string;
	isPending: boolean;
	onStatusChange: (noteId: string, status: string) => void;
}

const NoteStatusSelector: React.FC<NoteStatusSelectorProps> = ({
	status,
	noteId,
	isPending,
	onStatusChange,
}) => {
	const handleStatusChange = (value: string) => {
		console.log(
			`Select onValueChange: ${value} for note ${noteId} (current status: ${status})`
		);
		if (value !== status) {
			onStatusChange(noteId, value);
		}
	};

	return (
		<div className="status-select relative z-50" onClick={(e) => e.stopPropagation()}>
			<Select value={status} disabled={isPending} onValueChange={handleStatusChange}>
				<SelectTrigger className="w-[130px] bg-background">
					<SelectValue placeholder={status}>{status}</SelectValue>
				</SelectTrigger>
				<SelectContent className="bg-background z-[100]">
					<SelectItem value="Open">Open</SelectItem>
					<SelectItem value="Addressed">Addressed</SelectItem>
					<SelectItem value="Rejected">Rejected</SelectItem>
					<SelectItem value="Published">Published</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default NoteStatusSelector;
