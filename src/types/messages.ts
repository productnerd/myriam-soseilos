
export interface UserMessage {
	id: string;
	title: string;
	payload: string;
	tag: string;
	created_at: string;
	read_at: string | null;
	is_read: boolean;
	image_url?: string | null;
}

export interface ChatMessage {
	text: string;
	isBot: boolean;
	isSkillsList?: boolean;
	isFlag?: boolean;
	isEmoji?: boolean;
}
