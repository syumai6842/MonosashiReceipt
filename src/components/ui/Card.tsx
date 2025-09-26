"use client";

import { ReactNode } from "react";
import clsx from "classnames";

type Props = {
	children: ReactNode;
	className?: string;
};

export default function Card({ children, className }: Props) {
	return (
		<div
			className={clsx(
				"bg-white text-black shadow border border-black/10 px-6 py-6 select-none shrink-0",
				className
			)}
		>
			{children}
		</div>
	);
}
