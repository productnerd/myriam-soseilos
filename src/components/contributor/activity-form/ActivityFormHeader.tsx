import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Trash2 } from "lucide-react";

interface ActivityFormHeaderProps {
	index: number;
	onRemove: () => void;
}

export const ActivityFormHeader = ({ index, onRemove }: ActivityFormHeaderProps) => {
	return (
		<div className="flex justify-between items-center">
			<h3 className="text-lg font-medium">Activity {index + 1}</h3>
			<Button
				variant="ghost"
				size="sm"
				onClick={onRemove}
				className="text-destructive"
				type="button"
			>
				<Trash2 className="w-4 h-4" />
			</Button>
		</div>
	);
};
