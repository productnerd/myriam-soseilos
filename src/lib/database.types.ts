export interface Database {
	public: {
		Tables: {
			cards: {
				Row: {
					id: string;
					name: string;
					image_url: string;
					hp: number;
					type: string;
					class: string;
					created_at: string;
					updated_at: string;
				};
			};
		};
	};
}
