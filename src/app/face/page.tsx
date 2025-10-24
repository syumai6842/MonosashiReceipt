"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useGameStore } from "@/store/gameStore";
import { generateAverageFace } from "@/lib/faceClient";
import { countPhilosophers } from "@/lib/philosopherUtils";
import Link from "next/link";

export default function FacePage() {
	const { hand, all } = useGameStore();
	const words = useMemo(() => hand.map((id) => all[id]?.label).filter(Boolean) as string[], [hand, all]);
	const philosophers = useMemo(() => countPhilosophers(words), [words]);
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
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : "生成に失敗しました");
		} finally {
			setLoading(false);
		}
	}, [words]);

	useEffect(() => {
		run();
	}, [run]);

	useEffect(() => {
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [url]);

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
						{/* 反映された哲学者リスト */}
			<div className="mt-6 w-full max-w-sm">
			<h2 className="text-lg font-bold mb-2 text-center">反映された哲学者</h2>
			{philosophers.length === 0 ? (
				<p className="text-center text-white/70">該当なし</p>
			) : (
				<ul className="space-y-2">
					{philosophers.map(({ name, count, description }) => (
						<li key={name} className="bg-black/20 rounded-lg px-3 py-2">
						<div className="flex justify-between">
							<span className="font-semibold">{name}</span>
							<span>{count}人</span>
						</div>
						<p className="text-sm text-white/80 mt-1 whitespace-pre-line">
							{description}
						</p>
						</li>
					))}
				</ul>

			)}
			</div>

			<div className="mt-4">
				<Link href="/receipt" className="rounded-xl bg-white text-black px-6 py-3 font-bold">レシートを見る</Link>
			</div>
			<p className="mt-3 text-white/80 text-sm">キーワード: {words.join("・")}</p>
		</div>
	);
}
