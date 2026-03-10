export type AdminStateChange = {
	[key: string]: string | number | boolean | null | AdminStateChange;
};

export type AdminLog = {
	id: string;
	admin_id: string;
	admin_name: string | null;
	action_type: string;
	entity_type: string;
	entity_id: string | null;
	details: string | null;
	created_at: string;
	previous_state: AdminStateChange | null;
	new_state: AdminStateChange | null;
	ip_address: string | null;
};
