export interface ProfileData {
	name?: string;
	email?: string;
	created_at?: string;
	grey_points?: number;
}

// TODO: Do we need both Application and ContributorApplication? Consider consolidation

export interface Application {
	id: string;
	status: "pending" | "approved" | "rejected";
	created_at: string;
	feedback?: string | null;
	public_links?: string | null;
	is_accredited_expert?: boolean;
}

export interface ContributorApplication {
	id: string;
	user_id: string;
	is_accredited_expert: boolean;
	feedback?: string;
	public_links: string;
	status: "pending" | "approved" | "rejected";
	created_at: string;
	admin_notes?: string;
	reviewed_at?: string;
	profiles?: ProfileData;
	activities_rated_count?: number;
	grey_points?: number;
	days_as_user?: number;
}
