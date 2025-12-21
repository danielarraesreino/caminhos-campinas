import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		// Check if API key is configured
		const apiKey = process.env.GROQ_API_KEY;
		console.log("🔑 Groq API Key status:", apiKey ? "✅ Configured" : "❌ Missing");

		if (!apiKey) {
			console.error("❌ GROQ_API_KEY is not set!");
			return new Response(
				JSON.stringify({
					error: "API key not configured",
					message: "Please add GROQ_API_KEY to .env.local - Get your free key at https://console.groq.com/keys",
				}),
				{ status: 500, headers: { "Content-Type": "application/json" } },
			);
		}

		const { messages, gameState }: { messages: UIMessage[]; gameState?: any } = await req.json();
		console.log("📨 Received messages:", messages?.length || 0);
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
		const result = streamText({
			model: groq("llama-3.3-70b-versatile"),
			system: systemPrompt,
			messages: convertToModelMessages(messages),
		});

		console.log("✅ Groq stream created, sending UI message response");
		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("❌ API Error DETAILS:", error);
		console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
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
