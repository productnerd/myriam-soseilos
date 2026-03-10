import { TopicWithProgress, LevelWithProgress, CourseWithProgress, TopicStatus } from "@/types/progress";

/**
 * Consolidated progress utilities that replace scattered validation logic
 */
export class ProgressUtils {
	/**
	 * Calculate if a topic is unlocked based on prerequisites
	 */
	static isTopicUnlocked(
		topicId: string, 
		allTopics: TopicWithProgress[], 
		completedTopics: string[]
	): boolean {
		const topic = allTopics.find(t => t.id === topicId);
		if (!topic) return false;

		// Get all topics in the same level, sorted by order
		const levelTopics = allTopics
			.filter(t => t.level_id === topic.level_id)
			.sort((a, b) => a.order_number - b.order_number);

		// First topic in level is always unlocked
		if (levelTopics[0]?.id === topicId) return true;

		// Check if previous topic is completed
		const topicIndex = levelTopics.findIndex(t => t.id === topicId);
		if (topicIndex <= 0) return true;

		const previousTopic = levelTopics[topicIndex - 1];
		return completedTopics.includes(previousTopic.id);
	}

	/**
	 * Calculate progress percentage for a course
	 */
	static calculateCourseProgress(
		courseId: string,
		topics: TopicWithProgress[],
		levels: LevelWithProgress[]
	): number {
		const courseTopics = topics.filter(t => {
			const level = levels.find(l => l.id === t.level_id);
			return level?.course_id === courseId;
		});

		if (courseTopics.length === 0) return 0;

		const completedTopics = courseTopics.filter(t => t.is_completed);
		return Math.round((completedTopics.length / courseTopics.length) * 100);
	}

	/**
	 * Get the next topic in sequence
	 */
	static getNextTopic(
		currentTopicId: string,
		topics: TopicWithProgress[],
		levels: LevelWithProgress[]
	): TopicWithProgress | null {
		const currentTopic = topics.find(t => t.id === currentTopicId);
		if (!currentTopic) return null;

		// Get all topics in the same course, sorted by level and topic order
		const currentLevel = levels.find(l => l.id === currentTopic.level_id);
		if (!currentLevel) return null;

		const courseTopics = topics
			.filter(t => {
				const level = levels.find(l => l.id === t.level_id);
				return level?.course_id === currentLevel.course_id;
			})
			.sort((a, b) => {
				const levelA = levels.find(l => l.id === a.level_id);
				const levelB = levels.find(l => l.id === b.level_id);
				
				// Sort by level order first, then topic order
				if (levelA && levelB && levelA.order_number !== levelB.order_number) {
					return levelA.order_number - levelB.order_number;
				}
				return a.order_number - b.order_number;
			});

		const currentIndex = courseTopics.findIndex(t => t.id === currentTopicId);
		if (currentIndex === -1 || currentIndex >= courseTopics.length - 1) {
			return null; // Last topic or not found
		}

		return courseTopics[currentIndex + 1];
	}

	/**
	 * Get the previous topic in sequence
	 */
	static getPreviousTopic(
		currentTopicId: string,
		topics: TopicWithProgress[],
		levels: LevelWithProgress[]
	): TopicWithProgress | null {
		const currentTopic = topics.find(t => t.id === currentTopicId);
		if (!currentTopic) return null;

		const currentLevel = levels.find(l => l.id === currentTopic.level_id);
		if (!currentLevel) return null;

		const courseTopics = topics
			.filter(t => {
				const level = levels.find(l => l.id === t.level_id);
				return level?.course_id === currentLevel.course_id;
			})
			.sort((a, b) => {
				const levelA = levels.find(l => l.id === a.level_id);
				const levelB = levels.find(l => l.id === b.level_id);
				
				if (levelA && levelB && levelA.order_number !== levelB.order_number) {
					return levelA.order_number - levelB.order_number;
				}
				return a.order_number - b.order_number;
			});

		const currentIndex = courseTopics.findIndex(t => t.id === currentTopicId);
		if (currentIndex <= 0) {
			return null; // First topic or not found
		}

		return courseTopics[currentIndex - 1];
	}

