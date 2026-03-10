import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className }) => {
	const logoSize = {
		sm: "h-6",
		md: "h-10",
		lg: "h-16",
	}[size];

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<img
				src="/lovable-uploads/59656992-d416-4567-a9c5-75533c9c78cb.png"
				alt="Logo"
				className={cn(logoSize)}
			/>
		</div>
	);
};

export default Logo;
