import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/data/Skeleton";

interface Trivia {
	id: string;
	body: string;
	image_url: string | null;
	author_id: string | null;
	author_name?: string;
}

const TriviaDisplay = () => {
	const [trivia, setTrivia] = useState<Trivia | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRandomTrivia = async () => {
			try {
				// First get the count of trivia items
				const { count, error: countError } = await supabase
					.from("trivia")
					.select("*", { count: "exact", head: true });

				if (countError) {
					console.error("Error getting trivia count:", countError);
					setIsLoading(false);
					return;
				}

				if (!count || count === 0) {
					setIsLoading(false);
					return;
				}

				// Generate a random offset
				const randomOffset = Math.floor(Math.random() * count);

				// Get a random trivia fact
				const { data, error } = await supabase
					.from("trivia")
					.select(
						`
						id, 
						body, 
						image_url, 
						author_id,
						profiles:author_id (name)
					`
					)
					.range(randomOffset, randomOffset)
					.single();

				if (error) {
					console.error("Error fetching trivia:", error);
					setIsLoading(false);
					return;
				}

				if (data) {
					// Format the data to include author name
					const triviaWithAuthor: Trivia = {
						id: data.id,
						body: data.body,
						image_url: data.image_url,
						author_id: data.author_id,
						author_name: data.profiles?.name || "Anonymous",
					};

					setTrivia(triviaWithAuthor);
				}
			} catch (error) {
				console.error("Unexpected error fetching trivia:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRandomTrivia();
	}, []);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center mt-6 w-full max-w-md">
				<Skeleton className="h-4 w-3/4 mb-2" />
				<Skeleton className="h-4 w-4/5 mb-2" />
				<Skeleton className="h-20 w-32 mt-2" />
			</div>
		);
	}

	if (!trivia) {
		// If no trivia was found, return null to not display anything
		return null;
	}

	return (
		<div className="flex flex-col items-center mt-6 w-full max-w-md">
			<p className="text-sm text-center text-muted-foreground">{trivia.body}</p>

			{trivia.image_url && (
				<div className="mt-4 overflow-hidden">
					<img
						src={trivia.image_url}
						alt="Trivia illustration"
						className="max-w-[240px] h-auto object-contain rounded-md"
						loading="lazy"
					/>
				</div>
			)}

			{trivia.author_name && (
				<p className="text-xs text-center text-muted-foreground/50 mt-4">
					by {trivia.author_name}
				</p>
			)}
		</div>
	);
};

export default TriviaDisplay;
