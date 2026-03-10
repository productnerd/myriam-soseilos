import React from "react";
import { Button } from "@/components/ui/interactive/Button";

interface NavigationButtonProps {
	onClick: () => void;
	label: string;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
	children?: React.ReactNode;
	primary?: boolean;
	secondary?: boolean;
	icon?: React.ReactNode;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
	onClick,
	label,
	variant: propVariant,
	children,
	primary,
	secondary,
	icon,
}) => {
	// Determine variant based on props
	const variant = propVariant || (primary ? "default" : secondary ? "secondary" : "default");

	return (
		<Button className="w-full" size="lg" onClick={onClick} variant={variant}>
			{label}
			{icon}
			{children}
		</Button>
	);
};

export default NavigationButton;
