import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkVariants = cva(
	"inline-block text-sm font-medium transition-colors hover:underline focus:underline focus:outline-none",
	{
		variants: {
			variant: {
				default: "text-primary hover:text-primary/80",
				muted: "text-muted-foreground hover:text-muted-foreground/80",
				destructive: "text-destructive hover:text-destructive/80",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

export interface LinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
		VariantProps<typeof linkVariants> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
	({ className, variant, ...props }, ref) => {
		return <a className={cn(linkVariants({ variant, className }))} ref={ref} {...props} />;
	}
);
Link.displayName = "Link";

export { Link };
