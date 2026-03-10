import React, { useState } from "react";
import { Input } from "@/components/ui/form/Input";
import { Button } from "@/components/ui/interactive/Button";
import { Check, Edit2 } from "lucide-react";

interface NameEditorProps {
	name: string;
	onNameUpdate?: (newName: string) => Promise<void> | void;
}

const NameEditor: React.FC<NameEditorProps> = ({ name, onNameUpdate }) => {
	const [isEditingName, setIsEditingName] = useState(false);
	const [newName, setNewName] = useState(name || "");

	const handleNameEditClick = () => {
		setNewName(name || "");
		setIsEditingName(true);
	};

	const handleNameSave = async () => {
		if (newName.trim() && newName !== name && onNameUpdate) {
			await onNameUpdate(newName);
		}
		setIsEditingName(false);
	};

	return (
		<>
			{isEditingName ? (
				<div className="flex items-center gap-2">
					<Input
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						className="h-10 text-lg"
						autoFocus
					/>
					<Button size="icon" onClick={handleNameSave} variant="outline">
						<Check className="h-4 w-4" />
					</Button>
				</div>
			) : (
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-2xl">{name || "User"}</h3>
					<Button
						size="icon"
						variant="ghost"
						onClick={handleNameEditClick}
						className="h-8 w-8"
					>
						<Edit2 className="h-4 w-4" />
					</Button>
				</div>
			)}
		</>
	);
};

export default NameEditor;
