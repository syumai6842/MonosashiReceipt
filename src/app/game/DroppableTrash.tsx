"use client";

import { useDroppable } from "@dnd-kit/core";

type Props = { id: string };

export default function DroppableTrash({ id }: Props) {
	const { setNodeRef, isOver } = useDroppable({ id });
	return (
		<div
			ref={setNodeRef}
			className={`fixed left-0 right-0 bottom-0 h-[96px] flex items-center justify-center shadow-2xl transition-colors ${
				isOver ? "bg-[#ff6b6b]" : "bg-[#f24b4b]"
			}`}
		>
			<span className="material-symbols-outlined text-white text-4xl" style={{ fontFamily: 'Material Symbols Outlined' }}>delete</span>
		</div>
	);
}
