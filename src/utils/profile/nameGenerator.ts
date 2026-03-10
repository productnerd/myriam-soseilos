/**
 * Name generation utilities
 */

const adjectives = [
	"Clever",
	"Bright",
	"Swift",
	"Bold",
	"Wise",
	"Quick",
	"Smart",
	"Sharp",
	"Keen",
	"Alert",
	"Witty",
	"Sage",
	"Agile",
	"Nimble",
	"Astute",
];

const nouns = [
	"Learner",
	"Scholar",
	"Student",
	"Explorer",
	"Seeker",
	"Thinker",
	"Mind",
	"Brain",
	"Genius",
	"Ace",
	"Pro",
	"Expert",
	"Master",
	"Whiz",
	"Star",
];

export function generateRandomName(): string {
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const noun = nouns[Math.floor(Math.random() * nouns.length)];
	const number = Math.floor(Math.random() * 100);

	return `${adjective}${noun}${number}`;
}
