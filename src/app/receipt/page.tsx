"use client";

import { useGameStore } from "@/store/gameStore";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";
import Draggable from "../game/Draggable";
import Link from "next/link";

// コンテナは純粋なスタイル用（ドロップ不可）
function SectionBox({ children }: { children: React.ReactNode }) {
	return <div className="p-3 bg-white/10 rounded-xl min-h-[240px]">{children}</div>;
}

function ItemDroppable({ list, id, children }: { list: "kept" | "discarded"; id: string; children: React.ReactNode }) {
	const { setNodeRef, isOver } = useDroppable({ id: `${list}:${id}` });
	return (
		<div ref={setNodeRef} className={`${isOver ? "outline outline-2 outline-white/60" : ""} rounded-lg`}>{children}</div>
	);
}

export default function ReceiptPage() {
	const { hand, discardedIds, all, swapBetweenLists } = useGameStore();

	const kept = useMemo(() => hand, [hand]);
	const discarded = useMemo(() => discardedIds, [discardedIds]);

	function onDragEnd(e: DragEndEvent) {
		const draggedId = String(e.active.id);
		const overId = e.over?.id as string | undefined;
		if (!overId || !overId.includes(":")) return; // アイテム以外にはドロップ不可

		const [targetList, targetItemId] = overId.split(":") as ["kept" | "discarded", string];
		const fromList: "kept" | "discarded" = kept.includes(draggedId) ? "kept" : "discarded";

		if (targetList !== fromList) {
			// リスト間: アイテム同士を入れ替える
			swapBetweenLists(fromList, targetList, draggedId, targetItemId);
		}
	}

	return (
		<div className="min-h-screen bg-[#4b3f3f] text-white px-4 py-6">
			<h1 className="text-2xl font-bold mb-4 text-center">レシート</h1>
			<DndContext onDragEnd={onDragEnd}>
				<p className="mt-4 text-sm text-white/70 text-center leading-relaxed">
					キーワードを入れ替えると、生成される顔も変わります。
				</p>
				<div className="flex flex-col gap-6">
					<SectionBox>
						<h2 className="font-semibold mb-2">残した4つ</h2>
						<ul className="flex flex-col gap-2">
							{kept.map((id) => (
								<li key={id}>
									<ItemDroppable list="kept" id={id}>
										<Draggable id={id}>
											<div className="cursor-move rounded-lg bg-white text-black px-3 py-3 select-none">
												{all[id]?.label ?? id}
											</div>
										</Draggable>
									</ItemDroppable>
								</li>
							))}
						</ul>
					</SectionBox>
					<SectionBox>
						<h2 className="font-semibold mb-2">捨てたもの</h2>
						<ul className="flex flex-col gap-2">
							{discarded.map((id) => (
								<li key={id}>
									<ItemDroppable list="discarded" id={id}>
										<Draggable id={id}>
											<div className="cursor-move rounded-lg bg-white text-black px-3 py-3 select-none">
												{all[id]?.label ?? id}
											</div>
										</Draggable>
									</ItemDroppable>
								</li>
							))}
						</ul>
					</SectionBox>
					<div className="mt-4 flex justify-center">
						<Link href="/face" className="rounded-xl bg-white text-black px-6 py-3 font-bold">顔を見る</Link>
					</div>
				</div>
			</DndContext>
		</div>
	);
}
