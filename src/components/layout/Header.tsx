import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PointsIndicator from "@/components/points/PointsIndicator";
import CoursePickerButton from "@/components/course/picker/CoursePickerButton";
import CourseInfoButton from "@/components/course/actions/CourseInfoButton";
import Logo from "@/components/ui/Logo";

const Header: React.FC = () => {
	const location = useLocation();
	const isLearnPage = location.pathname === "/learn";

	// Hide header in test/learning pages for a better distraction-free user experience
	useEffect(() => {
		const isTestPage = location.pathname.includes("/test/");
		const isTopicPage = location.pathname.includes("/learn/");

		const headerElement = document.getElementById("main-header");
		if (headerElement) {
			if (isTestPage || isTopicPage) {
				headerElement.classList.add("hidden");
			} else {
				headerElement.classList.remove("hidden");
			}
		}
	}, [location.pathname]);

	return (
		<div
			id="main-header"
			className="fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-md border-b border-border z-50"
		>
			<div className="w-full h-full flex items-center px-1 md:px-4 relative">
				{/* Left section - Course picker and info */}
				<div className="flex justify-start items-center gap-1 md:gap-4 flex-1 md:flex-none md:ml-0 md:pl-4">
					{isLearnPage && (
						<>
							<CoursePickerButton />
							<CourseInfoButton />
						</>
					)}
				</div>

				{/* Center section - Logo (hidden on mobile, centered on desktop) */}
				<div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<Logo size="sm" />
				</div>

				{/* Right section - Points indicators on the far right */}
				<div className="flex justify-end items-center ml-auto pr-4">
					<PointsIndicator />
				</div>
			</div>
		</div>
	);
};

export default Header;
