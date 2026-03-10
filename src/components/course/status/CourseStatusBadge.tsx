import React from "react";
import { Badge } from "@/components/ui/data/Badge";
import { CourseStatus } from "@/types/course";
import { Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CourseStatusBadgeProps {
	courseStatus: CourseStatus | null | undefined;
	processedColor?: string;
}

const CourseStatusBadge: React.FC<CourseStatusBadgeProps> = ({
	courseStatus,
	processedColor = "#3b82f6", // Default color if none provided
}) => {
	// For in-progress courses, get the level number
	const { data: levelNumber } = useQuery({
		queryKey: [
			"levelNumber",
			courseStatus && typeof courseStatus !== "string" ? courseStatus.current_level_id : null,
		],
		queryFn: async () => {
			if (
				!courseStatus ||
				typeof courseStatus === "string" ||
				!courseStatus.current_level_id
			) {
				return null;
			}

			const { data, error } = await supabase
				.from("levels")
				.select("order_number")
				.eq("id", courseStatus.current_level_id)
				.single();

			if (error) {
				console.error("Error fetching level number:", error);
				return null;
			}

			return data?.order_number || null;
		},
		enabled: !!(
			courseStatus &&
			typeof courseStatus !== "string" &&
			courseStatus.current_level_id
		),
	});

	const getStatusText = () => {
		if (!courseStatus) return "NOT STARTED";

		if (courseStatus === "NOT_STARTED") return "NOT STARTED";

		if (typeof courseStatus === "object") {
			if (courseStatus.status === "COMPLETED") return "COMPLETED";

			if (courseStatus.status === "INPROGRESS") {
				return `LEVEL ${levelNumber || "..."}`;
			}
		}

		return "NOT STARTED";
	};

	const getStatusVariant = () => {
		if (!courseStatus) return "outline";
		if (courseStatus === "NOT_STARTED") return "outline";

		if (typeof courseStatus === "object") {
			if (courseStatus.status === "COMPLETED") return "default";
			if (courseStatus.status === "INPROGRESS") return "secondary";
		}

		return "outline";
	};

	const isInProgress =
		courseStatus && typeof courseStatus !== "string" && courseStatus.status === "INPROGRESS";

	return (
		<Badge variant={getStatusVariant()} className="rounded-full px-3 flex items-center gap-1">
			{isInProgress && (
				<Circle
					className="h-2 w-2 fill-current animate-pulse opacity-70"
					style={{ color: processedColor }}
				/>
			)}
			{getStatusText()}
		</Badge>
	);
};

export default CourseStatusBadge;
