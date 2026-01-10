import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
	try {
		// Check if API key is configured
		const apiKey = process.env.GROQ_API_KEY;
		console.log(
			"🔑 Groq API Key status:",
			apiKey ? "✅ Configured" : "❌ Missing",
		);

		if (!apiKey) {
			console.error("❌ GROQ_API_KEY is not set!");
			return new Response(
				JSON.stringify({
					error: "API key not configured",
					message:
						"Please add GROQ_API_KEY to .env.local - Get your free key at https://console.groq.com/keys",
				}),
				{ status: 500, headers: { "Content-Type": "application/json" } },
			);
		}

		interface GameState {
			health?: number;
			hunger?: number;
			hygiene?: number;
			money?: number;
			time?: number;
			[key: string]: unknown;
		}

		const body = await req.json();
		console.log("📨 Received Body Keys:", Object.keys(body));

		// Handle various possible payload structures
		let { messages, gameState } = body || {};

		// Fallback for singular 'message' usage or missing array
		if (!messages || !Array.isArray(messages)) {
			console.warn(
				"⚠️ 'messages' array missing or invalid. Checking fallback...",
			);
			if (body.message) {
				// If singular message is sent
				messages = [
					{
						role: "user",
						content:
							typeof body.message === "string"
								? body.message
								: JSON.stringify(body.message),
					},
				];
			} else if (body.prompt) {
				// Legacy Vercel AI usage
				messages = [{ role: "user", content: body.prompt }];
			} else {
				messages = [];
			}
		}

		console.log("📨 Processed messages count:", messages.length);
		console.log("🎮 Game state:", gameState);

		const systemPrompt = `
      Você é um especialista em sobrevivência urbana em Campinas, focado em ajudar pessoas em situação de vulnerabilidade extrema (fome, frio, perigo).

      REGRAS DE RESPOSTA (AUDIO-FIRST):
      1. SEJA BRUTALMENTE BREVE. Máximo de 2 frases curtas.
      2. NUNCA use saudações robóticas como "Olá", "Como posso ajudar" ou "Entendi".
      3. Dê a informação vital IMEDIATAMENTE: Local, Horário e a Regra principal.
      4. Tom: Firme, experiente, "Rualogia" pura.

      DADOS REAIS (CAMPINAS):
      - SAMIM: Fecha às 19h (portão rigoroso). 
      - Bom Prato: Almoço R$ 1,00 (chegar às 10h pra senha).
      - Perigo: Oriente ir para o Centro Pop ou áreas iluminadas.

      ESTADO DO JOGADOR:
      - Saúde/Fome/Higiene: ${gameState?.health}/${gameState?.hunger}/${gameState?.hygiene}
      - Dinheiro: R$ ${gameState?.money} | Hora: ${gameState?.time}:00

      Exemplo: "Bom Prato Centro. Almoço por R$ 1,00. Chegue antes das 10h pra pegar senha."
    `;

		console.log("🤖 Calling Groq API with Llama 3.3 70B...");
		const result = await streamText({
			model: groq("llama-3.3-70b-versatile"),
			system: systemPrompt,
			messages: messages.map((m: any) => ({
				role: m.role,
				content: m.content,
			})),
		});

		console.log("✅ Groq stream created, sending generic stream response");
		return result.toTextStreamResponse();
	} catch (error) {
		console.error("❌ API Error DETAILS:", error);
		console.error(
			"Error stack:",
			error instanceof Error ? error.stack : "No stack",
		);
		return new Response(
			JSON.stringify({
				error: "Internal Server Error",
				details: String(error),
				message: error instanceof Error ? error.message : "Unknown error",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
}
