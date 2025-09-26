import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const service = process.env.SERVICE_URL;
	if (!service) {
		return new Response("SERVICE_URL not configured", { status: 500 });
	}
	const body = await req.json().catch(() => ({ words: [] }));
	const res = await fetch(`${service}/average-face`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const text = await res.text();
		return new Response(text || "upstream error", { status: res.status });
	}
	const arrayBuffer = await res.arrayBuffer();
	return new Response(arrayBuffer, {
		status: 200,
		headers: { "Content-Type": "image/png" },
	});
}
