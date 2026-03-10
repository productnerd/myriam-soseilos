// TODO: This component is not used anywhere

import { useActiveUsersPerCourse } from "@/hooks/analytics/useActiveUsersPerCourse";

const ActiveLearnersIndicator = () => {
	const { data, isLoading } = useActiveUsersPerCourse();

	// Calculate total active users from the data object
	const totalActiveUsers = data ? Object.values(data).reduce((sum, count) => sum + count, 0) : 0;

	if (isLoading) {
		return <span className="text-xs text-white/70 animate-pulse">Loading...</span>;
	}

	return <span className="text-xs text-white/70">{totalActiveUsers} active learners</span>;
};

export default ActiveLearnersIndicator;
