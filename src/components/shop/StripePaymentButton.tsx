import React from "react";
import { Button } from "../ui/interactive/Button";
import { useStripePayment } from "@/hooks/shop/useStripePayment";

interface StripePaymentButtonProps {
	productId: string;
	className?: string;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	children?: React.ReactNode;
	disabled?: boolean;
}

const StripePaymentButton: React.FC<StripePaymentButtonProps> = ({
	productId,
	className,
	variant = "default",
	children = "Buy Now",
	disabled = false,
}) => {
	const { initiatePayment, isLoading } = useStripePayment();

	const handleClick = () => {
		initiatePayment(productId);
	};

	return (
		<Button
			onClick={handleClick}
			className={className}
			variant={variant}
			disabled={isLoading || disabled}
		>
			{isLoading ? "Processing..." : children}
		</Button>
	);
};

export default StripePaymentButton;
