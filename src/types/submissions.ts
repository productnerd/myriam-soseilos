
export interface BaseSubmission {
	id: string;
	user_id: string;
	status: "pending" | "approved" | "rejected";
	admin_comment: string | null;
	created_at: string;
	updated_at: string;
}
