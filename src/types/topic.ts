export type Topic = {
	id: string;
	title: string;
	order_number: number;
	level_id: string;
	tags?: string[] | null;
	status?: string;
};
