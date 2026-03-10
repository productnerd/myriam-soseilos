export interface FlowStore {
	flowPoints: number | null;
	isLoading: boolean;
	setFlowPoints: (points: number | null) => void;
	setIsLoading: (loading: boolean) => void;
	syncFlowPoints: (userId: string | null) => Promise<void>;
}

// NOTE : Should contain user-related properties
// such as name, email, or user object etc so it can be persisted.
export interface UserStore {
	hasCompletedInitialTest: boolean;
	setHasCompletedInitialTest: (hasCompleteInitialTest: boolean) => void;
}
