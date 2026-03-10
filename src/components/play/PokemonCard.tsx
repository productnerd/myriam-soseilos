import React, { useEffect, useRef } from "react";
import "@/styles/card-base.css";
import "@/styles/card-effects.css";
import "@/styles/card-animations.css";

interface PokemonCardProps {
	name: string;
	imageUrl: string;
	hp: number;
	type: string;
	cardClass: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name, imageUrl, hp, type, cardClass }) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const card = cardRef.current;
		const inner = innerRef.current;

		if (!card || !inner) return;

		const handleMouseMove = (e: MouseEvent) => {
			const rect = card.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			const mouseX = e.clientX;
			const mouseY = e.clientY;

			// Calculate rotation (max 15 degrees)
			const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 15;
			const rotateX = ((centerY - mouseY) / (rect.height / 2)) * 15;

			// Calculate shine angle based on mouse position
			const shine = inner.querySelector(".card__shine") as HTMLElement;
			if (shine) {
				const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
				shine.style.setProperty("--shine-angle", `${angle + 90}deg`);
			}

			// Apply the transform to the card
			card.style.setProperty("--rotate-x", `${rotateX}deg`);
			card.style.setProperty("--rotate-y", `${rotateY}deg`);
		};

		const handleMouseLeave = () => {
			// Reset transforms
			card.style.setProperty("--rotate-x", "0");
			card.style.setProperty("--rotate-y", "0");
		};

		// Add event listeners
		card.addEventListener("mousemove", handleMouseMove);
		card.addEventListener("mouseleave", handleMouseLeave);

		// Clean up
		return () => {
			card.removeEventListener("mousemove", handleMouseMove);
			card.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	return (
		<div className="card" ref={cardRef}>
			<div className={`card__inner ${cardClass}`} ref={innerRef}>
				<div className="card__shine"></div>
				<div className="card__glare"></div>

				<div className="card__front">
					<div className="card__header">
						<div className="card__title">
							<span className="card__stage">Basic</span>
							<h2 className="card__name">{name}</h2>
						</div>
						<div className="card__hp">
							<span>HP</span>
							<span className="card__hp-value">{hp}</span>
							<span className="card__type">{type}</span>
						</div>
					</div>

					<div className="card__image">
						<img src={imageUrl} alt={name} loading="lazy" />
					</div>

					<div className="card__stats">
						<span className="card__stat">weakness</span>
						<span className="card__stat">resistance</span>
						<span className="card__stat">retreat cost</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PokemonCard;
