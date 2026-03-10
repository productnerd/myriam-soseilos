
import { QuestSubmissionGroup, QuestSubmission } from "@/types/quests";
import { UserDataWithError } from "@/types/user";

export type QuestSubmissionsQueryResult = {
	submissionGroups: QuestSubmissionGroup[];
	selectedSubmissions: QuestSubmission[];
	isLoading: boolean;
	error: Error | null;
};

export type ProcessedUserData = {
	userData: UserDataWithError;
	hasValidUserData: boolean;
};

export type { UserDataWithError };
