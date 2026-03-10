export interface FriendScore {
	id: string;
	name: string | null;
	avatar_url: string | null;
	score: number;
}

// Level test type
export type LevelTest = {
	id: string;
	title: string;
	description?: string;
	level_id?: string;
	score?: number;
	passed?: boolean;
	test_type?: string;
};
