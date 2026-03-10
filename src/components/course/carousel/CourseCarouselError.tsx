import React from "react";

interface CourseCarouselErrorProps {
	error: unknown;
}

const CourseCarouselError: React.FC<CourseCarouselErrorProps> = ({ error }) => {
	return (
		<div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
			Failed to load courses. Please try again later.
		</div>
	);
};

export default CourseCarouselError;
