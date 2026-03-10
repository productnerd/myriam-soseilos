import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCourseContext } from "@/contexts/CourseContext";
import { useUserContext } from "@/contexts/UserContext";
import { useSourcesByCourse } from "@/hooks/courses/useSourcesByCourse";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/overlay/Sheet";
import SourcesList from "@/components/sources/SourcesList";

const CourseInfoButton: React.FC = () => {
	const navigate = useNavigate();
	const [open, setOpen] = useState<boolean>(false);
	const [showCoursesInfo, setShowCoursesInfo] = useState<boolean>(false);

	const { user } = useUserContext();

	const { selectedCourseId } = useCourseContext();

	// Query to check if user is a contributor
	// TODO: This should go inside a hook
	const { data: userRole, isLoading: isCheckingRole } = useQuery({
		queryKey: ["user-contributor-role", user?.id],
		queryFn: async () => {
			if (!user?.id) return { isContributor: false };

			const { data, error } = await supabase
				.from("user_roles")
				.select("role")
				.eq("user_id", user.id)
				.eq("role", "contributor")
				.maybeSingle();

			if (error) {
				console.error("Error checking contributor status:", error);
				return { isContributor: false };
			}

			return {
				isContributor: !!data,
			};
		},
		enabled: !!user?.id, // Only run when user is authenticated
	});

	const { data: sources, isLoading, error, refetch } = useSourcesByCourse(selectedCourseId);

	useEffect(() => {
		if (selectedCourseId) {
			refetch();
		}

		const handleCourseChanged = (event: Event) => {
			const customEvent = event as CustomEvent;
			if (customEvent.detail) {
				refetch();
			}
		};

		window.addEventListener("course-changed", handleCourseChanged);
		return () => {
			window.removeEventListener("course-changed", handleCourseChanged);
		};
	}, [selectedCourseId, refetch]);

	// Don't render if user details are not available yet or no course is selected
	if (!user || !selectedCourseId) {
		return null;
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full ml-2">
					<Info className="h-5 w-5" />
					<span className="sr-only">Course information</span>
				</Button>
			</SheetTrigger>
			<SheetContent className="w-full sm:max-w-md bg-card/95 backdrop-blur-sm border-l border-border flex flex-col">
				<SheetHeader className="mb-6">
					<SheetTitle>Course Sources</SheetTitle>
				</SheetHeader>

				<div className="flex-1 overflow-auto">
					<SourcesList sources={sources} isLoading={isLoading} error={error} />
				</div>

				<div className="mt-auto pt-4 border-t space-y-4">
					{/* How courses are made toggle */}
					<div className="w-full">
						<Button
							variant="ghost"
							size="sm"
							className="w-full justify-start text-xs py-2 h-auto"
							onClick={() => setShowCoursesInfo(!showCoursesInfo)}
						>
							<span className="flex items-center gap-1">
								<span
									className={`transition-transform ${
										showCoursesInfo ? "rotate-90" : ""
									}`}
								>
									▶
								</span>
								How are Afterhours courses made?
							</span>
						</Button>

						{showCoursesInfo && (
							<div className="text-xs px-2 py-3 text-muted-foreground">
								<p className="mb-2">
									Courses are built by a collection of generalists + AI using
									human wisdom, books, papers and other internet sources.
								</p>
								<p className="mb-2">
									They are then validated and enhanced by experts in the field.
								</p>
								<p>
									Are further validated and enhanced by contributors who can
									report, add sources, improve and add new content.
								</p>
							</div>
						)}
					</div>

					{/* Only show the contributor button if user is definitely NOT a contributor */}
					{userRole?.isContributor === false && !isCheckingRole && (
						<Button
							variant="outline"
							className="w-full"
							onClick={() => {
								setOpen(false);
								navigate("/contributors");
							}}
						>
							Become a Contributor
						</Button>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default CourseInfoButton;
