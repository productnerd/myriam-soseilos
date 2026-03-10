import { UserDataWithError, ProcessedUserData } from "../types";

interface RawUserData {
	id: string;
	name?: string | null;
	email?: string | null;
	thumbnail?: string | null;
	grey_points?: number;
	dark_points?: number;
	flag?: string | null;
	tags?: string[];
}

/**
 * Process and validate user data from submission
 */
export function processUserData(
	user: RawUserData | null | undefined,
	userId: string
): ProcessedUserData {
	const hasValidUserData = user && typeof user === "object" && "id" in user;

	let userData: UserDataWithError;

	if (hasValidUserData) {
		userData = {
			id: user.id,
			name: user.name || "Unknown User",
			email: user.email,
			thumbnail: user.thumbnail,
			grey_points: user.grey_points || 0,
			dark_points: user.dark_points || 0,
			flag: user.flag,
			tags: user.tags || [],
		};
	} else {
		userData = {
			id: userId,
			name: "Unknown User",
			email: null,
			thumbnail: null,
			grey_points: 0,
			dark_points: 0,
			flag: null,
			tags: [],
			error: true,
		};
	}

	return { userData, hasValidUserData };
}