	/**
	 * Validate that a topic belongs to the specified course
	 */
	static validateTopicBelongsToCourse(
		topicId: string,
		courseId: string,
		topics: TopicWithProgress[],
		levels: LevelWithProgress[]
	): boolean {
		const topic = topics.find(t => t.id === topicId);
		if (!topic) return false;

		const level = levels.find(l => l.id === topic.level_id);
		return level?.course_id === courseId;
	}

	/**
	 * Get all unlocked topics for a course
	 */
	static getUnlockedTopics(
		courseId: string,
		topics: TopicWithProgress[],
		levels: LevelWithProgress[],
		completedTopics: string[]
	): TopicWithProgress[] {
		const courseTopics = topics.filter(t => {
			const level = levels.find(l => l.id === t.level_id);
			return level?.course_id === courseId;
		});

		return courseTopics.filter(topic => 
			this.isTopicUnlocked(topic.id, courseTopics, completedTopics)
		);
	}

	/**
	 * Check if a level is completed
	 */
	static isLevelCompleted(
		levelId: string,
		topics: TopicWithProgress[]
	): boolean {
		const levelTopics = topics.filter(t => t.level_id === levelId);
		if (levelTopics.length === 0) return false;
		
		return levelTopics.every(t => t.is_completed);
	}

	/**
	 * Check if a course is completed
	 */
	static isCourseCompleted(
		courseId: string,
		topics: TopicWithProgress[],
		levels: LevelWithProgress[]
	): boolean {
		const courseTopics = topics.filter(t => {
			const level = levels.find(l => l.id === t.level_id);
			return level?.course_id === courseId;
		});

		if (courseTopics.length === 0) return false;
		return courseTopics.every(t => t.is_completed);
	}

	/**
	 * Get course status based on progress
	 */
	static getCourseStatus(
		courseId: string,
		topics: TopicWithProgress[],
		levels: LevelWithProgress[]
	): "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" {
		const courseTopics = topics.filter(t => {
			const level = levels.find(l => l.id === t.level_id);
			return level?.course_id === courseId;
		});

		if (courseTopics.length === 0) return "NOT_STARTED";

		const completedTopics = courseTopics.filter(t => t.is_completed);
		const inProgressTopics = courseTopics.filter(t => t.status === "in_progress");

		if (completedTopics.length === courseTopics.length) {
			return "COMPLETED";
		} else if (completedTopics.length > 0 || inProgressTopics.length > 0) {
			return "IN_PROGRESS";
		} else {
			return "NOT_STARTED";
		}
	}

	/**
	 * Find the current topic for a user in a course
	 */
	static findCurrentTopic(
		courseId: string,
		topics: TopicWithProgress[],
		levels: LevelWithProgress[],
		completedTopics: string[]
	): TopicWithProgress | null {
		const courseTopics = topics
			.filter(t => {
				const level = levels.find(l => l.id === t.level_id);
				return level?.course_id === courseId;
			})
			.sort((a, b) => {
				const levelA = levels.find(l => l.id === a.level_id);
				const levelB = levels.find(l => l.id === b.level_id);
				
				if (levelA && levelB && levelA.order_number !== levelB.order_number) {
					return levelA.order_number - levelB.order_number;
				}
				return a.order_number - b.order_number;
			});

		// Find the first incomplete topic that is unlocked
		for (const topic of courseTopics) {
			if (!completedTopics.includes(topic.id) && 
				this.isTopicUnlocked(topic.id, courseTopics, completedTopics)) {
				return topic;
			}
		}

		// If all topics are completed, return the last topic
		return courseTopics[courseTopics.length - 1] || null;
	}

	/**
	 * Get learning statistics for debugging
	 */
	static getProgressStats(
		courseId: string,
		topics: TopicWithProgress[],
		levels: LevelWithProgress[],
		completedTopics: string[]
	) {
		const courseTopics = topics.filter(t => {
			const level = levels.find(l => l.id === t.level_id);
			return level?.course_id === courseId;
		});

		const unlockedTopics = this.getUnlockedTopics(courseId, topics, levels, completedTopics);
		const completedCount = completedTopics.length;
		const progressPercentage = this.calculateCourseProgress(courseId, topics, levels);

		return {
			totalTopics: courseTopics.length,
			completedTopics: completedCount,
			unlockedTopics: unlockedTopics.length,
			progressPercentage,
			currentTopic: this.findCurrentTopic(courseId, topics, levels, completedTopics),
			courseStatus: this.getCourseStatus(courseId, topics, levels)
		};
	}
}