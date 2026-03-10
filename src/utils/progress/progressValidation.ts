import { TopicWithProgress, LevelWithProgress, CourseWithProgress } from "@/types/progress";

/**
 * Consolidated progress validation utilities
 * Replaces scattered validation logic throughout the app
 */
export class ProgressValidation {
	/**
	 * Validate that course structure is complete and consistent
	 */
	static validateCourseStructure(
		course: CourseWithProgress,
		levels: LevelWithProgress[],
		topics: TopicWithProgress[]
	): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];
		
		// Check if course has levels
		const courseLevels = levels.filter(l => l.course_id === course.id);
		if (courseLevels.length === 0) {
			errors.push(`Course ${course.title} has no levels`);
		}
		
		// Check if each level has topics
		courseLevels.forEach(level => {
			const levelTopics = topics.filter(t => t.level_id === level.id);
			if (levelTopics.length === 0) {
				errors.push(`Level ${level.title} has no topics`);
			}
		});
		
		// Check topic order consistency
		courseLevels.forEach(level => {
			const levelTopics = topics
				.filter(t => t.level_id === level.id)
				.sort((a, b) => a.order_number - b.order_number);
			
			levelTopics.forEach((topic, index) => {
				if (topic.order_number !== index + 1) {
					errors.push(`Topic ${topic.title} has incorrect order_number`);
				}
			});
		});
		
		return {
			isValid: errors.length === 0,
			errors
		};
	}
	
	/**
	 * Validate progress percentages are accurate
	 */
	static validateProgressPercentages(
		courses: CourseWithProgress[],
		topics: TopicWithProgress[],
		levels: LevelWithProgress[]
	): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];
		
		courses.forEach(course => {
			const courseTopics = topics.filter(t => {
				const level = levels.find(l => l.id === t.level_id);
				return level?.course_id === course.id;
			});
			
			const completedTopics = courseTopics.filter(t => t.is_completed);
			const expectedPercentage = courseTopics.length > 0 
				? Math.round((completedTopics.length / courseTopics.length) * 100)
				: 0;
			
			if (Math.abs(course.progress_percentage - expectedPercentage) > 1) {
				errors.push(
					`Course ${course.title} progress mismatch: expected ${expectedPercentage}%, got ${course.progress_percentage}%`
				);
			}
		});
		
		return {
			isValid: errors.length === 0,
			errors
		};
	}
	
	/**
	 * Validate topic unlock logic is consistent
	 */
	static validateTopicUnlockLogic(
		topics: TopicWithProgress[],
		levels: LevelWithProgress[]
	): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];
		
		// Group topics by level
		const topicsByLevel = topics.reduce((acc, topic) => {
			if (!acc[topic.level_id]) {
				acc[topic.level_id] = [];
			}
			acc[topic.level_id].push(topic);
			return acc;
		}, {} as Record<string, TopicWithProgress[]>);
		
		// Check each level's topic progression
		Object.entries(topicsByLevel).forEach(([levelId, levelTopics]) => {
			const sortedTopics = levelTopics.sort((a, b) => a.order_number - b.order_number);
			
			for (let i = 0; i < sortedTopics.length; i++) {
				const topic = sortedTopics[i];
				const previousTopic = sortedTopics[i - 1];
				
				// First topic should always be unlocked or in_progress
				if (i === 0 && topic.status === "locked") {
					errors.push(`First topic ${topic.title} should not be locked`);
				}
				
				// If topic is unlocked/completed, previous topics should be completed
				if (i > 0 && (topic.status === "in_progress" || topic.status === "completed")) {
					if (previousTopic && !previousTopic.is_completed) {
						errors.push(
							`Topic ${topic.title} is unlocked but previous topic ${previousTopic.title} is not completed`
						);
					}
				}
			}
		});
		
		return {
			isValid: errors.length === 0,
			errors
		};
	}
	
	/**
	 * Run all validation checks
	 */
	static validateAll(
		courses: CourseWithProgress[],
		levels: LevelWithProgress[],
		topics: TopicWithProgress[]
	): { isValid: boolean; errors: string[]; warnings: string[] } {
		const allErrors: string[] = [];
		const warnings: string[] = [];
		
		// Structure validation
		courses.forEach(course => {
			const structureResult = this.validateCourseStructure(course, levels, topics);
			allErrors.push(...structureResult.errors);
		});
		
		// Progress validation
		const progressResult = this.validateProgressPercentages(courses, topics, levels);
		allErrors.push(...progressResult.errors);
		
		// Unlock logic validation
		const unlockResult = this.validateTopicUnlockLogic(topics, levels);
		allErrors.push(...unlockResult.errors);
		
		// Additional warnings for potential issues
		if (courses.length === 0) {
			warnings.push("No courses found");
		}
		
		if (topics.length === 0) {
			warnings.push("No topics found");
		}
		
		return {
			isValid: allErrors.length === 0,
			errors: allErrors,
			warnings
		};
	}
}

/**
 * Development helper for debugging progress issues
 */
export function debugProgressState(
	courses: CourseWithProgress[],
	levels: LevelWithProgress[],
	topics: TopicWithProgress[]
) {
	console.group("🔍 Progress State Debug");
	
	const validation = ProgressValidation.validateAll(courses, levels, topics);
	
	console.log("📊 Summary:", {
		courses: courses.length,
		levels: levels.length,
		topics: topics.length,
		isValid: validation.isValid
	});
	
	if (validation.errors.length > 0) {
		console.error("❌ Errors:", validation.errors);
	}
	
	if (validation.warnings.length > 0) {
		console.warn("⚠️ Warnings:", validation.warnings);
	}
	
	console.groupEnd();
	
	return validation;
}