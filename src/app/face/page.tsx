"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useGameStore } from "@/store/gameStore";
import { generateAverageFace } from "@/lib/faceClient";
import Link from "next/link";

export default function FacePage() {
	const { hand, all } = useGameStore();
	const words = useMemo(() => hand.map((id) => all[id]?.label).filter(Boolean) as string[], [hand, all]);
	const [url, setUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const run = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const blob = await generateAverageFace(words);
			setUrl((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return URL.createObjectURL(blob);
			});
		} catch (e: any) {
			setError(e?.message || "生成に失敗しました");
		} finally {
			setLoading(false);
		}
	}, [words.join(",")]);

	useEffect(() => {
		run();
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [run]);

	return (
		<div className="min-h-screen bg-[#4b3f3f] text-white flex flex-col items-center px-4 py-6">
			<h1 className="text-2xl font-bold mb-4">これが現在の哲学者のあなたです！</h1>
			<div className="w-full max-w-sm aspect-[3/4] bg-black/30 rounded-2xl overflow-hidden flex items-center justify-center">
				{url && !loading && !error && (
					<Image src={url} alt="face" width={512} height={680} className="object-cover w-full h-full" />
				)}
				{loading && <div className="p-4">生成中...</div>}
				{!loading && error && <div className="p-4 text-center">{error}</div>}
			</div>
			<div className="mt-4">
				<Link href="/receipt" className="rounded-xl bg-white text-black px-6 py-3 font-bold">レシートを見る</Link>
			</div>
			<p className="mt-3 text-white/80 text-sm">キーワード: {words.join("・")}</p>
		</div>
	);
}
