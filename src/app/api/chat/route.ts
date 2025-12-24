import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

export const maxDuration = 30;

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
      Você é o Mestre de Jogo (Game Master) de um Serious Game sobre população em situação de rua em Campinas.
      
      ESTADO ATUAL DO JOGADOR:
      - Saúde: ${gameState?.health ?? 100}
      - Fome: ${gameState?.hunger ?? 100} (0 = Faminto)
      - Higiene: ${gameState?.hygiene ?? 50}
      - Dinheiro: R$ ${gameState?.money ?? 0}
      - Hora: ${gameState?.time ?? 8}:00
      
      SUAS REGRAS:
      1. Seja realista e cru, mas não cruel gratuitamente.
      2. Responda em Português do Brasil.
      3. Mantenha as respostas curtas (máximo 3 frases) para leitura rápida no celular.
      4. Se o jogador fizer uma ação, descreva a consequência baseada nos stats dele.
      5. Ofereça sempre 2 ou 3 opções de próxima ação implícitas na narrativa.

      Exemplo: "Você caminha pela Rua 13 de Maio. O cheiro de salgado de uma lanchonete te lembra que você não come há horas. Um segurança te observa com desconfiança. O que você faz?"
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
