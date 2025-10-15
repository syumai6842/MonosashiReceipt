export async function generateAverageFace(words: string[]): Promise<Blob> {
	if (!words || words.length === 0) {
		throw new Error("単語が指定されていません");
	}
	
	const res = await fetch("/api/average-face", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ words }),
	});
	
	if (!res.ok) {
		let errorMessage = `顔生成APIエラー (${res.status})`;
		try {
			const errorText = await res.text();
			if (errorText) {
				errorMessage += `: ${errorText}`;
			}
		} catch {
			// エラーテキストの読み取りに失敗した場合はデフォルトメッセージを使用
		}
		throw new Error(errorMessage);
	}
	
	return await res.blob();
}




