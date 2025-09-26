"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import { useGameStore, ValueCard } from "@/store/gameStore";
import Draggable from "./Draggable";
import DroppableTrash from "./DroppableTrash";
import ValueTile from "@/components/ui/ValueTile";
import { useRouter } from "next/navigation";

const CARD_RADIUS = "rounded-2xl"; // 手札と同等

export default function GamePage() {
	const { hand, incoming, discard, init, status, all, deck, justFinished, consumeFinishedFlag } = useGameStore();
	const [loaded, setLoaded] = useState(false);
	const router = useRouter();

	useEffect(() => {
		fetch("/data/values.json")
			.then((r) => r.json())
			.then((arr: ValueCard[]) => init(arr, new Date().toISOString()))
			.finally(() => setLoaded(true));
	}, [init]);

	useEffect(() => {
		if (justFinished) {
			consumeFinishedFlag();
			router.push("/face");
		}
	}, [justFinished, consumeFinishedFlag, router]);

	function onDragEnd(e: DragEndEvent) {
		if (e.over?.id === "trash" && e.active?.id) {
			discard(String(e.active.id));
		}
	}

	const renderLabel = (id?: string) => (id ? all[id]?.label ?? id : "");
	const total = useMemo(() => Object.keys(all).length, [all]);
	const dealt = deck?.index ?? 0;
	const remain = Math.max(total - dealt, 0);
	const progress = total > 0 ? Math.min(1, dealt / total) : 0;

	return (
		<div className="min-h-screen bg-[#4b3f3f] text-white flex flex-col">
			<div className="flex-1 max-w-md mx-auto w-full relative pb-[120px] px-4">
				<h1 className="text-center text-2xl font-bold py-4">レシート</h1>

				{/* 進捗バー */}
				<div className="mb-3">
					<div className="h-2 bg-white/20 rounded-full overflow-hidden">
						<div className="h-full bg-white/80" style={{ width: `${progress * 100}%` }} />
					</div>
					<div className="flex justify-between text-xs mt-1 text-white/80">
						<span>配布 {dealt}/{total}</span>
						<span>残り {remain}</span>
					</div>
				</div>

				{!loaded && <div className="text-center py-10">読み込み中...</div>}
				{loaded && (
					<DndContext onDragEnd={onDragEnd}>
						{/* 上: 新カードスロット（手札カード1枚分サイズ） */}
						<div className="mt-4 mb-6 flex items-center justify-center">
							<div className={`border-[4px] border-dashed border-white/70 ${CARD_RADIUS} aspect-[4/3] w-[calc(50%-0.5rem)] flex items-center justify-center`}>
								{incoming ? (
									<Draggable id={incoming}>
										<div className="w-[70%] h-[70%]">
											<ValueTile>{renderLabel(incoming)}</ValueTile>
										</div>
									</Draggable>
								) : (
									<div className="w-[70%] h-[70%]">
										<ValueTile className="text-white/60 bg-transparent border-white/30">配り終え</ValueTile>
									</div>
								)}
							</div>
						</div>

						{/* 中央: 手札4枚 */}
						<div className="grid grid-cols-2 gap-4">
							{hand.map((id) => (
								<Draggable key={id} id={id}>
									<ValueTile>{renderLabel(id)}</ValueTile>
								</Draggable>
							))}
						</div>

						<p className="text-center mt-6 text-white/90">一つ選んで捨ててください</p>

						<DroppableTrash id="trash" />

						{status === "finished" && (
							<div className="text-center mt-4">配り終えました。顔を生成しています...</div>
						)}
					</DndContext>
				)}
			</div>
		</div>
	);
}
