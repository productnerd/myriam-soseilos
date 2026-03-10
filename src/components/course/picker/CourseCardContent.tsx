import React from "react";
import { Course } from "@/types/course";
import { Badge } from "@/components/ui/data/Badge";
import CourseIcon from "./CourseIcon";
import CourseFriends from "@/components/course/social/CourseFriends";
import { getCourseTitleFontClass } from "@/utils/courses/courseFontUtils";

interface CourseCardContentProps {
	course: Course;
	courseColor: string;
	backgroundImage?: string;
	isComingSoon: boolean;
	shouldShowLevel: boolean;
	levelRomanNumeral?: string;
	activeUsersCount: number;
	skillTags: string[];
	hasNewTag: boolean;
	regularTags: string[];
}

const CourseCardContent: React.FC<CourseCardContentProps> = ({
	course,
	courseColor,
	backgroundImage,
	isComingSoon,
	shouldShowLevel,
	levelRomanNumeral,
	activeUsersCount,
	hasNewTag,
	regularTags,
}) => {
	const courseFontClass = getCourseTitleFontClass(course.title);

	// Get course-specific skills based on course title/content
	const getCourseSpecificSkills = (courseTitle: string): string[] => {
		const title = courseTitle.toLowerCase();

		if (title.includes("tech") || title.includes("technology")) {
			return [
				"AI",
				"PRODUCTIVITY SOFTWARE",
				"HARDWARE",
				"THE INTERNET",
				"CODING",
				"CYBERSECURITY",
			];
		}
		if (title.includes("finance") || title.includes("money")) {
			return ["BUDGETING", "INVESTING", "BANKING", "INSURANCE", "TAXES", "SAVINGS"];
		}
		if (title.includes("health") || title.includes("wellness")) {
			return [
				"NUTRITION",
				"FITNESS",
				"MENTAL HEALTH",
				"SLEEP",
				"STRESS MANAGEMENT",
				"PREVENTIVE CARE",
			];
		}
		if (title.includes("communication") || title.includes("social")) {
			return [
				"PUBLIC SPEAKING",
				"WRITING",
				"LISTENING",
				"NETWORKING",
				"TEAMWORK",
				"LEADERSHIP",
			];
		}
		if (title.includes("creativity") || title.includes("art")) {
			return ["DESIGN", "PHOTOGRAPHY", "MUSIC", "WRITING", "PAINTING", "CRAFTS"];
		}

		// Default fallback skills
		return ["BASICS", "FUNDAMENTALS", "CONCEPTS", "PRACTICE", "THEORY", "APPLICATION"];
	};

	// Create processed tags ensuring no tag is ever called "NEW"
	const processedTags = React.useMemo(() => {
		// Start with regular tags and filter out any "NEW" tags
		let filteredTags = regularTags.filter(
			(tag) => tag.toUpperCase() !== "NEW" && tag.toUpperCase() !== "new"
		);

		// Get course-specific skills to use as fallback
		const courseSkills = getCourseSpecificSkills(course.title);

		// If we need more tags to fill space, add course-specific ones
		while (filteredTags.length < 3 && courseSkills.length > 0) {
			const skillToAdd = courseSkills.find((skill) => !filteredTags.includes(skill));
			if (skillToAdd) {
				filteredTags.push(skillToAdd);
			} else {
				break;
			}
		}

		// Ensure we have at least one tag if none exist
		if (filteredTags.length === 0) {
			filteredTags = [courseSkills[0] || "FUNDAMENTALS"];
		}

		// Limit to first 4 tags max
		filteredTags = filteredTags.slice(0, 4);

		// If we have the NEW indicator for ACTIVE courses, randomly select one tag to include NEW
		if (hasNewTag && filteredTags.length > 0) {
			const randomIndex = Math.floor(Math.random() * filteredTags.length);
			return filteredTags.map((tag, i) => {
				if (i === randomIndex) {
					return `${tag}_WITH_NEW_INDICATOR`;
				}
				return tag;
			});
		}

		return filteredTags;
	}, [regularTags, hasNewTag, course.title]);

	return (
		<div className="relative z-20 flex flex-col h-full p-6">
			{/* Spacing above icon */}
			<div className="h-8" />

			{/* Centered icon - larger size like self-exploration cards */}
			<div className="flex justify-center mb-4">
				<CourseIcon
					course={{
						...course,
						color: courseColor,
					}}
					className="h-16 w-16 text-white"
				/>
			</div>

			{/* HOW TO label - formatted like LEVEL I with reduced spacing */}
			<div className="flex justify-center mb-1">
				<div className="text-white/80 text-sm font-medium">HOW TO</div>
			</div>

			{/* Title - centered with custom font and increased size */}
			<div className="flex justify-center mb-2">
				<h1 className={`${courseFontClass} font-semibold text-2xl text-center text-white`}>
					{course.title}
				</h1>
			</div>

			{/* Active users count - right under the title */}
			{!isComingSoon && activeUsersCount > 0 && (
				<div className="flex justify-center mb-2">
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
						<span className="text-xs text-white/70">{activeUsersCount} learners</span>
					</div>
				</div>
			)}

			{/* Coming Soon badge - positioned right under the title with capital letters and grey styling */}
			{isComingSoon && (
				<div className="flex justify-center mb-4">
					<div className="bg-gray-500/90 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
						COMING SOON
					</div>
				</div>
			)}

			{/* Spacer to push bottom content down */}
			<div className="flex-1" />

			{/* Level display - left aligned above tags if user has started the course */}
			{shouldShowLevel && levelRomanNumeral && (
				<div className="text-left mb-2">
					<div className="text-white/80 text-sm font-medium">
						LEVEL {levelRomanNumeral}
					</div>
				</div>
			)}

			{/* Level and Friends section */}
			<div className="flex justify-between items-end mb-2">
				{/* Empty left side since level is now above tags */}
				<div></div>

				{/* Friends on the right */}
				<div className="flex flex-col items-end">
					<CourseFriends courseId={course.id} />
				</div>
			</div>

			{/* Tags at the bottom, full width */}
			{processedTags.length > 0 && (
				<div className="flex flex-wrap gap-1 w-full">
					{processedTags.map((tag, index) => {
						// Check if this tag has the NEW indicator
						const hasNewIndicator = tag.includes("_WITH_NEW_INDICATOR");
						const displayTag = hasNewIndicator
							? tag.replace("_WITH_NEW_INDICATOR", "")
							: tag;

						return (
							<Badge
								key={index}
								variant="outline"
								className="text-xs uppercase text-white border-white/50 bg-white/10 relative"
							>
								{displayTag}
								{hasNewIndicator && (
									<span className="ml-1 bg-orange-500 text-white px-1 py-0 rounded text-xs animate-pulse">
										NEW
									</span>
								)}
							</Badge>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default CourseCardContent;
