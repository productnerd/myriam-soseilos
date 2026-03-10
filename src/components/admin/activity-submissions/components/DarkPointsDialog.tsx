import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/overlay/Dialog";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { Award, Minus, Plus } from "lucide-react";

interface DarkPointsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (points: number) => void;
}

export const DarkPointsDialog: React.FC<DarkPointsDialogProps> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	const [darkPoints, setDarkPoints] = useState(1);

	const handleIncrement = () => {
		if (darkPoints < 3) {
			setDarkPoints(darkPoints + 1);
		}
	};

	const handleDecrement = () => {
		if (darkPoints > 1) {
			setDarkPoints(darkPoints - 1);
		}
	};

	const handleSubmit = () => {
		onConfirm(darkPoints);
	};

	return (
		<Dialog open={isOpen} onOpenChange={() => onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-center">Award Dark Points</DialogTitle>
				</DialogHeader>

				<div className="py-4">
					<p className="text-center text-sm text-muted-foreground mb-4">
						Select how many dark points to award the contributor for this submission.
					</p>

					<div className="flex items-center justify-center gap-4">
						<Button
							variant="outline"
							size="icon"
							onClick={handleDecrement}
							disabled={darkPoints <= 1}
						>
							<Minus className="h-4 w-4" />
						</Button>

						<div className="flex items-center gap-2">
							<Input
								type="number"
								value={darkPoints}
								onChange={(e) => {
									const value = parseInt(e.target.value);
									if (!isNaN(value) && value >= 1 && value <= 3) {
										setDarkPoints(value);
									}
								}}
								className="w-16 text-center"
								min={1}
								max={3}
							/>
							<Award className="h-5 w-5 text-purple-500" />
						</div>

						<Button
							variant="outline"
							size="icon"
							onClick={handleIncrement}
							disabled={darkPoints >= 3}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSubmit}>Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
