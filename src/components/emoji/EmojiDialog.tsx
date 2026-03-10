import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/overlay/Dialog";
import { Input } from "@/components/ui/form/Input";
import { Button } from "@/components/ui/interactive/Button";

interface EmojiDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	tempEmoji: string;
	onEmojiChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onEmojiSave: () => void;
}

const EmojiDialog: React.FC<EmojiDialogProps> = ({
	isOpen,
	onOpenChange,
	tempEmoji,
	onEmojiChange,
	onEmojiSave,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Select your favorite emoji</DialogTitle>
					<DialogDescription>Type a single emoji that represents you</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="flex items-end gap-4">
						<div className="flex-1">
							<label className="text-sm text-muted-foreground mb-2 block">
								Your emoji
							</label>
							<Input
								value={tempEmoji}
								onChange={onEmojiChange}
								className="text-2xl h-16 text-center"
								maxLength={2}
							/>
						</div>

						<Button onClick={onEmojiSave}>Save</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EmojiDialog;
