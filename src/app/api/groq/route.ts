import { groq } from "@ai-sdk/groq";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";

// Initialize Redis if credentials are provided
const kvUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const kvToken =
	process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

if (kvUrl && kvToken) {
	redis = new Redis({
		url: kvUrl,
		token: kvToken,
	});
	ratelimit = new Ratelimit({
		redis: redis,
		limiter: Ratelimit.slidingWindow(10, "1 m"),
		analytics: true,
	});
}

// Fallback in-memory rate limiting map
const requestCounts = new Map<string, { count: number; resetTime: number }>();

async function checkRateLimit(identifier: string): Promise<boolean> {
	if (ratelimit) {
		try {
			const { success } = await ratelimit.limit(identifier);
			return success;
		} catch (error) {
			console.error(
				"[Groq API] Redis rate limit falhou, caindo para in-memory",
				error,
			);
		}
	} else if (process.env.NODE_ENV === "production") {
		console.warn(
			"[Groq API] AVISO: Rate limit distribuído não configurado em produção. Usando in-memory fallback vulnerável a abusos em ambiente serverless.",
		);
	}

	// Fallback to in-memory check
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
		const groqApiKey = process.env.GROQ_API_KEY;
		if (!groqApiKey) {
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
		const isAllowed = await checkRateLimit(ip);
		if (!isAllowed) {
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
