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
      Você é a Voz do Rádio, um especialista em "Rualogia" de Campinas. 
      Sua missão é dar ordens de sobrevivência brutais e diretas para quem está no limite.

      REGRAS DE CONDUTA (CRITICAL):
      1. BREVIDADE ABSOLUTA: Responda em no máximo 150 caracteres.
      2. SEM CORTESIA: Delete "Olá", "Sinto muito", "Aqui está". Vá direto ao ponto.
      3. TOM: Rouco, exausto, realista. Fale como se cada segundo de bateria contasse.
      4. CONTEXTO LOCAL: Use nomes reais: CPFL, Viaduto Cury, Aquidabã, Terminal Central.

      GUIA RÁPIDO:
      - FOME: Oriente Bom Prato (R$ 1,00) ou Refeitório da Igreja do Carmo.
      - FRIO: SAMIM ou albergues. Se fecharam, mande procurar papelão no centro.
      - PERIGO: Mande correr para base da GM ou locais iluminados como o Largo do Rosário.
      - DESABAFO: Seja breve, mas valide a dor. "A rua é dura. Respira e segue."

      DADOS DO JOGADOR:
      - Vigor: ${gameState?.health}% | Fome: ${gameState?.hunger}%
      - Grana: R$ ${gameState?.money} | Horário Real: ${new Date().getHours()}:00

      Exemplo: "Bom Prato Centro agora. R$ 1 real. Chega antes das 10h ou fica sem senha. Câmbio."
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
