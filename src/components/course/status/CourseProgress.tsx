import React from "react";

interface CourseProgressProps {
	courseStatus: any;
}

const CourseProgress: React.FC<CourseProgressProps> = ({ courseStatus }) => {
	// We no longer need to show progress information here
	// since we're displaying the level in the status badge
	return null;
};

export default CourseProgress;
