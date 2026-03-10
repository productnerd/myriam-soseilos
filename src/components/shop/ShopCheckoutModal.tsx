import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/overlay/Dialog";
import { Button } from "@/components/ui/interactive/Button";
import { Check, Award, DollarSign, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/ui/useToast";
import { useAssignPoints } from "@/hooks/points/useAssignPoints";

interface ShopCheckoutModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	darkPrice: number;
	usdPrice: number;
}

export const ShopCheckoutModal: React.FC<ShopCheckoutModalProps> = ({
	open,
	onOpenChange,
	darkPrice,
	usdPrice,
}) => {
	const [loading, setLoading] = useState(false);
	const [completed, setCompleted] = useState(false);
	const { toast } = useToast();
	const { assignQuestPoints } = useAssignPoints();

	const handleCheckout = async () => {
		setLoading(true);

		// Simulate payment processing
		setTimeout(async () => {
			try {
				// Generate unique transaction ID for the details field
				const transactionId = `shop-purchase-${Date.now()}`;

				// Deduct dark points (negative amount)
				await assignQuestPoints(-darkPrice, 0, transactionId);

				setLoading(false);
				setCompleted(true);

				toast({
					title: "Purchase Successful",
					description: "Your item has been claimed successfully!",
				});

				// Close modal after completion
				setTimeout(() => {
					setCompleted(false);
					onOpenChange(false);
				}, 2000);
			} catch (error) {
				console.error("Error processing payment:", error);
				setLoading(false);

				toast({
					title: "Payment Failed",
					description: "There was an error processing your payment.",
					variant: "destructive",
				});
			}
		}, 1500);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-xl">
						Complete Your Purchase
					</DialogTitle>
					<DialogDescription className="text-center">
						You're about to claim this item
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="bg-secondary/50 p-4 rounded-lg space-y-3">
						<div className="flex justify-between items-center">
							<div className="flex items-center">
								<Award className="h-5 w-5 text-indigo-400 mr-2" />
								<span>Dark Points</span>
							</div>
							<span className="font-medium">{darkPrice}</span>
						</div>

						<div className="flex justify-between items-center">
							<div className="flex items-center">
								<DollarSign className="h-5 w-5 text-green-500 mr-2" />
								<span>USD Payment</span>
							</div>
							<span className="font-medium">${usdPrice.toFixed(2)}</span>
						</div>
					</div>

					<div className="bg-background border rounded-lg p-4">
						<div className="flex items-center mb-4">
							<CreditCard className="h-5 w-5 mr-2" />
							<span className="font-medium">Payment Method</span>
						</div>

						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Card Number</span>
								<span>•••• •••• •••• 4242</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Expiration</span>
								<span>12/25</span>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					{!completed ? (
						<Button onClick={handleCheckout} className="w-full" disabled={loading}>
							{loading
								? "Processing..."
								: `Pay ${darkPrice} dark and $${usdPrice.toFixed(2)}`}
						</Button>
					) : (
						<div className="w-full flex items-center justify-center text-green-500 font-medium">
							<Check className="mr-2" /> Purchase Complete
						</div>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
