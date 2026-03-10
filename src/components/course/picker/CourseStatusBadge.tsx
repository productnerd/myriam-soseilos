import React from "react";
import { Badge } from "@/components/ui/data/Badge";
import { CourseStatus } from "@/types/course";

interface CourseStatusBadgeProps {
	status: CourseStatus;
}

const CourseStatusBadge: React.FC<CourseStatusBadgeProps> = ({ status }) => {
	// Get status string from CourseStatus type
	const statusString = status === "NOT_STARTED" ? "NOT_STARTED" : status.status;

	return (
		<Badge
			className={`
        ${statusString === "COMPLETED" ? "bg-green-600" : ""}
        ${statusString === "INPROGRESS" ? "bg-blue-600" : ""}
        ${statusString === "NOT_STARTED" ? "bg-gray-600" : ""}
        text-white border-none
      `}
		>
			{statusString === "INPROGRESS"
				? "In Progress"
				: statusString === "COMPLETED"
				? "Completed"
				: "Not Started"}
		</Badge>
	);
};

export default CourseStatusBadge;
