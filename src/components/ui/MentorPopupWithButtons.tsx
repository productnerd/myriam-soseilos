import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { X, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/layout/Card";

// A modal-style popup used when the user needs to make a choice or take an action (e.g., after completing a course).
// This is different from `MentorPopup`, which is used for mentor messages only.

interface MentorPopupWithButtonsProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string;
	actions: Array<{
		label: string;
		onClick: () => void;
		// This property is used to control the visual style of each action button in the popup
		// Each value affects the button's appearance
		variant: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
		className: string;
	}>;
	className: string;
	mentorAvatar?: string;
	mentorName?: string;
}

const MentorPopupWithButtons: React.FC<MentorPopupWithButtonsProps> = ({
	isOpen,
	onClose,
	title,
	description,
	actions,
	className,
	mentorAvatar,
	mentorName = "Mentor",
}) => {
	const [showPopup, setShowPopup] = useState(false);
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			setShowPopup(true);
		} else {
			setShowPopup(false);
		}
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		if (showPopup) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showPopup, onClose]);

	if (!showPopup) return null;

	return (
		<>
			<style
				dangerouslySetInnerHTML={{
					__html: `
          @keyframes mentor-popup-slide {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          .mentor-popup-animate {
            animation: mentor-popup-slide 0.4s ease-out forwards;
          }
        `,
				}}
			/>

			<div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end justify-center p-4">
				<Card
					ref={popupRef}
					className={`w-full max-w-md bg-white shadow-2xl border-0 mentor-popup-animate ${
						className || ""
					}`}
				>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								{mentorAvatar ? (
									<img
										src={mentorAvatar}
										alt={mentorName}
										className="w-10 h-10 rounded-full object-cover"
									/>
								) : (
									<div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
										<MessageCircle className="h-5 w-5 text-white" />
									</div>
								)}
								<div>
									<p className="font-medium text-sm text-gray-900">
										{mentorName}
									</p>
									<p className="text-xs text-gray-500">Your Learning Assistant</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={onClose}
								className="h-8 w-8 p-0 hover:bg-gray-100"
							>
								<X className="h-4 w-4 text-gray-900" />
							</Button>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
								<p className="text-sm text-gray-600 leading-relaxed">
									{description}
								</p>
							</div>

							<div className="flex flex-col gap-2">
								{actions.map((action, index) => (
									<Button
										key={index}
										variant={action.variant || "default"}
										onClick={() => {
											action.onClick();
											onClose();
										}}
										className={`w-full justify-start ${action.className || ""}`}
									>
										{action.label}
									</Button>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default MentorPopupWithButtons;
