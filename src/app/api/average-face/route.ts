import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	let apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		return new Response("OPENAI_API_KEY not configured", { status: 500 });
	}
	
	// APIキーから中括弧を除去
	apiKey = apiKey.replace(/[{}]/g, '');
	
	const body = await req.json().catch(() => ({ words: [] }));
	const { words } = body;
	
	if (!words || !Array.isArray(words) || words.length === 0) {
		return new Response("words array is required", { status: 400 });
	}
	
	// values.jsonから価値観データを取得
	let valuesData;
	try {
		const valuesResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/data/values.json`);
		valuesData = await valuesResponse.json();
	} catch (error) {
		console.error("Failed to fetch values data:", error);
		return new Response("Failed to fetch values data", { status: 500 });
	}

	// 各単語に対応する哲学者を取得
	const referencedPhilosophers = words
		.map(word => {
			const valueData = valuesData.find((v: any) => v.label === word);
			return valueData ? valueData.philosophers : ["Socrates"];
		})
		.flat()
		.filter((philosopher, index, array) => array.indexOf(philosopher) === index); // 重複除去

	// 単語を組み合わせてプロンプトを作成
	const prompt = `Create a black and white professional portrait photograph of a philosopher's face that synthesizes the essence of these philosophical concepts: ${words.join(", ")}. 

Reference and blend the distinctive features of these philosophers who embodied these values: ${referencedPhilosophers.join(", ")}.

Technical specifications:
- Style: Monochrome studio photography, realistic and detailed
- Composition: Close-up portrait, head and shoulders framing
- Lighting: Dramatic black and white lighting with strong contrast
- Background: Clean, neutral dark background
- Expression: Thoughtful, contemplative, and wise demeanor
- Camera angle: Slightly above eye level, looking directly at camera
- Color tone: High contrast black and white photography
- Quality: Professional portrait quality, sharp focus on facial features

The face should be a harmonious synthesis of the referenced philosophers, embodying the philosophical depth and wisdom associated with these concepts: ${words.join(", ")}.`;
	
	try {
		const response = await fetch("https://api.openai.com/v1/images/generations", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "dall-e-3",
				prompt: prompt,
				n: 1,
				size: "1024x1024",
				quality: "standard",
				response_format: "b64_json"
			}),
		});
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error("OpenAI API error:", errorText);
			return new Response(`OpenAI API error: ${response.status}`, { status: response.status });
		}
		
		const data = await response.json();
		const imageData = data.data[0].b64_json;
		const imageBuffer = Buffer.from(imageData, 'base64');
		
		return new Response(imageBuffer, {
			status: 200,
			headers: { "Content-Type": "image/png" },
		});
	} catch (error) {
		console.error("Error calling OpenAI API:", error);
		return new Response("Internal server error", { status: 500 });
	}
}




