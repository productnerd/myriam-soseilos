import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: "default" | "sm" | "lg" | "xl";
}

export function Spinner({ className, size = "default", ...props }: SpinnerProps) {
	return (
		<div
			className={cn(
				"animate-spin rounded-full border-2 border-current border-t-transparent",
				{
					"h-4 w-4": size === "sm",
					"h-6 w-6": size === "default",
					"h-8 w-8": size === "lg",
					"h-10 w-10": size === "xl",
				},
				"text-primary",
				className
			)}
			{...props}
			role="status"
			aria-label="Loading"
		>
			<span className="sr-only">Loading</span>
		</div>
	);
}
