import seedrandom from "seedrandom";

export function shuffleWithSeed<T>(items: T[], seed: string): T[] {
	const rng = seedrandom(seed);
	const arr = [...items];
	for (let i = arr.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export type Deck = { ids: string[]; index: number };

export function createDeck(ids: string[], seed: string): Deck {
	return { ids: shuffleWithSeed(ids, seed), index: 0 };
}

export function draw(deck: Deck): { card?: string; deck: Deck } {
	if (deck.index >= deck.ids.length) return { deck };
	const card = deck.ids[deck.index];
	return { card, deck: { ...deck, index: deck.index + 1 } };
}
