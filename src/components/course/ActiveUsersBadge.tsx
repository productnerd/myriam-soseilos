import React from "react";
import { Badge } from "@/components/ui/data/Badge";
import { Users } from "lucide-react";

interface ActiveUsersBadgeProps {
	activeUsers: number;
}

const ActiveUsersBadge: React.FC<ActiveUsersBadgeProps> = ({ activeUsers }) => {
	if (!activeUsers || activeUsers <= 0) {
		return null;
	}

	return (
		<Badge variant="outline" className="flex items-center gap-1 text-xs py-1">
			<Users className="h-3 w-3" />
			<span>Active learners: {activeUsers}</span>
		</Badge>
	);
};

export default ActiveUsersBadge;
