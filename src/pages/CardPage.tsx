import { useEffect, useState } from "react";
import PokemonCard from "@/components/play/PokemonCard";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/lib/database.types";

export type Card = Database["public"]["Tables"]["cards"]["Row"];

const CardPage = () => {
	const [cards, setCards] = useState<Card[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCards = async () => {
			try {
				const { data, error } = await supabase.from("cards").select("*");

				if (error) {
					console.error("Error fetching cards:", error);
					setError(error.message);
					return;
				}

				if (data) {
					setCards(data);
				}
			} catch (err) {
				console.error("Error fetching cards:", err);
				setError("Failed to fetch cards");
			} finally {
				setLoading(false);
			}
		};

		fetchCards();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">Loading cards...</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen text-red-500">
				Error: {error}
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-8">
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold text-white mb-8 text-center">
					Pokémon Card Collection
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
					{cards.map((card) => (
						<div key={card.id} className="card-container flex justify-center">
							<PokemonCard
								name={card.name}
								imageUrl={card.image_url}
								hp={card.hp}
								type={card.type}
								cardClass={card.class}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CardPage;
