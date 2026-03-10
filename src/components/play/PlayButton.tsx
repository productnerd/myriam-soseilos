import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
	onClick: () => void;
	isLoading: boolean;
	disabled?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick, isLoading, disabled = false }) => {
	return (
		<Button
			onClick={onClick}
			disabled={disabled || isLoading}
			className={cn(
				"fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg z-[9999]",
				"bg-primary hover:bg-primary/90 text-primary-foreground",
				"transition-all duration-500 transform hover:scale-105",
				"shadow-[0_8px_15px_rgba(230,69,0,0.3)]", // 3D effect with orange shadow
				(isLoading || disabled) && "opacity-40"
			)}
			size="icon"
			aria-label="Start Learning"
		>
			<Play className="h-8 w-8 fill-current" /> {/* Using fill-current to fill the icon */}
		</Button>
	);
};

export default PlayButton;
