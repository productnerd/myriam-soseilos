import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/overlay/Dialog";
import { Input } from "@/components/ui/form/Input";
import { ScrollArea } from "@/components/ui/layout/ScrollArea";
import { Badge } from "@/components/ui/data/Badge";
import { COUNTRY_FLAGS } from "@/types/countryFlags";

interface FlagDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onFlagSelect: (flagEmoji: string, countryName: string) => void;
}

const FlagDialog: React.FC<FlagDialogProps> = ({ isOpen, onOpenChange, onFlagSelect }) => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredFlags = searchQuery
		? COUNTRY_FLAGS.filter((flag) =>
				flag.name.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: COUNTRY_FLAGS;

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Select your country flag</DialogTitle>
					<DialogDescription>Choose a flag that represents you</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<Input
						placeholder="Search countries..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="mb-4"
					/>

					<ScrollArea className="h-[50vh] pr-4">
						<div className="grid grid-cols-4 gap-2">
							{filteredFlags.map((flag) => (
								<Badge
									key={flag.name}
									variant="outline"
									className="flex items-center justify-center text-2xl p-3 cursor-pointer hover:bg-accent"
									onClick={() => onFlagSelect(flag.emoji, flag.name)}
								>
									{flag.emoji}
								</Badge>
							))}
						</div>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FlagDialog;
