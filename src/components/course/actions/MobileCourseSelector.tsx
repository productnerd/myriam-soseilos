import React from "react";
import { type Course } from "@/types/course";
import { Skeleton } from "@/components/ui/data/Skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";

interface MobileCourseSelectorProps {
	courses: Course[] | undefined;
	isLoading: boolean;
	selectedCourseId: string | null;
	onCourseSelect: (courseId: string) => void;
}

const MobileCourseSelector: React.FC<MobileCourseSelectorProps> = ({
	courses,
	isLoading,
	selectedCourseId,
	onCourseSelect,
}) => {
	return (
		<div className="md:hidden mb-4">
			{isLoading ? (
				<Skeleton className="h-10 w-full" />
			) : (
				<Select value={selectedCourseId || undefined} onValueChange={onCourseSelect}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select a course" />
					</SelectTrigger>
					<SelectContent>
						{courses?.map((course) => (
							<SelectItem key={course.id} value={course.id}>
								{course.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
};

export default MobileCourseSelector;
