import PageTransition from "@/components/ui/PageTransition";
import { useCourses } from "@/hooks/courses";

const CoursesPage = () => {
	const { isLoading, error } = useCourses();

	// First return: Loading State
	if (isLoading) {
		return (
			<PageTransition>
				<div className="container mx-auto py-8">
					<h1 className="text-2xl font-bold mb-6">Courses</h1>
					<div className="animate-pulse space-y-4">
						<div className="h-32 bg-gray-200 rounded-md"></div>
						<div className="h-32 bg-gray-200 rounded-md"></div>
					</div>
				</div>
			</PageTransition>
		);
	}

	// Second return: Error State
	if (error) {
		return (
			<PageTransition>
				<div className="container mx-auto py-8">
					<h1 className="text-2xl font-bold mb-6">Courses</h1>
					<div className="text-red-500">
						Failed to load courses. Please try again later.
					</div>
				</div>
			</PageTransition>
		);
	}

	// Third return: Success State
	return (
		<PageTransition>
			<div className="container mx-auto py-8">
				<h1 className="text-2xl font-bold mb-6">Courses</h1>
				<p className="text-muted-foreground">
					Use the course picker in the header to switch between courses.
				</p>
			</div>
		</PageTransition>
	);
};

export default CoursesPage;
