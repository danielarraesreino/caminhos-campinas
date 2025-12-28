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
      Você é o Mestre de Jogo (Game Master) de um Serious Game sobre população em situação de rua em Campinas.

      DADOS REAIS DE CAMPINAS (CENSO 2024) - USE OBRIGATORIAMENTE:
      - Demografia: 1.234 pessoas em situação de rua. 85% homens, 15% mulheres. 60% negros/pardos.
      - Trabalho: A maioria trabalha informalmente, principalmente na reciclagem ("Catadores"). A falta de oportunidades é a principal barreira.
      - ABRIGO (SAMIM): Regras rígidas. Fecha às 19h. Separa homens de mulheres (casais/famílias são separados). "Albergue Noturno".
      - ALIMENTAÇÃO (Bom Prato): Almoço R$ 1,00. Café R$ 0,50. Filas longas sob o sol.
      - HIGIENE: Banheiros químicos ou públicos são escassos e fecham à noite. Praças trancadas.

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
      6. Se o jogador buscar o SAMIM após as 19h, ele DEVE encontrar fechado.
      7. O custo do Bom Prato (R$ 1,00) deve ser descontado se ele comer lá.

      Exemplo: "Você caminha pela Rua 13 de Maio. O sol está forte. A fila do Bom Prato dobra a esquina. Você tem R$ ${gameState?.money ?? 0}. O cheiro de comida te atrai, mas a fila vai demorar 1 hora. O que faz?"
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
