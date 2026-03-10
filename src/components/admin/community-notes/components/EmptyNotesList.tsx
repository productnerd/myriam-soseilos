import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/data/Table";

const EmptyNotesList: React.FC = () => {
	return (
		<TableBody>
			<TableRow>
				<TableCell colSpan={8} className="text-center py-6">
					<div className="p-4">
						<p className="text-lg font-medium mb-2">No community notes yet</p>
						<p className="text-muted-foreground">
							Notes from contributors will appear here
						</p>
					</div>
				</TableCell>
			</TableRow>
		</TableBody>
	);
};

export default EmptyNotesList;
