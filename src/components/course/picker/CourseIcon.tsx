import React from "react";
import { Course } from "@/types/course";

interface CourseIconProps {
	course: Course;
	className?: string;
}

const CourseIcon: React.FC<CourseIconProps> = ({ course, className = "h-6 w-6 text-primary" }) => {
	// Always use uploaded icons for all courses
	const getIconUrl = (courseTitle: string) => {
		// Map course titles to their uploaded icons
		const iconMap: Record<string, string> = {
			"Build a Strong, Capable Body":
				"/lovable-uploads/888c424a-93b1-4c6f-b712-562527daf2f4.png",
			"Use Tech Like a Pro": "/lovable-uploads/45730d91-0763-4a6c-8b6a-ec51d5900ff9.png",
			"Master Your Finances": "/lovable-uploads/1130bc64-db8e-4c0c-b5cf-d3322333e65c.png",
			"Eat Like an Adult": "/lovable-uploads/983a1a07-9834-4db2-b752-8e681cb36998.png",
			"Run Your Life Smoothly": "/lovable-uploads/2b0d8d31-f6ac-40ed-89dc-2b95c574ff52.png",
			"Write like the 1%": "/lovable-uploads/af4bb324-1ec9-404a-91a3-d2dccc3e4113.png",
		};

		return iconMap[courseTitle] || "/lovable-uploads/888c424a-93b1-4c6f-b712-562527daf2f4.png";
	};

	// If course has an uploaded icon image, use it - otherwise use the mapped icon
	const iconUrl =
		course.icon && course.icon.startsWith("/lovable-uploads/")
			? course.icon
			: getIconUrl(course.title);

	return (
		<div
			className={className}
			style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			<img
				src={iconUrl}
				alt={`${course.title} icon`}
				className="w-full h-full object-contain"
				style={{
					maxWidth: "100%",
					maxHeight: "100%",
				}}
			/>
		</div>
	);
};

export default CourseIcon;
