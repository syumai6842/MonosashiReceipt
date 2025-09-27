export async function generateAverageFace(words: string[]): Promise<Blob> {
	const res = await fetch("/api/average-face", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ words }),
	});
	if (!res.ok) {
		throw new Error(`face api error ${res.status}`);
	}
	return await res.blob();
}


