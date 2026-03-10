import React from "react";
import { Source, SourceType } from "@/types/sources";
import { Badge } from "@/components/ui/data/Badge";
import { Card, CardContent } from "@/components/ui/layout/Card";

interface SourceCardProps {
	source: Source;
}

const getTypeColor = (type: SourceType): string => {
	switch (type) {
		case "book":
			return "bg-amber-600";
		case "podcast":
			return "bg-teal-600";
		case "paper":
			return "bg-indigo-700";
		case "talk":
			return "bg-violet-600";
		default:
			return "bg-gray-600";
	}
};

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
	const typeColor = getTypeColor(source.source_type);

	// Use a default image if none provided
	const imgSrc = source.image_url || "/placeholder.svg";

	return (
		<Card className="w-full mb-4 bg-[#1A1A1A] border-0">
			<CardContent className="p-4">
				<div className="flex gap-4">
					<div className="w-24 h-24 shrink-0 overflow-hidden rounded-md bg-gray-800 flex items-center justify-center">
						<img
							src={imgSrc}
							alt={source.title}
							className="w-full h-full object-cover"
							loading="lazy"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = "/placeholder.svg";
							}}
						/>
					</div>

					<div className="flex flex-col">
						<Badge className={`self-start capitalize text-white mb-2 ${typeColor}`}>
							{source.source_type}
						</Badge>

						<h3 className="text-xl font-bold mb-1">{source.title}</h3>

						<p className="text-lg italic text-gray-300">{source.author}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default SourceCard;
