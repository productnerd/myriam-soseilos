import React from "react";
import { Badge } from "@/components/ui/data/Badge";

interface ProfileBadgesProps {
	tags: string[] | null | undefined;
	onFlagClick: () => void;
	onEmojiClick: () => void;
}

const ProfileBadges: React.FC<ProfileBadgesProps> = ({ tags }) => {
	return (
		<div className="flex flex-wrap gap-2">
			{tags && tags.length > 0 ? (
				tags.map((tag, index) => (
					<Badge
						key={index}
						className="text-xs uppercase font-semibold px-2 py-0 h-5"
						style={{
							backgroundColor: getTagColor(tag),
							color: "white",
						}}
					>
						{tag}
					</Badge>
				))
			) : (
				<div className="text-xs text-muted-foreground">No tags</div>
			)}
		</div>
	);
};

const getTagColor = (tag: string) => {
	const colors = [
		"#FF6B6B",
		"#4ECDC4",
		"#556FB5",
		"#E84A5F",
		"#F7B801",
		"#7A77B9",
		"#3D84A8",
		"#46CDCF",
		"#FF9A76",
		"#34A29F",
	];

	let hash = 0;
	for (let i = 0; i < tag.length; i++) {
		hash = tag.charCodeAt(i) + ((hash << 5) - hash);
	}

	return colors[Math.abs(hash) % colors.length];
};

export default ProfileBadges;
