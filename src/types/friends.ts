export type Friend = {
	id: string;
	name: string | null;
	email: string | null;
	dark_points: number | null;
	grey_points: number | null;
	streak: number | null;
	thumbnail: string | null;
	flag: string | null;
	favorite_emoji: string | null;
	invited: boolean;
};
