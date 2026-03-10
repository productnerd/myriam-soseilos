import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { PopularCourse } from "@/hooks/admin/statistics/types";
import { useActiveUsersPerCourse } from "@/hooks/analytics/useActiveUsersPerCourse";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/data/Badge";

interface PopularCoursesCardProps {
	courses: PopularCourse[];
}

export default function PopularCoursesCard({ courses }: PopularCoursesCardProps) {
	const { data: activeUsersData } = useActiveUsersPerCourse();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Popular Courses</CardTitle>
				<CardDescription>Most enrolled courses and their average scores</CardDescription>
			</CardHeader>
			<CardContent>
				{!courses || courses.length === 0 ? (
					<div className="flex items-center justify-center h-48">
						<p className="text-muted-foreground italic">No course data available</p>
					</div>
				) : (
					<div className="divide-y">
						{courses.map((course) => (
							<div key={course.course_id} className="py-3 first:pt-0 last:pb-0">
								<div className="flex justify-between items-center">
									<div className="font-medium">{course.title}</div>
									<div className="text-sm font-semibold bg-primary/10 text-primary rounded-full px-2 py-1">
										{course.average_score !== undefined
											? `${course.average_score}%`
											: "No scores yet"}
									</div>
								</div>
								<div className="text-sm text-muted-foreground mt-1">
									{course.enrollment_percentage !== undefined
										? `${course.enrollment_percentage}% of users enrolled`
										: `${course.user_count} enrolled ${
												course.user_count === 1 ? "user" : "users"
										  }`}
								</div>

								{/* Active users count with clear label */}
								{activeUsersData &&
									activeUsersData[course.course_id] &&
									activeUsersData[course.course_id] > 0 && (
										<div className="mt-2">
											<Badge
												variant="outline"
												className="flex items-center gap-1 text-xs py-1"
											>
												<Users className="h-3 w-3" />
												<span>
													{activeUsersData[course.course_id]}+ active
													learners
												</span>
											</Badge>
										</div>
									)}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
