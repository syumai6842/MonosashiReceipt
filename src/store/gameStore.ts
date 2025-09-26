import { create } from "zustand";
import { createDeck, draw, Deck } from "@/lib/deck";

export type ValueCard = { id: string; label: string };

type GameState = {
	seed: string;
	deck: Deck | null;
	hand: string[]; // 4枚
	incoming?: string; // 1枚
	all: Record<string, ValueCard>;
	discardedIds: string[];
	status: "idle" | "dealing" | "choosing" | "finished";
	justFinished: boolean;
	init: (values: ValueCard[], seed: string) => void;
	discard: (id: string) => void;
	consumeFinishedFlag: () => void;
	moveBetweenLists: (from: "kept" | "discarded", to: "kept" | "discarded", id: string, index?: number) => void;
	reorder: (list: "kept" | "discarded", fromIndex: number, toIndex: number) => void;
	swapBetweenLists: (from: "kept" | "discarded", to: "kept" | "discarded", draggedId: string, targetId: string) => void;
};

export const useGameStore = create<GameState>((set, get) => ({
	seed: "",
	deck: null,
	hand: [],
	incoming: undefined,
	all: {},
	discardedIds: [],
	status: "idle",
	justFinished: false,
	init: (values, seed) => {
		const allRecord = Object.fromEntries(values.map((v) => [v.id, v]));
		const deck = createDeck(values.map((v) => v.id), seed);
		// 最初に4枚配り、次をincomingへ
		let d = deck;
		const hand: string[] = [];
		for (let i = 0; i < 4; i += 1) {
			const r = draw(d);
			if (r.card) hand.push(r.card);
			d = r.deck;
		}
		const r2 = draw(d);
		set({
			seed,
			deck: r2.deck,
			hand,
			incoming: r2.card,
			all: allRecord,
			discardedIds: [],
			status: "choosing",
			justFinished: false,
		});
	},
	discard: (id) => {
		const { hand, incoming, deck, discardedIds } = get();
		if (!deck) return;

		let nextHand = hand;
		let thrown: string | undefined;
		if (hand.includes(id)) {
			// 手札のカードを捨てた → incomingで補充
			nextHand = hand.filter((x) => x !== id);
			thrown = id;
			if (incoming) nextHand = [...nextHand, incoming];
		} else if (incoming === id) {
			// 新しく配られたカードを捨てた → 手札はそのまま
			nextHand = hand.slice();
			thrown = id;
		}

		const r = draw(deck);
		const finished = !r.card;
		set({
			hand: nextHand,
			incoming: r.card,
			deck: r.deck,
			discardedIds: thrown ? [...discardedIds, thrown] : discardedIds,
			status: finished ? "finished" : "choosing",
			justFinished: finished,
		});
	},
	consumeFinishedFlag: () => set({ justFinished: false }),
	moveBetweenLists: (from, to, id, index) => {
		const { hand, discardedIds } = get();
		if (from === to) return;
		if (from === "kept") {
			// remove from hand
			const newHand = hand.filter((x) => x !== id);
			const insertAt = index ?? discardedIds.length;
			const newDiscarded = [...discardedIds];
			newDiscarded.splice(insertAt, 0, id);
			set({ hand: newHand, discardedIds: newDiscarded });
		} else {
			const newDiscarded = discardedIds.filter((x) => x !== id);
			const insertAt = index ?? hand.length;
			const newHand = [...hand];
			newHand.splice(insertAt, 0, id);
			set({ hand: newHand, discardedIds: newDiscarded });
		}
	},
	reorder: (list, fromIndex, toIndex) => {
		const { hand, discardedIds } = get();
		if (list === "kept") {
			const arr = [...hand];
			const [item] = arr.splice(fromIndex, 1);
			arr.splice(toIndex, 0, item);
			set({ hand: arr });
		} else {
			const arr = [...discardedIds];
			const [item] = arr.splice(fromIndex, 1);
			arr.splice(toIndex, 0, item);
			set({ discardedIds: arr });
		}
	},
	swapBetweenLists: (from, to, draggedId, targetId) => {
		const { hand, discardedIds } = get();
		if (from === to) return; // 同一リストの入替はここでは扱わない
		if (from === "kept" && to === "discarded") {
			const fromIdx = hand.indexOf(draggedId);
			const toIdx = discardedIds.indexOf(targetId);
			if (fromIdx < 0 || toIdx < 0) return;
			const newHand = [...hand];
			const newDiscarded = [...discardedIds];
			newHand.splice(fromIdx, 1);
			newDiscarded.splice(toIdx, 1);
			newHand.splice(fromIdx, 0, targetId);
			newDiscarded.splice(toIdx, 0, draggedId);
			set({ hand: newHand, discardedIds: newDiscarded });
		} else if (from === "discarded" && to === "kept") {
			const fromIdx = discardedIds.indexOf(draggedId);
			const toIdx = hand.indexOf(targetId);
			if (fromIdx < 0 || toIdx < 0) return;
			const newHand = [...hand];
			const newDiscarded = [...discardedIds];
			newDiscarded.splice(fromIdx, 1);
			newHand.splice(toIdx, 1);
			newDiscarded.splice(fromIdx, 0, targetId);
			newHand.splice(toIdx, 0, draggedId);
			set({ hand: newHand, discardedIds: newDiscarded });
		}
	},
}));
