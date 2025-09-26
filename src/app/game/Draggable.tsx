"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

type Props = { id: string; children: ReactNode };

export default function Draggable({ id, children }: Props) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
	const style = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.5 : 1,
		position: "relative" as const,
		zIndex: isDragging ? 100 : 1,
		touchAction: "none" as const,
	};
	return (
		<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
			{children}
		</div>
	);
}
