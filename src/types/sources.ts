export type SourceType = "book" | "podcast" | "paper" | "talk";

export interface Source {
	id: string;
	title: string;
	author: string;
	source_type: SourceType;
	image_url?: string;
}

// TODO: This is not used anywhere
export interface CourseSource {
	id: string;
	course_id: string;
	source_id: string;
	source?: Source;
}
