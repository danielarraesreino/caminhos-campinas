import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY; // SEM NEXT_PUBLIC

// Rate limiting simples (em produção, usar Upstash Redis ou Vercel KV)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
	const now = Date.now();
	const limit = requestCounts.get(identifier);

	if (!limit || now > limit.resetTime) {
		requestCounts.set(identifier, { count: 1, resetTime: now + 60000 }); // 1 minuto
		return true;
	}

	if (limit.count >= 10) {
		// Máximo 10 requisições por minuto
		return false;
	}

	limit.count++;
	return true;
}

export async function POST(req: NextRequest) {
	try {
		// Validação da chave de API
		if (!GROQ_API_KEY) {
			console.error("[Groq API] Chave de API não configurada");
			return NextResponse.json(
				{ success: false, error: "Configuração do servidor incompleta" },
				{ status: 500 },
			);
		}

		// Rate limiting básico
		const ip =
			req.headers.get("x-forwarded-for") ||
			req.headers.get("x-real-ip") ||
			"unknown";
		if (!checkRateLimit(ip)) {
			return NextResponse.json(
				{ success: false, error: "Muitas requisições. Aguarde um momento." },
				{ status: 429 },
			);
		}

		// Parse do body
		const body = await req.json();
		const { prompt, type } = body;

		if (!prompt || typeof prompt !== "string") {
			return NextResponse.json(
				{ success: false, error: "Prompt inválido" },
				{ status: 400 },
			);
		}

		// Validação de tamanho (evita abuso)
		if (prompt.length > 2000) {
			return NextResponse.json(
				{ success: false, error: "Prompt muito longo (máx 2000 caracteres)" },
				{ status: 400 },
			);
		}

		// Chamada à API Groq usando AI SDK
		console.log(
			`[Groq API] Processando prompt - IP: ${ip}, Type: ${type || "none"}`,
		);

		const startTime = Date.now();
		const result = await generateText({
			model: groq("llama-3.3-70b-versatile"),
			prompt: prompt,
		});
		const responseTime = Date.now() - startTime;

		if (!result.text) {
			throw new Error("Resposta vazia da IA");
		}

		// Log de sucesso e performance
		console.log(
			`[Groq API] Sucesso - IP: ${ip}, Type: ${type || "none"}, Tempo: ${responseTime}ms`,
		);

		// Registrar métrica
		try {
			const { apiMetrics } = await import("@/utils/apiMetrics");
			apiMetrics.add({
				timestamp: new Date().toISOString(),
				responseTime,
				success: true,
				ip,
				type,
			});
		} catch (metricsError) {
			console.warn("Erro ao registrar métrica:", metricsError);
		}

		return NextResponse.json({
			success: true,
			text: result.text,
			metadata: {
				model: "llama-3.3-70b-versatile",
				timestamp: new Date().toISOString(),
				responseTime: responseTime,
			},
		});
	} catch (error) {
		console.error("[Groq API] Erro:", error);

		// Registrar erro nas métricas
		try {
			const { apiMetrics } = await import("@/utils/apiMetrics");
			apiMetrics.add({
				timestamp: new Date().toISOString(),
				responseTime: 0,
				success: false,
				ip:
					req.headers.get("x-forwarded-for") ||
					req.headers.get("x-real-ip") ||
					"unknown",
				type: undefined,
				error: error instanceof Error ? error.message : String(error),
			});
		} catch (metricsError) {
			console.warn("Erro ao registrar métrica de erro:", metricsError);
		}

		return NextResponse.json(
			{
				success: false,
				error:
					"Erro ao processar requisição. Tente novamente em alguns instantes.",
			},
			{ status: 500 },
		);
	}
}
