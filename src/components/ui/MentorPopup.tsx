import React, { useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

// A lightweight, speech-bubble style popup used for displaying temporary, non-interactive mentor feedback.
// This is different from `MentorPopupWithButtons`, which is used for user choices.

interface MentorPopupProps {
	/** The text content to be displayed in the speech bubble */
	content: ReactNode;
	/** Whether the popup should be visible. Defaults to true */
	isVisible?: boolean;
	/** Whether to hide the speech bubble and show only the character */
	hideMessage?: boolean;
	/** Whether the popup can be dismissed by clicking. Defaults to true */
	hideOnClick?: boolean;
	/** Optional class name for additional styling */
	className?: string;
}

const MentorPopup: React.FC<MentorPopupProps> = ({
	content,
	isVisible = true,
	hideMessage = false,
	hideOnClick = true,
	className,
}) => {
	const [isShown, setIsShown] = useState(false);

	// Control the animation sequence with a delay
	useEffect(() => {
		if (isVisible) {
			// Update to 1-second delay before showing
			const timer = setTimeout(() => {
				setIsShown(true);
			}, 1000);
			return () => clearTimeout(timer);
		} else {
			setIsShown(false);
		}
	}, [isVisible]);

	// Handler to dismiss the popup
	const handleDismiss = () => {
		if (hideOnClick) {
			setIsShown(false);
		}
	};

	if (!isVisible) return null;

	return (
		<div
			className={cn(
				"fixed bottom-0 right-0 flex items-end transition-transform duration-1000 pointer-events-none z-[9999]",
				isShown ? "translate-y-0" : "translate-y-full",
				className
			)}
			onClick={hideOnClick ? handleDismiss : undefined}
			style={{ pointerEvents: hideOnClick ? "auto" : "none" }}
		>
			{/* Speech bubble - conditionally rendered */}
			{!hideMessage && (
				<div className="mb-2 mr-4 relative max-w-xs">
					<div className="bg-white/100 backdrop-blur-sm text-black shadow-lg px-[24px] py-[24px] mb-[24px] my-0 rounded-2xl flex items-center h-full border-2 border-black">
						<div className="speechbubble prose dark:prose-invert text-sm font-courier-prime">
							{content}
						</div>
					</div>
				</div>
			)}

			{/* Character image - positioned at bottom edge */}
			<div className="flex-shrink-0 h-80">
				<img
					src="/lovable-uploads/50cb504f-b4ed-4346-b81b-26024503cdfd.png"
					alt="Mentor character"
					className="h-full w-auto object-contain"
				/>
			</div>
		</div>
	);
};

export default MentorPopup;
