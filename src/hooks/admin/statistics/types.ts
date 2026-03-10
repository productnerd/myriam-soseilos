export type StatisticValue =
	| number
	| string
	| boolean
	| { [key: string]: StatisticValue }
	| StatisticValue[];

export type PlatformStatistic = {
	id: string;
	stat_key: string;
	stat_value: StatisticValue;
	calculated_at: string;
};

export type DailyActiveUsers = {
	count: number;
	previous_count?: number;
	percentage_change?: number;
};

export type MonthlyActiveUsers = {
	count: number;
	previous_count?: number;
	percentage_change?: number;
};

export type PopularSkill = {
	skill: string;
	count: number;
};

export type PopularCourse = {
	course_id: string;
	title: string;
	user_count: number;
	enrollment_percentage?: number;
	average_score: number;
};

export type TopicsPerUser = {
	average: number;
	previous_average?: number;
	percentage_change?: number;
};

export type ReferralRate = {
	percentage: number;
	previous_percentage?: number;
	percentage_change?: number;
};

export type ActivationRate = {
	percentage: number;
	previous_percentage?: number;
	percentage_change?: number;
};

export type OnboardingCompletionRate = {
	percentage: number;
	previous_percentage?: number;
	percentage_change?: number;
};

export type NewUserSignups = {
	count: number;
	previous_count?: number;
	percentage_change?: number;
};

export type ChurnRate = {
	percentage: number;
	previous_percentage?: number;
	percentage_change?: number;
};

export type SidequestCompletion = {
	sidequest_id: string;
	title: string;
	user_count: number;
	completed_count: number;
	completion_rate: number;
};

export type CountryStatistic = {
	country: string;
	count: number;
};
