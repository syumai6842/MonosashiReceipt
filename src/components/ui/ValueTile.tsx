"use client";

import clsx from "classnames";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
};

export default function ValueTile({ children, className }: Props) {
	return (
		<div
			className={clsx(
				"w-full min-w-[140px] aspect-[4/3] rounded-2xl bg-white text-black shadow border border-black/10",
				"flex items-center justify-center text-[clamp(20px,6vw,30px)] font-extrabold select-none shrink-0",
				className
			)}
		>
			{children}
		</div>
	);
}
