export interface AnalyticsEvent {
	category: string;
	action: string;
	label?: string;
	value?: number;
}

export interface ScorePercentileResult {
	percentile: number;
	error?: Error;
}
