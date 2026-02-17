import { AgentOrchestrator } from "@/lib/agents/AgentOrchestrator";
import type { AgentContext } from "@/lib/agents/types";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
	try {
		// Check if API key is configured
		const apiKey = process.env.GROQ_API_KEY;

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
		let { messages, gameState, mode } = body || {};

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
		console.log("🎮 Game state present:", !!gameState);
		console.log("🤖 Agent Mode:", mode || "default (Narrative)");

		// Prepare Context
		const context: AgentContext = {
			messages,
			gameState,
			// We can pass other overrides here if needed
		};

		// Orchestrate
		const orchestrator = AgentOrchestrator.getInstance();
		const result = await orchestrator.route(context, mode);

		console.log("✅ Agent stream created");
		return result.response;
	} catch (error) {
		console.error("❌ API Error DETAILS:", error);
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
